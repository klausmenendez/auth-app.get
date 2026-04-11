const express = require("express");
const { getUser, createUser } = require("./db");
const { logEvent } = require("./logger");
const { detectBruteForce, detectInjection } = require("./detector");

const app = express();

app.use(express.json());
app.use(express.static("public"));

/* ---------------- AUTO-SEED DATABASE ---------------- */
// Auto-seed with random users if database is empty (for demo purposes)
const adjectives = ["happy","swift","brave","calm","eager","fierce","gentle","jolly","kind","lively","merry","noble","proud","quiet","smart","wise","bold","cool","dark","epic","fast","grand","hot","icy"];
const nouns = ["tiger","eagle","wolf","bear","hawk","lion","shark","fox","dragon","phoenix","falcon","panther","cobra","raven","otter","badger"];

function generateUsername() {
  return `${adjectives[Math.floor(Math.random()*adjectives.length)]}_${nouns[Math.floor(Math.random()*nouns.length)]}${Math.floor(Math.random()*999)}`;
}
function generatePassword() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  let pw = "";
  for (let i = 0; i < 8 + Math.floor(Math.random()*8); i++) pw += chars.charAt(Math.floor(Math.random()*chars.length));
  return pw;
}

// Check if DB is empty and seed if so
try {
  if (!getUser("test_placeholder")) {
    console.log("Seeding database with 50 random users for demo...");
    let created = 0;
    for (let i = 0; i < 50; i++) {
      try {
        createUser(generateUsername(), generatePassword());
        created++;
      } catch(e) { /* skip duplicates */ }
    }
    console.log(`Seeded ${created} users.`);
  }
} catch(e) { /* DB might be empty or have issues */ }

/* ---------------- LOGIN ---------------- */
app.get('/', (req, res) => {
  res.redirect('/login.html');
});
app.post("/login", (req, res) => {
  const { username, password } = req.body;


 
  detectInjection(username);

  const user = getUser(username);
  const success = user && user.password === password;

  logEvent({
    event: success ? "LOGIN_SUCCESS" : "LOGIN_FAIL",
    user: username,
    ip: req.ip
  });

  detectBruteForce(req.ip, username, success ? "SUCCESS" : "FAIL");

  if (success) return res.json({ success: true });
  return res.status(401).json({ success: false });
});

/* ---------------- REGISTER ---------------- */
app.get('/register', (req, res) => {
  res.redirect('/register.html');
});
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  try {
    createUser(username, password);

    const user = getUser(username);

    return res.json({
      success: true,
      username: user.username,
      rawUser: user
    });
  } catch (err) {
    return res.status(400).json({ success: false });
  }
});
/* ---------------- START ---------------- */
app.listen(3000, () => {
  console.log("Auth + Detection system running on :3000");
});
