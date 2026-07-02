const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const os = require("os");

const HOST = "0.0.0.0";
const PORT = Number(process.env.PORT || 4173);
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const DATA_FILE = path.join(DATA_DIR, "records.json");
const PASSWORD_SALT = "de71e5e6bf60a41d8ea6f83ad7a51ca388e0f2efbfd4b80d";
const PASSWORD_HASH =
  "3bb2747f8c6603dfe684480c06464d97e5a9a887b771391d8903a507e4a58bf82e41ded679618b9ce5fd8e43071599725bb03235bcefcae9e11746bbe14f3b87";
const SESSION_LIFETIME = 8 * 60 * 60 * 1000;
const MAX_BODY_SIZE = 128 * 1024;

const sessions = new Map();
const loginAttempts = new Map();
let dataQueue = Promise.resolve();

const publicFiles = new Map([
  ["/", "index.html"],
  ["/index.html", "index.html"],
  ["/styles.css", "styles.css"],
  ["/app.js", "app.js"],
  ["/manifest.webmanifest", "manifest.webmanifest"],
  ["/sw.js", "sw.js"],
  ["/assets/pip.svg", "assets/pip.svg"],
]);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
};

function ensureDataFile() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]\n", "utf8");
}

function loadRecords() {
  ensureDataFile();
  try {
    const records = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
}

function saveRecords(records) {
  ensureDataFile();
  const temporary = `${DATA_FILE}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(records, null, 2)}\n`, "utf8");
  fs.renameSync(temporary, DATA_FILE);
}

function queueDataOperation(operation) {
  const next = dataQueue.then(operation, operation);
  dataQueue = next.catch(() => {});
  return next;
}

function sendJson(response, status, payload, extraHeaders = {}) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...securityHeaders(),
    ...extraHeaders,
  });
  response.end(JSON.stringify(payload));
}

function securityHeaders() {
  return {
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  };
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      size += Buffer.byteLength(chunk);
      if (size > MAX_BODY_SIZE) {
        reject(new Error("Request is too large."));
        request.destroy();
        return;
      }
      body += chunk;
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON."));
      }
    });
    request.on("error", reject);
  });
}

function validateRecord(record) {
  if (!record || typeof record !== "object") return "Invalid story record.";
  if (!isText(record.recordId, 8, 120)) return "Invalid record ID.";
  if (!isText(record.participantId, 1, 48)) return "Invalid participant code.";
  if (!isText(record.moment, 1, 160)) return "Invalid moment.";
  if (!isText(record.node, 1, 80)) return "Invalid community node.";
  if (!isText(record.feeling, 1, 80)) return "Invalid feeling.";
  if (!isText(record.support, 1, 120)) return "Invalid support choice.";
  if (!Number.isInteger(record.importanceScore) || record.importanceScore < 1 || record.importanceScore > 4) {
    return "Invalid importance score.";
  }
  if (!record.completedAt || Number.isNaN(Date.parse(record.completedAt))) return "Invalid completion time.";
  if (String(record.note || "").length > 600) return "Story note is too long.";
  return "";
}

function isText(value, minimum, maximum) {
  return typeof value === "string" && value.length >= minimum && value.length <= maximum;
}

function parseCookies(request) {
  return Object.fromEntries(
    String(request.headers.cookie || "")
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      })
  );
}

function currentSession(request) {
  const token = parseCookies(request).ns_admin;
  if (!token) return null;
  const session = sessions.get(token);
  if (!session || session.expiresAt <= Date.now()) {
    sessions.delete(token);
    return null;
  }
  return { token, ...session };
}

function requireAdmin(request, response) {
  const session = currentSession(request);
  if (!session) {
    sendJson(response, 401, { error: "Researcher password required." });
    return null;
  }
  return session;
}

function verifyPassword(password) {
  if (typeof password !== "string" || password.length > 128) return false;
  const candidate = crypto.scryptSync(password, PASSWORD_SALT, 64);
  const expected = Buffer.from(PASSWORD_HASH, "hex");
  return candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected);
}

function loginAllowed(address) {
  const now = Date.now();
  const recent = (loginAttempts.get(address) || []).filter((time) => now - time < 10 * 60 * 1000);
  loginAttempts.set(address, recent);
  return recent.length < 8;
}

function recordFailedLogin(address) {
  const attempts = loginAttempts.get(address) || [];
  attempts.push(Date.now());
  loginAttempts.set(address, attempts);
}

