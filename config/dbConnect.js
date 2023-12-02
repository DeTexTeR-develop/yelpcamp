const {default: mongoose} = require ("mongoose");

const dbConnect = () => {
    try{
        const connection = mongoose.connect(process.env.DB);
        console.log("database connected");
    }catch(err){
        console.log("Database error");
    }
}

module.exports = dbConnect;