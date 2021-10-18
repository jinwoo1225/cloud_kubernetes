const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.get("/", (req, res, next) => {
  const {ip, method, originalUrl} = req;
  console.log(`${method} ${originalUrl} ${ip}`)
  res.json({
    state: true,
    message: "Hello world!",
  });
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
