const express = require("express")

// schemas
const Post = require("../schema/Post")

const router = express.Router()

/**
 * GET /
 * HOME
 */
router.get("", async (req, res) => {
	try {
		const locals = {
			title: "Home",
			des: "Simple blog application",
		}

		let perPage = 10
		let page = req.query.page || 1

		const posts = await Post.aggregate([{ $sort: { createdAt: -1 } }])
			.skip(perPage * page - perPage)
			.limit(perPage)
			.exec()

		const count = await Post.countDocuments()
		const nextPage = parseInt(page) + 1
		const hasNextPage = nextPage <= Math.ceil(count / perPage)

		res.render("index", {
			locals,
			posts,
			current: page,
			nextPage: hasNextPage ? nextPage : null,
		})
	} catch (error) {
		console.log(error)
	}
})

/**
 * GET /
 * Post :id
 */
router.get("/post/:id", async (req, res) => {
	try {
		const locals = { title: "", des: "" }

		let slug = req.params.id

		const post = await Post.findById({ _id: slug })

		locals.title = post.title
		locals.des = post.body

		res.render("post", { locals, post })
	} catch (error) {
		console.log(error)
	}
})

/**
 * POST /
 * Post - searchTerm
 */
router.post("/search", async (req, res) => {
	try {
		const locals = { title: "", des: "Simple blog application" }

		const { searchTerm } = req.body
		const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

		const posts = await Post.find({
			$or: [
				{ title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
				{ body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
			],
		})

		locals.title = `Search ${searchTerm}`

		res.render("search", { locals, posts, searchTerm })
	} catch (error) {
		console.log(error)
	}
})

module.exports = router
