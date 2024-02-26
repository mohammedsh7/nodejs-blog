const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// schemas
const Post = require("../schema/Post")
const User = require("../schema/User")

const router = express.Router()

const adminLayout = "../views/layouts/admin"

/**
 * Middleware
 * Check Login
 */
const authMiddleware = (req, res, next) => {
	const token = req.cookies.token

	if (!token) {
		return res.status(401).json({ message: "Unauthorized" })
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		console.log("Decoded", decoded)
		req.userId = decoded.userId
		next()
	} catch (error) {
		return res.status(401).json({ message: error?.message })
	}
}

/**
 * GET /
 * Admin - Index page
 */
router.get("", async (req, res) => {
	try {
		const locals = {
			title: "Admin",
			des: "Dashboard",
		}

		res.render("admin/index", { locals, layout: adminLayout })
	} catch (error) {
		console.log(error)
	}
})

/**
 * GET /
 * Admin - Login request
 */
router.post("/login", async (req, res) => {
	try {
		const { username, password } = req.body

		const user = await User.findOne({ username })

		const isPasswordValid = await bcrypt.compare(password, user.password)

		if (!user || !isPasswordValid) {
			res.status(401).json({ message: "Invalid credentials" })
		}

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)

		res.cookie("token", token, { httpOnly: true })

		res.redirect("/admin/dashboard")
	} catch (error) {
		console.log(error)
	}
})

/**
 * GET /
 * Admin - Register request
 */
router.post("/register", async (req, res) => {
	try {
		const { username, password } = req.body

		const hashedPassword = await bcrypt.hash(password, 10)

		// creating user
		await User.create({
			username,
			password: hashedPassword,
		})
			.then((user) => {
				return res.status(200).json({
					message: "User created",
					user,
				})
			})
			.catch((error) => {
				if (error.code === 11000) {
					return res.status(409).json({
						message: "User already in use",
						user,
					})
				}

				return res.status(500).json({
					message: error?.message,
				})
			})
	} catch (error) {
		console.log(error)
	}
})

/**
 * GET /
 * Admin - Dashboard page
 */
router.get("/dashboard", authMiddleware, async (req, res) => {
	try {
		const locals = {
			title: "Dashboard",
			des: "Dashboard",
		}

		const posts = await Post.find()

		res.render("admin/dashboard", { locals, layout: adminLayout, posts })
	} catch (error) {
		console.log(error)
	}
})

/**
 * GET /
 * Admin - Create new post page
 */
router.get("/add-post", authMiddleware, async (req, res) => {
	try {
		const locals = {
			title: "Add post",
			des: "",
		}

		const posts = await Post.find()

		res.render("admin/add-post", { locals, layout: adminLayout, posts })
	} catch (error) {
		console.log(error)
	}
})

/**
 * POST /
 * Admin - Create new post
 */
router.post("/add-post", authMiddleware, async (req, res) => {
	try {
		const { title, body } = req.body

		try {
			const newPostObj = new Post({ title, body })
			await Post.create(newPostObj)

			res.redirect("/admin/dashboard")
		} catch (error) {
			console.log(error)
		}

		const posts = await Post.find()

		res.render("admin/add-post", { layout: adminLayout, posts })
	} catch (error) {
		console.log(error)
	}
})

/**
 * GET /
 * Admin - Edit post page
 */
router.get("/edit-post/:id", authMiddleware, async (req, res) => {
	try {
		const { id } = req.params

		const locals = {
			title: "Edit post",
			des: "",
		}

		const post = await Post.findById({ _id: id })

		res.render("admin/edit-post", { locals, layout: adminLayout, post })
	} catch (error) {
		console.log(error)
	}
})

/**
 * PUT /
 * Admin - Edit post
 */
router.put("/edit-post/:id", authMiddleware, async (req, res) => {
	try {
		const { title, body } = req.body
		const { id } = req.params

		try {
			await Post.findByIdAndUpdate(id, {
				title,
				body,
				updatedAt: Date.now(),
			})

			res.redirect(`/admin/edit-post/${id}`)
		} catch (error) {
			console.log(error)
		}

		const posts = await Post.find()

		res.render("admin/add-post", { layout: adminLayout, posts })
	} catch (error) {
		console.log(error)
	}
})

/**
 * DELETE /
 * Admin - Delete post
 */
router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
	try {
		const { id } = req.params

		const post = await Post.deleteOne({ _id: id })

		res.redirect(`/admin/dashboard`)
	} catch (error) {
		console.log(error)
	}
})

/**
 * GET /
 * Admin - Logout
 */
router.get("/logout", authMiddleware, async (req, res) => {
	res.clearCookie("token")
	// res.json({ message: "Logout successful." })
	res.redirect("/")
})

module.exports = router
