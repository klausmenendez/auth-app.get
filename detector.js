const fs = require("fs");
const path = require("path");

const alertFile = path.join(__dirname, "logs", "alerts.log");

// in-memory tracking (simple SIEM-like behavior)
const failedLogins = {};

function writeAlert(alert) {
  const entry = {
    timestamp: new Date().toISOString(),
    ...alert
  };

  fs.appendFileSync(alertFile, JSON.stringify(entry) + "\n");
}

// detect brute force
function detectBruteForce(ip, username, status) {
  if (!failedLogins[ip]) failedLogins[ip] = 0;

  if (status === "FAIL") {
    failedLogins[ip]++;
  }

  if (status === "SUCCESS") {
    failedLogins[ip] = 0;
  }

  if (failedLogins[ip] >= 5) {
    writeAlert({
      type: "BRUTE_FORCE_DETECTED",
      ip,
      username,
      severity: "HIGH"
    });
  }
}

// detect injection-like patterns
function detectInjection(username) {
  const patterns = [
    /or\s+1=1/i,
    /drop\s+table/i,
    /--/,
    /;/,
    /0x[0-9a-f]+/i
  ];

  const match = patterns.some(p => p.test(username));

  if (match) {
    writeAlert({
      type: "SUSPICIOUS_INPUT_DETECTED",
      username,
      severity: "MEDIUM"
    });
  }
}

module.exports = {
  detectBruteForce,
  detectInjection
};
