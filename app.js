const { AsyncLocalStorage } = require('async_hooks');
const express = require('express');
const { default: mongoose, mongo, models } = require('mongoose');
const app = express();
const path = require('path');
const { findById, findByIdAndDelete } = require('./models/campground');
const Campground = require('./models/campground');
const methodOverrride = require('method-override');
const ejsMate = require('ejs-mate');
const { stat } = require('fs');
const { wrap } = require('module');
const ExpressError = require('./utils/ExpressError')
const wrapAsync = require('./utils/catchAsync')

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
    console.log("Database connected");
});



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);
app.use(express.urlencoded({extended: true}));
app.use(methodOverrride('_method'))

app.get('/', (req, res) => {
    res.render('campgrounds/home')
})

app.get('/campgrounds', async (req, res) => {
    const allcamprounds = await Campground.find({});
    res.render('campgrounds/index', {allcamprounds});
})

app.get('/campgrounds/create', (req, res) => {
    res.render('campgrounds/create');
})

app.post('/campgrounds',wrapAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}));

app.get('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', {campground});
})

//update Campground

app.get('/campgrounds/:id/edit', async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground});

});

// we can catch error in async in 2 ways

// app.put('/campgrounds/:id', async (req, res, next) => {
//     try{
//         const { id } = req.params;
//         const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
//         res.redirect(`/campgrounds/${campground._id}`)
//     }
//     catch(err){
//         next(e);
//     }
// });

//                                               or



app.put('/campgrounds/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}));

//delete campground

app.delete('/campgrounds/:id', async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.use((err, req, res, next) => {
    res.send('oh no error ')
})
app.listen(3000, ()=> {
    console.log("Listening on port 3000");
})