async function handleApi(request, response, pathname) {
  if (pathname === "/api/health" && request.method === "GET") {
    sendJson(response, 200, { ok: true, service: "Neighbour Signals" });
    return;
  }

  if (pathname === "/api/records" && request.method === "POST") {
    try {
      const record = await readJsonBody(request);
      const validationError = validateRecord(record);
      if (validationError) return sendJson(response, 400, { error: validationError });
      const result = await queueDataOperation(() => {
        const records = loadRecords();
        if (records.some((item) => item.recordId === record.recordId)) return "duplicate";
        records.push(record);
        saveRecords(records);
        return "created";
      });
      if (result === "duplicate") return sendJson(response, 409, { error: "Record already stored." });
      sendJson(response, 201, { ok: true });
    } catch (error) {
      sendJson(response, 400, { error: error.message });
    }
    return;
  }

  if (pathname === "/api/login" && request.method === "POST") {
    const address = request.socket.remoteAddress || "unknown";
    if (!loginAllowed(address)) {
      sendJson(response, 429, { error: "Too many attempts. Please wait ten minutes." });
      return;
    }
    try {
      const { password } = await readJsonBody(request);
      if (!verifyPassword(password)) {
        recordFailedLogin(address);
        sendJson(response, 401, { error: "Incorrect password." });
        return;
      }
      loginAttempts.delete(address);
      const token = crypto.randomBytes(32).toString("hex");
      sessions.set(token, { expiresAt: Date.now() + SESSION_LIFETIME });
      sendJson(
        response,
        200,
        { authenticated: true },
        {
          "Set-Cookie": `ns_admin=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${
            SESSION_LIFETIME / 1000
          }`,
        }
      );
    } catch (error) {
      sendJson(response, 400, { error: error.message });
    }
    return;
  }

  if (pathname === "/api/session" && request.method === "GET") {
    sendJson(response, 200, { authenticated: Boolean(currentSession(request)) });
    return;
  }

  if (pathname === "/api/logout" && request.method === "POST") {
    const session = currentSession(request);
    if (session) sessions.delete(session.token);
    sendJson(response, 200, { authenticated: false }, { "Set-Cookie": "ns_admin=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0" });
    return;
  }

  if (pathname === "/api/records" && request.method === "GET") {
    if (!requireAdmin(request, response)) return;
    const records = loadRecords().sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
    sendJson(response, 200, { records });
    return;
  }

  if (pathname === "/api/records" && request.method === "DELETE") {
    if (!requireAdmin(request, response)) return;
    await queueDataOperation(() => saveRecords([]));
    sendJson(response, 200, { ok: true });
    return;
  }

  sendJson(response, 404, { error: "API route not found." });
}

function serveStatic(response, pathname) {
  const relative = publicFiles.get(pathname);
  if (!relative) {
    sendJson(response, 404, { error: "Page not found." });
    return;
  }
  const filePath = path.join(ROOT, relative);
  fs.readFile(filePath, (error, data) => {
    if (error) {
      sendJson(response, 404, { error: "Page not found." });
      return;
    }
    const extension = path.extname(filePath);
    response.writeHead(200, {
      "Content-Type": contentTypes[extension] || "application/octet-stream",
      "Cache-Control": pathname === "/sw.js" ? "no-cache" : "public, max-age=300",
      ...securityHeaders(),
    });
    response.end(data);
  });
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(request, response, url.pathname);
      return;
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      sendJson(response, 405, { error: "Method not allowed." });
      return;
    }
    serveStatic(response, url.pathname);
  } catch {
    sendJson(response, 500, { error: "Unexpected server error." });
  }
});

function startServer() {
  ensureDataFile();
  server.listen(PORT, HOST, () => {
    const addresses = [];
    for (const values of Object.values(os.networkInterfaces())) {
      for (const item of values || []) {
        if (item.family === "IPv4" && !item.internal) addresses.push(`http://${item.address}:${PORT}`);
      }
    }
    console.log("\nNeighbour Signals is running.\n");
    console.log(`Main device: http://localhost:${PORT}`);
    addresses.forEach((address) => console.log(`Phone/tablet: ${address}`));
    console.log("\nKeep this window open while participants are using the game.");
    console.log("Press Control+C to stop.\n");
  });
}

if (require.main === module) startServer();

module.exports = {
  server,
  startServer,
  verifyPassword,
  validateRecord,
  loadRecords,
  saveRecords,
};
