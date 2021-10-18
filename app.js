const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const config = require("config");

const appController = require("./controllers/appController");
const isAuth = require("./middleware/is-auth");
const connectDB = require("./config/db");
const mongoURI = config.get("mongoURI");

const app = express();
connectDB();

const store = new MongoDBStore({
  uri: mongoURI,
  collection: "mySessions",
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use( express.static( "public" ) );

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);


//=================== Routes
// Landing Page
app.get("/", appController.landing_page);

// Login Page
app.get("/login", appController.login_get);
app.post("/login", appController.login_post);

// Register Page
app.get("/register", appController.register_get);
app.post("/register", appController.register_post);

// Dashboard Page
app.get("/dashboard", isAuth, appController.dashboard_get);

//edit profile
app.get("/edit",appController.edit_get);
app.post("/edit",appController.edit_post);

//admin login
app.get("/admin",appController.login_get);
app.post("/admin",appController.login_post);

//admin dashboard
app.get("/admin/dashboard",appController.admin_dash);
app.post("/admin/dashboard",appController.logout_post);

//details here
app.get("/details",appController.details);

//delete user here
app.get("/delete",appController.delete);

//add details
app.get("/add",appController.add_details_get);
app.post("/add",appController.add_details_post);

//delete details
app.get("/deleted", appController.deleted);

//edit details
app.get("/editd",appController.edit_detail_get);
app.post("/editd", appController.edit_detail_post);

app.post("/logout", appController.logout_post);

app.use((err,res,next) => {
	if(err)
		res.render("doubt");
	next();
});

const port = process.env.PORT || 5000 ;

app.listen(port, console.log("App Running on http://localhost:5000"));

// TODO register not working
