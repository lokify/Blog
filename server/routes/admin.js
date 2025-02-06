import express from "express";
import Post from "../models/Post.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = express.Router();
const adminLayout = "./layout/admin.ejs";
const jwtSecret = "MySecretBlog";
// Check login

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

//Get admin login page

router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    res.render("admin/index", {
      locals,
      layout: adminLayout,
      currentRoute: "/admin",
    });
  } catch (error) {
    console.log(error);
  }
});

//Post admin check login

router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, {
      httpOnly: true,
    });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

//get dashboard

/**
 * GET /
 * Admin Dashboard
 */
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    const data = await Post.find();
    res.render("admin/dashboard", {
      locals,
      data,
      layout: adminLayout,
      currentRoute: "/dashboard",
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * Get
 * Admin- Create Post
 */

router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Create Post",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };
    res.render("admin/add-post", {
      locals,
      layout: adminLayout,
      currentRoute: "/add-post",
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST /
 * Admin - Create Post
 */

router.post("/add-post", authMiddleware, async (req, res) => {
  try {
    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
      });
      await Post.create(newPost);
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});

/** Get
 * Admin-Edit Post
 */

router.get("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const local = {
      title: "Edit Post",
      description: "Nodejs User management",
    };
    const data = await Post.findOne({ _id: req.params.id });
    res.render("admin/edit-post", {
      data,
      adminLayout,
      local,
      currentRoute: "/edit-post",
    });
  } catch (error) {
    console.log(error);
  }
});

/** PUT
 * Admin-Edit Post
 */

router.put("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now(),
    });
    res.redirect(`/edit-post/${req.params.id}`);
  } catch (error) {}
});

/**
 * POST /
 * Admin - Register
 */
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Request Body:", req.body);

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password: hashedPassword });
      res.status(201).json({ message: "User Created", user });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: "User already in use" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.log(error);
  }
});

/**
 * DELETE
 * ADMIN : DELETE POST
 *
 */

router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET
 * Admin: Logout
 */

router.get("/logout", authMiddleware, async (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

export default router;
