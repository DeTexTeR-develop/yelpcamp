//schema for our campgrounds

const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const CampGroundSchema = new Schema({
    title: String,
    price: Number,
    image:String,
    description: String,
    location: String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

//when find one and delete will be called after deleting this function will run and will have access to doc which is deleted

CampGroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground' , CampGroundSchema);