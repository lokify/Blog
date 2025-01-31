import dotenv from "dotenv";
import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import router from "./server/routes/main.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));

//Templating Engine
app.use(expressEjsLayouts);
app.set("view engine", "ejs");

app.use("/", router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
