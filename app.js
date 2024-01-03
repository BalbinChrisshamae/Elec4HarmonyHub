const express = require("express");
const app = express();
const port = 3000;
const session = require('express-session');
const flash = require("express-flash");


app.use(session({
    secret: 'abc',
    resave: false,
    saveUninitialized: false
}));

app.listen(port, (err) => {
    if (err) {
        console.log('Connection Error');
    } else {
        console.log(`Listening to port ${port} `);
    }
});

app.use(flash());

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use('/', require('./routes/route.js'));

