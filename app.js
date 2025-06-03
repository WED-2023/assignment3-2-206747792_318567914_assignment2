const express = require("express");
const session = require("client-sessions");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use(
  session({
    cookieName: "session",
    secret: "mySecret", // אפשר לשנות
    duration: 60 * 60 * 1000,
    activeDuration: 1000 * 60 * 5,
  })
);

// Routes
const user = require("./routes/user");
const auth = require("./routes/auth");
const recipes = require("./routes/recipes");

app.use("/user", user);
app.use("/auth", auth);
app.use("/recipes", recipes);

// ברירת מחדל
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// הפעלת השרת
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

