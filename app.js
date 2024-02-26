require("dotenv").config()

const express = require("express")
const expressLayout = require("express-ejs-layouts")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const MongoStore = require("connect-mongo")
const methodOverride = require("method-override")

const connectDb = require("./config/db")
const { isActiveRoute } = require("./helper/routeHelper")

const app = express()
const PORT = 9000

/**
 * starting database connection
 */
connectDb()

/**
 * for form data handling
 */
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(cookieParser())

app.use(methodOverride("_method"))

app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: true,
		store: MongoStore.create({
			mongoUrl: process.env.MONGODB_URL,
		}),
		// cookie: { maxAge: new Date(Date.now() + (3600000)) }
	})
)

/**
 * configuring static files (css js assets)
 */
app.use(express.static("public"))

/**
 * template engine
 */
app.use(expressLayout)
app.set("layout", "./layouts/main")
app.set("view engine", "ejs")

/**
 * global context
 */
app.locals.isActiveRoute = isActiveRoute

// routes
app.use("/", require("./routes/main"))
app.use("/admin", require("./routes/admin"))

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})
