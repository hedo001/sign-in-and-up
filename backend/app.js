const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const secretKey = "your-secret-key"; // Replace this with your secret key

// Sample user data (replace with your user database or storage mechanism)
const users = [
  { id: 1, username: "user1", password: "password1" }, // plaintext password: 'password1'
  { id: 2, username: "user2", password: "password2" }, // plaintext password: 'password2'
];

// Middleware to parse JSON data
app.use(bodyParser.json());
app.use(cors());

// Authorization middleware
function authenticateToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Login route - issue a JWT token upon successful login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user || user.password !== password) {
    return res.sendStatus(401);
  }

  const token = jwt.sign({ id: user.id, username: user.username }, secretKey, {
    expiresIn: "1h", // Token expires in 1 hour
  });

  res.json({ token });
});

// Signup route
app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists in the database
  if (users.find((u) => u.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  const newUser = { id: users.length + 1, username, password };
  const token = jwt.sign(
    { id: newUser.id, username: newUser.username },
    secretKey,
    {
      expiresIn: "1h", // Token expires in 1 hour
    }
  );
  users.push(newUser);
  res.json({ message: "Signup successful", user: newUser, token });
});

// GET users route (requires authentication)
app.get("/users", authenticateToken, (req, res) => {
  // Here, you can fetch user data from the database or any other storage mechanism.
  // For demonstration purposes, we are just returning the authenticated user details without passwords.
  const filteredUsers = users.map((user) => ({
    id: user.id,
    username: user.username,
  }));
  res.json({ users: filteredUsers });
});

// POST user route (requires authentication)
app.post("/users", authenticateToken, (req, res) => {
  // Here, you can create a new user and save it to the database or any other storage mechanism.
  // For demonstration purposes, we are just returning the authenticated user details along with the request body.
  const newUser = req.body;
  newUser.id = users.length + 1;
  users.push(newUser);
  res.json({ user: newUser });
});

// Start the server
const port = 7777; // Replace with your desired port number
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
