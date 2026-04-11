const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "logs", "auth.log");

function logEvent(event) {
  const entry = {
    timestamp: new Date().toISOString(),
    ...event
  };

  fs.appendFileSync(logFile, JSON.stringify(entry) + "\n");
}

module.exports = { logEvent };
