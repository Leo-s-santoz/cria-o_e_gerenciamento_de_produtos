const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

require("dotenv").config();

//import router
const routes = require("./routes");

app.use("/", routes);

//middleware to enable json use
app.use(express.json());

//middleware ro serve stactic files
app.use(express.static(path.join(__dirname, "public")));

//use the router
app.use("/users", routes);

app.listen(port, () => {
  console.log(`servidor rodando na porta ${port}`);
});
