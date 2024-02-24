const express = require("express")

// schemas
const Post = require("../schema/Post")

const router = express.Router()

/**
 * GET /
 * HOME
 */
router.get("", async (req, res) => {
	const locals = {
		title: "Home",
		des: "Simple blog application",
	}

	// try {
	// 	const 
	// } catch (error) {
		
	// }

	res.render("index", { locals })
})


router.get("/about", (req, res) => {
	const locals = {
		title: "About",
	}

	res.render("about", { locals })
})


// function insertPostData() {
// 	Post.insertMany([
// 		{
// 			title: "Building Blog",
// 			body: "This is the blog body text.",
// 		},
// 		{
// 			title: "10 Tips for Better Time Management",
// 			body: "Learn how to manage your time effectively and boost productivity.",
// 		},
// 		{
// 			title: "The Art of Mindfulness",
// 			body: "Discover the benefits of practicing mindfulness in your daily life.",
// 		},
// 		{
// 			title: "Exploring the Wonders of Nature",
// 			body: "Embark on a journey to explore the beauty and wonders of the natural world.",
// 		},
// 		{
// 			title: "Healthy Eating Habits for a Balanced Life",
// 			body: "Discover simple yet effective tips for maintaining a healthy diet and lifestyle.",
// 		},
// 		{
// 			title: "Mastering the Art of Public Speaking",
// 			body: "Learn essential techniques to become a confident and persuasive public speaker.",
// 		},
// 		{
// 			title: "Travel Photography Tips for Beginners",
// 			body: "Capture breathtaking moments and create stunning travel photos with these beginner-friendly tips.",
// 		},
// 	])
// }

// insertPostData()

module.exports = router


