require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const app = express();
const flash = require('connect-flash')
const session = require('express-session')
const SECRET_SESSION = process.env.SECRET_SESSION;
const passport = require('./config/ppConfig')
const isLoggedIn = require('./middleware/isLoggedIn')
const db = require('./models')

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);
app.use(session ({
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: true
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) =>{
  console.log(res.locals)
  res.locals.alerts = req.flash()
  res.locals.currentUser = req.user;
  next()
})

/* ------ ROUTES ------ */

app.get('/', (req, res) => {
    db.review.findAll()
    .then(reviews =>{
      res.render('index', {reviews});
    })

});

app.get('/profile', isLoggedIn, (req, res) => {
  const {id, name, email} = req.user.get()
  res.render('profile', {id, name, email});
});


app.use('/auth', require('./controllers/auth'));
app.use('/book', require('./controllers/book'))


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;
