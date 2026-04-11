const { createUser } = require("./db");

// Arrays of random name parts for generating usernames
const adjectives = [
  "happy", "swift", "brave", "calm", "eager", "fierce", "gentle", "jolly",
  "kind", "lively", "merry", "noble", "proud", "quiet", "smart", "wise",
  "bold", "cool", "dark", "epic", "fast", "grand", "hot", "icy"
];

const nouns = [
  "tiger", "eagle", "wolf", "bear", "hawk", "lion", "shark", "fox",
  "dragon", "phoenix", "falcon", "panther", "cobra", "raven", "otter", "badger"
];

// Generate a random username
function generateUsername() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 999);
  return `${adj}_${noun}${num}`;
}

// Generate a random password
function generatePassword() {
  const length = 8 + Math.floor(Math.random() * 8); // 8-16 chars
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Number of users to create
const NUM_USERS = 50;

console.log(`Creating ${NUM_USERS} random users...`);

let created = 0;
let duplicates = 0;

for (let i = 0; i < NUM_USERS; i++) {
  const username = generateUsername();
  const password = generatePassword();

  try {
    createUser(username, password);
    created++;
    console.log(`  [${created}] Created: ${username}`);
  } catch (err) {
    duplicates++;
    console.log(`  [SKIP] Duplicate username: ${username}`);
  }
}

