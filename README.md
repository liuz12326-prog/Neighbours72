# Neighbour Signals

This version uses the researcher's main computer as the shared data server. It does not use Supabase or another database service.

## What It Does

- Every participant opens the same address supplied by the main computer.
- Answers are saved locally while the participant plays.
- Selecting **Finish session** sends the completed stories to the main computer.
- If the connection drops, completed stories remain queued and retry when the device reconnects.
- Participant devices can submit data but cannot read the shared dataset.
- The `▥` research dashboard requires the researcher password.
- Shared records are stored in `data/records.json` on the main computer.

## Start On macOS

1. Install Node.js if the computer does not already have it.
2. Double-click `start.command`.
3. Keep the Terminal window open.
4. Open the **Main device** address shown in the window on the researcher's computer.
5. Give participants the **Phone/tablet** address shown in the same window.

If macOS blocks the first launch, right-click `start.command`, select **Open**, then confirm.

## Start On Windows

1. Install Node.js if needed.
2. Double-click `start-windows.bat`.
3. Keep the command window open.
4. Share the phone/tablet address shown in the window.

## Network Requirement

The main computer and participant devices must be connected to the same Wi-Fi or local network. The main computer must stay awake and the server window must remain open.

This local-network version is not reachable from a different home, mobile network, or public internet connection. Remote fieldwork requires hosting or a secure tunnel.

## Researcher Access

1. Select `▥` in the top-right corner.
2. Enter the configured researcher password.
3. View all records collected from every connected device.
4. Refresh, export CSV/JSON, or clear the shared data.
5. Select **Log out** before handing the main computer to a participant.

The password is stored only as a salted cryptographic hash in `server.js`. The browser receives a temporary, HttpOnly login cookie that expires after eight hours or when the server restarts.

## Data File

The shared source of truth is:

```text
data/records.json
```

Back up this file during fieldwork. Do not replace or edit it while the server is running.

## Data Collected

Each anonymous story contains:

- participant code, optional age range, and broad Moray area
- role and scenario
- time context
- community node and node type
- feeling and frequency
- importance label and 1–4 score
- preferred support
- attitude to technology
- privacy boundary
- optional free-text note
- completion timestamp and game version

## Fieldwork Test

1. Start the server on the main computer.
2. Open the phone/tablet address on a second device.
3. Complete one test story and select **Finish session**.
4. Open the research dashboard on the main computer.
5. Confirm the story appears and export a CSV.
6. Log out and confirm the dashboard asks for the password again.
