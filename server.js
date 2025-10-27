
const connectDB = require('./config/database');

const app =require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

connectDB()
.then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((error)=>{
    console.error('Failed to connect to the database', error);
});

