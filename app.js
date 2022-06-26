const { AsyncLocalStorage } = require('async_hooks');
const express = require('express');
const { default: mongoose, mongo, models } = require('mongoose');
const app = express();
const path = require('path');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
    console.log("Database connected");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', async (req, res) => {
    const allcamprounds = await Campground.find({});
    res.render('campgrounds/index', {allcamprounds});
})

app.get('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    const selectedCamp = await Campground.findById(id);
    res.render('campgrounds/show', {selectedCamp});

})
app.listen(3000, ()=> {
    console.log("Listening on port 3000");
})