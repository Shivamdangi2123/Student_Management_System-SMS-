require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;
app.get("/ping", (req, res) => {
  res.send("pong");
});
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
