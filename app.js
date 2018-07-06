const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');



// const app = express();
// Load  Model
require('./models/User');
require('./models/Story');

// Passport Config
require('./config/passport')(passport);

// Load Routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');

// Load Keys
const keys = require('./config/keys');
 
//Handlebars Helpers 
const {
  truncate,
  stripTags,
  formatDate,
  select,
  editIcon
}= require('./helpers/hbs');
// Map global promises
mongoose.Promise = global.Promise;
// Mongoose Connect
mongoose.connect(keys.mongoURI, { 
  useMongoClient :true
  
}).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));


// mongoose.connect(process.env.MONGODB_URI)
// .once('connected',() => console.log('Connected to the database'))
// .on('error',() => console.log('Some error occured while trying to connect to the database'));

const app = express(); 

//Body Parser middleware
 app.use(bodyParser.urlencoded({ extended: false }))
 app.use(bodyParser.json())

/* @desc Middlware for parsing the requests that hit the server */ 
//app.use(express.json());
//app.use(express.urlencoded({extended : false}));

// Method Override Middleware 
app.use(methodOverride('_method'));
// Handlebars Middleware
app.engine('handlebars', exphbs({ 
  helpers:
  {
    truncate: truncate,
    stripTags: stripTags,
    formatDate: formatDate,
    select: select,
    editIcon : editIcon 
  },
  defaultLayout:'main'
}));
app.set('view engine', 'handlebars');

app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Use Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

const port = process.env.PORT || 5000;

app.listen(port,()=> console.log(`Server running on port :${port}`));





/* @desc Normal Printing of the object */

// const user = {

//   username : 'prateek951',
//   password : 'prateek951'

// };

// console.log(user.username);
// console.log(user.password);


// Destructuring ES6

// const {username,password} = user;



// const {username : username,password : password} = { username : 'prateek951',password : 'prateek951'};


// console.log(username); 
// console.log(password);