import dotenv from "dotenv";
import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import methodOveride from "method-override";
import mainRouter from "./server/routes/main.js";
import adminRouter from "./server/routes/admin.js";
import isActiveRoute from "./server/helpers/routeHelpers.js";
import connectDb from "./server/config/db.js";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from "express-session";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

connectDb();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOveride("_method"));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);
app.use(express.static("public"));

//Templating Engine
app.use(expressEjsLayouts);
app.set("layout", "./layout/main.ejs");
app.set("view engine", "ejs");

app.locals.isActiveRoute = isActiveRoute;
app.use("/", mainRouter);
app.use("/", adminRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
