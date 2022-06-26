const mongoose = require('mongoose');
const Cities = require('./cities');
const {descriptors, places} = require('./seedHelpers');
const Campground = require('../models/campground');


mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
    console.log("Database connected");
});

const randomTitle = (arr) => {
    arr[Math.floor(Math.random() * arr.length)];
}
const seedDb = async () =>{
    await Campground.deleteMany({});
    for(let i = 0; i <= 50; i++){
        const randomNumber = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${Cities[randomNumber].city}, ${Cities[randomNumber].state}`,
            // title: `${randomTitle(descriptors)}`                    //why is it not working
            title : `${descriptors[Math.floor(Math.random() * descriptors.length)] +" "+ places[Math.floor(Math.random() * places.length)]}`
            //and this is working 
        });
        // console.log(camp.title);
        await camp.save();
    }
}

seedDb().then(
() => {
    mongoose.connection.close();
}
);