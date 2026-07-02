#!/bin/bash
cd "$(dirname "$0")"
clear
echo "Starting Neighbour Signals..."
echo
node server.js
echo
echo "The server has stopped. Press Return to close this window."
read
