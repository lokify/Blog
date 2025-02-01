import dotenv from "dotenv";
import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import router from "./server/routes/main.js";
import connectDb from "./server/config/db.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

connectDb();

app.use(express.static("public"));

//Templating Engine
app.use(expressEjsLayouts);
app.set("layout", "./layout/main.ejs");
app.set("view engine", "ejs");

app.use("/", router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
