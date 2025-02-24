const express = require("express");
const favicon = require('serve-favicon');
const morgan = require("morgan");
const path = require("path");
const mongoose = require('mongoose');
const session = require('express-session');
const sessionStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const multer = require("multer");
const compression = require("compression");

const Routes = require("./routes/route");
const user = require("./models/user");

// const uri = "mongodb://localhost:27017/IQUIZA2"; 
// console.log(process.env.PORT);

//online cluster
const uri = `mongodb+srv://ramapp:${process.env.MONGO_PASSWORD}@cluster0-yce8w.mongodb.net/IQUIZA2?retryWrites=true&w=majority`; //?retryWrites=true&w=majority

app = express();

const store = new sessionStore({
    uri: uri,
    collection: 'sessions'
  });

const filefilter = (req, file, cb)=>{
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || !req.body.sid)
  {
    cb(null , true);
  }
  else
  {
    cb(null , false);
  }
};

const filestorage = multer.diskStorage({
    destination: (req,file,cb) => {
      cb(null,"public/img");
    },
    filename: (req,file,cb) => {
      cb(null, req.body.sid + path.extname(file.originalname)); // filename
    }
});

const csrfProtection = csrf();

app.set("view engine","ejs");

app.set("views","views");

app.use(compression());

app.use(express.static(path.join(__dirname,"public")));

app.use(morgan("common"));

app.use(express.urlencoded({ extended: true }));

app.use(multer({storage:filestorage,fileFilter:filefilter}).single("qimg"));

app.use(favicon(path.join(__dirname,"public","img","favicon.ico")));

app.use(Routes.public_routes);

app.use(
    session({
      secret: 'added 5 packages from 5 contributors and audited 379 packages in 4.227s',
      resave: false,
      saveUninitialized: false,
      store: store
    })
);

app.use(csrfProtection);

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    user.findById(req.session.user._id)
        .then(user => {
        req.user = user;
        next();
        })
        .catch(err => console.log(err));
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(Routes.private_routes);

app.use((req,res,next) => {
    res.sendFile(path.join(__dirname,"views","error.html"));
});

app.use((err,req,res,next) => {
  if (req.session) {
    req.session.destroy(err => {
      console.log(err);
    });
  }
  console.log(err);
  res.status(403).redirect('/');
})

mongoose
  .connect(uri,{ useUnifiedTopology: true ,  useNewUrlParser: true })
  .then(result => {
    console.log("Server started");
    app.listen(process.env.PORT || 3000);
  })
  .catch(err => {
    console.log(err);
  });
