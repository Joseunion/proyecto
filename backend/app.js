var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var swaggerJSDoc = require('swagger-jsdoc');
require("dotenv").config();
var mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const logger = require('./logger'); 
var cors = require('cors')

var usersRouter = require("./app_server/routes/user");
var reviewsRouter = require("./app_server/routes/review");
var musicaRouter = require("./app_server/routes/musica");
var peliculasRouter = require("./app_server/routes/pelicula");
var librosRouter = require("./app_server/routes/libros");
var videojuegosRouter = require("./app_server/routes/videojuego");
var timelineRouter = require("./app_server/routes/timeline");

var app = express();
app.use(cors())

// swagger definition
var swaggerDefinition = 
{
    openapi: '3.0.0',
    info: {
        title: 'API de gestión de usuarios',
        version: '1.0.0',
        description: 'Descripción del API de RemindsMeOf'
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            },
        },
    },
    security: [{
        bearerAuth: [],
    }],
    host: 'localhost:3000',
    basePath: '/',
    schemes: ['http']
};
// options for the swagger docs
var options = 
{
    // import swaggerDefinitions 
    swaggerDefinition: swaggerDefinition, // path to the API docs
    apis: ['./app_server/routes/*.js'],
};
// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

// connect to atlas mongobd
mongoose
    .connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => logger.info("App.js: Conectado a MongoDB"))
    .catch((err) => logger.error("App.js: Error al conectar a MongoDB", err));

/*
mongoose
    .connect(process.env.DB_URI)
    .then(() => logger.info("App.js:Conectado a MongoDB Atlas"))
    .catch((err) => logger.error("App.js:Error al conectar a MongoDB Atlas" + process.env.DB_URI, err));*/

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

///AQUI ES PELIGROSO
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  }));

// inicializamos passport y sesión.
app.use(passport.initialize());
app.use(passport.session());

//app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/users", usersRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/musica", musicaRouter);
app.use("/api/peliculas", peliculasRouter);
app.use("/api/libros", librosRouter);
app.use("/api/videojuegos", videojuegosRouter);
app.use("/api/timeline", timelineRouter);

// serve swagger
app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    logger.error("Recurso no encontrado");
    res.status(404).send("Recurso no encontrado");
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

// hacer público el repositorio public
app.use(express.static('public'));

module.exports = app;
