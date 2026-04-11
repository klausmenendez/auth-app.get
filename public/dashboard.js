async function createUser() {
  const username = document.getElementById("newUser").value;
  const password = document.getElementById("newPass").value;

  const res = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  if (res.ok) {
    alert("User created!");
  } else {
    alert("Error creating user");
  }
}
