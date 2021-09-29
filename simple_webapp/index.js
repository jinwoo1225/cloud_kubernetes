const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());    

app.get("/", (req, res, next) => {
  res.json({
    state: true,
    message: "Hello world!",
  });
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
