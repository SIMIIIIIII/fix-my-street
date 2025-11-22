require('dotenv').config()
const Home = require('./routes/home');
const Account = require('./routes/account')
const Incident = require('./routes/incident')
const Login = require('./routes/login')
const Subscribe = require('./routes/subscribe')
const Search = require('./routes/search')

var express = require('express');
var session = require('express-session');
const mongoose = require('mongoose')
var bodyParser = require("body-parser");
var cors = require('cors');

const app = express();

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('connected to Database'))


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    path: '/', 
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 3600000
  }
}));

const PORT = process.env.PORT

app.use("/", Home);
app.use("/account", Account);
app.use("/incident", Incident);
app.use("/login", Login);
app.use("/subscribe", Subscribe);
app.use("/search", Search)

app.listen(PORT, function(){
    console.log(`Server started on port ${PORT}`);
});