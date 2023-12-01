if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
};

const app = require('./app');
const port = 3001;


app.listen(port, ()=> {
    console.log(`Listening on port ${port} `);
})
