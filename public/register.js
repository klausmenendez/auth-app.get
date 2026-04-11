async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Character blacklist for input validation
  const blacklist = ["'", '%', 'SELECT', 'DROP', 'ORDER', 'ORDER BY', '/', '@', '<', '>', 'script', 'html'];
  for (let i = 0; i < blacklist.length; i++) {
    if (username.includes(blacklist[i])) {
      alert(`Invalid username: contains blocked character/pattern "${blacklist[i]}"`);
      return;
    }
  }

  const res = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (res.ok) {
    alert(`Hello ${data.username}! Your account was created.\n\nRaw DB Result: ${JSON.stringify(data.rawUser, null, 2)}`);
    window.location.href = "/login";
  } else {
    alert("User already exists");
  }
}
