const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Details = require("../models/Details");
const e = require("express");

// landing page
exports.landing_page = (req, res) => {
  res.render("landing");
};

// Login page
exports.login_get = (req, res) => {
  const error = req.session.error;
  delete req.session.error;
  res.render("login", { err: error });
};

exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    req.session.error = "Invalid Credencials";
    return res.redirect("/login");
  }

  if(!user.isAdmin){
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      req.session.error = "Invalid Credentials";
      return res.redirect("/login");
    }

    req.session.isAuth = true;
    req.session.username = user.username;
    req.session.email = user.email;
    res.redirect("/dashboard");
  }

  else if(user.isAdmin){
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      req.session.error = "Invalid Credentials";
      return res.redirect("/login");
    }

    req.session.isAuth = true;
    req.session.username = user.username;
    req.session.email = user.email;
    res.redirect("/admin/dashboard");
  }
};

// Register page
exports.register_get = (req, res) => {
  const error = req.session.error;
  delete req.session.error;
  res.render("register", { err: error });
};

exports.register_post = async (req, res) => {
  const { username, email, phone, state, city, gender, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    req.session.error = "User already exists";
    return res.redirect("/register");
  }

  const hasdPsw = await bcrypt.hash(password, 12);

  user = new User({
    username,
    email,
    phone,
    state,
    city,
    gender,
    password: hasdPsw,
  });

  await user.save();
  res.redirect("/login");
};

// Dashboard page
exports.dashboard_get = async (req, res) => {
  const email = req.session.email;
  const user = await User.findOne({ email });
  const details = await Details.find({ email : email });
  res.render("profile", { user,details });
};

// Log out
exports.logout_post = (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/login");
  });
};

// Edit profile page
exports.edit_get = async (req, res) => {
  const email = req.session.email;
  const user = await User.findOne({ email });
  res.render("edit", {user});
};

exports.edit_post = async (req, res) => {
  const email = req.session.email;
  const user = await User.findOne({ email });

  const { username, phone, state, city, password } = req.body;


  const hasdPsw = await bcrypt.hash(password, 12);
  isMatch = await bcrypt.compare(hasdPsw, user.password);

  user.username = username;
  user.phone = phone;
  user.state = state;
  user.city = city;
  if(!isMatch && password)
    user.password = hasdPsw;

  await user.save();

  if(!user.isAdmin){
    res.redirect("/dashboard");
  }
    
  else if(user.isAdmin){
    res.redirect("/admin/dashboard");
  }
    
};

// Admin dashboard page
exports.admin_dash = async (req,res) => {
  const email = req.session.email;
  const user = await User.findOne({ email });
  const all = await User.find({isAdmin:false});
  res.render("admin_dashboard",{ user,all });
}

exports.details = async (req,res) => {
  const email = req.query.email;
  const user = await User.findOne({ email });
  const details = await Details.find({ email : email});
  res.render("details", { user,details });
};

exports.delete = async (req,res) => {
  const email = req.query.email2;
  await User.deleteOne({ email: email });
  res.redirect("/admin/dashboard");
};

exports.add_details_get = (req,res) => {
  const email = req.query.email;
  res.render("add",{ email });
};

exports.add_details_post = async (req,res) => {
  const { date,offer,clicks,unique_clicks,conversions,epc,unique_epc,revenue,email } = req.body;
  
  let detail = new Details({
    email,
    date,
    offer,
    clicks,
    unique_clicks,
    conversions,
    epc,
    unique_epc,
    revenue,
  });

  await detail.save();

  const user = await User.findOne({ email });
  const details = await Details.find({ email : email });
  res.render("details", { user,details });
};

exports.deleted = async (req,res) => {
  const id = req.query.id2;
  const email = req.query.email2;
  await Details.deleteOne({ _id: id });

  const user = await User.findOne({ email });
  const details = await Details.find({ email : email });
  res.render("details", { user,details });
};

exports.edit_detail_get = async (req, res) => {
  const id = req.query.id;
  const data = await Details.findOne({ _id: id });
  res.render("edit_detail", { data });
};

exports.edit_detail_post = async (req,res) => {
  const { date,offer,clicks,unique_clicks,conversions,epc,unique_epc,revenue,email,id } = req.body;

  const detail = await Details.findOne({ _id : id });

  detail.date = date;
  detail.offer = offer;
  detail.clicks = clicks;
  detail.unique_clicks = unique_clicks;
  detail.conversions = conversions;
  detail.epc = epc;
  detail.unique_epc = unique_epc;
  detail.revenue = revenue;

  await detail.save();

  const user = await User.findOne({ email });
  const details = await Details.find({ email : email });
  res.render("details", { user,details });  
};