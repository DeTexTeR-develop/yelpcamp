const { AsyncLocalStorage } = require('async_hooks');
const express = require('express');
const { default: mongoose, mongo, models } = require('mongoose');
const app = express();
const path = require('path');
const { findById, findByIdAndDelete } = require('./models/campground');
const Campground = require('./models/campground');
const methodOverrride = require('method-override');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
    console.log("Database connected");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverrride('_method'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', async (req, res) => {
    const allcamprounds = await Campground.find({});
    res.render('campgrounds/index', {allcamprounds});
})

app.get('/campgrounds/create', (req, res) => {
    res.render('campgrounds/create');
})

app.post('/campgrounds', async (req, res) => {
    const newCamp = new Campground({
        title: req.body.Title,
        location: req.body.location
    })
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
    
});

app.get('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    const selectedCamp = await Campground.findById(id);
    res.render('campgrounds/show', {selectedCamp});
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground});

})

app.put('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/campgrounds/${id}`);
});

app.delete('/campgrounds/:id', async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.listen(3000, ()=> {
    console.log("Listening on port 3000");
})