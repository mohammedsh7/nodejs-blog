require("dotenv").config()

const express = require("express")
const expressLayout = require("express-ejs-layouts")

const connectDb = require("./config/db")

const app = express()
const PORT = 9000

// connect to database
connectDb()

// middlewares
app.use(express.static("public"))
/**
 * template engine
 */
app.use(expressLayout)
app.set("layout", "./layouts/main")
app.set("view engine", "ejs")

// routes
app.use("/", require("./routes/main"))

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})
