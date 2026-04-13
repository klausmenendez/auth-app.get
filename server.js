const fs=require('fs')
const app = express();
app.use(cookieParser());
const jwt=require('jsonwebtoken')
const SECRET_KEY='secret_key'
const public_key=fs.readFileSync("./keys/public.pem", "utf8");
function authenticatetoken(req,res,next){
  try{
const token=req.cookies.token
const {alg}=jwt.decode(token)
if (alg==="HS256"){
  verifywithHMAC(token,public_key)
}
else{
verifywithRSA(token,SECRET_KEY)


}

} 
catch(err){
  return res.status(401)
}
}
function generateToken(payload, expiresIn='1h'){
  try{
    return jwt.sign(payload, SECRET_KEY, { expiresIn })
  }
  catch(err){
    console.error("Error generating token")
    return null;
  }
}

app.use(express.json());
app.use(express.static("public"));
app.get("/public-key", (req,res)=> {res.type("text/plain").send(public_key)})

/* LOGIN */
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = getUser(username);

  if (user && user.password === password) {
    const token = generateToken({ userId: user.id, username: user.username });
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour
    return res.json({ success: true, token });
  }

  return res.status(401).json({ success: false });
});

/* REGISTER */
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  try {
    const user = createUser(username, password);
    const token = generateToken({ userId: user.id, username: user.username });
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour
    res.json({ success: true, token });
  } catch {
    res.status(400).json({ success: false, error: "User exists" });
  }
});

/* serve pages */
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "auth-app/public/login.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "auth-app/public/login.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "auth-app/public/register.html")));
app.get("/dashboard", authenticatetoken, (req, res) => res.sendFile(path.join(__dirname, "auth-app/public/dashboard.html")));

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
