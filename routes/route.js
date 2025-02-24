const express = require("express");
const path = require("path");

const login = require("../controller/login");
const logout = require("../controller/logout");
const signup = require("../controller/signup");
const dashboard = require("../controller/dashboard");
const category = require("../controller/category");
const subcategory = require("../controller/subcategory");
const atten = require("../controller/attendedquiz");
const set1 = require("../controller/setquiz1");
const set2 = require("../controller/setquiz2");
const set3 = require("../controller/setquiz3");
const set4 = require("../controller/setquiz4");
const set5 = require("../controller/setquiz5");
const quiz = require("../controller/quiz");
const quizset = require("../controller/quizzesset");
const result = require("../controller/result");
const answer = require("../controller/answer");
const comment = require("../controller/comment");
const isAuth = require('../middleware/is_auth');
const isSetter = require('../middleware/is_setter');
const isnotAuth = require('../middleware/is_not_auth');
const { isvalid1,isvalid2,isvalid3 } = require('../validators/validator');

private_routes = express.Router();
public_routes = express.Router();

public_routes.get("/home",(req,res,next) => {
    res.sendFile(path.join(__dirname,"..","views","home.html"));
});

private_routes.get("/error",(req,res,next) => {
    res.sendFile(path.join(__dirname,"..","views","error.html"));
});

private_routes.get("/login",isnotAuth,(req,res,next) => {
    res.render("login",{
        errorMessage: '',
        oldinput: {
            username: '',
        },
        validationErrors: []});
});

private_routes.get("/signup",(req,res,next) => {
    res.render("signup",{
        errorMessage: '',
        oldinput: {
            fname : '',
            lname: '',
            mail: '',
            username: '',
        },
        validationErrors: []});
});

private_routes.get("/dashboard/profile", isAuth ,dashboard.profile);

private_routes.get("/category", isAuth ,category);

private_routes.get("/subcategory", isAuth ,subcategory);

private_routes.get("/dashboard", isAuth ,dashboard.dash);

private_routes.get("/attendedquiz", isAuth ,atten);

private_routes.get("/quizzesset", isAuth , isSetter ,quizset.quizset);

private_routes.get("/setquiz1", isAuth , isSetter ,set1.sq1g);

private_routes.get("/setquiz2", isAuth , isSetter ,set2.sq2g);

private_routes.get("/setquiz3", isAuth , isSetter ,set3.sq3g);

private_routes.get("/setquiz4", isAuth , isSetter ,set4.sq4g);

private_routes.get("/setquiz5", isAuth , isSetter ,set5.sq5g);

private_routes.get("/quiz/:quizid", isAuth ,quiz.qz);

private_routes.get("/answer/:quizid", isAuth ,answer.ans);

private_routes.get("/comment/:quizid", isAuth ,comment.cg);

private_routes.post("/setquiz1", isAuth , isSetter ,set1.sq1p);

private_routes.post("/setquiz2", isAuth , isSetter ,set2.sq2p);

private_routes.post("/setquiz3", isAuth , isSetter ,set3.sq3p);

private_routes.post("/setquiz4", isAuth , isSetter, isvalid3 ,set4.sq4p);

private_routes.post("/setquiz5", isAuth , isSetter ,set5.sq5p);

private_routes.post("/comment", isAuth ,comment.cp);

private_routes.post("/result",  isAuth ,result.rescal);

private_routes.post("/login", isvalid2 ,login);

private_routes.post("/logout", isAuth ,logout);

private_routes.post("/signup", isvalid1 ,signup);

public_routes.get("/",(req,res,next) => {
    res.redirect("/home");
});

module.exports.private_routes = private_routes;

module.exports.public_routes = public_routes;