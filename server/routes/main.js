import express from "express";

const router = express.Router();
const local = {
  title: "Nodejs Blog",
  description: "Welcome to Nodejs Blog",
};
router.get("/", (req, res) => {
  res.render("index", { local });
});

router.get("/about", (req, res) => {
  res.render("about", { local });
});

export default router;
