import mongoose from "mongoose";


const URL = process.env.DB_URL;

const connectDB = async() =>{
    try {
        
    const conn = await mongoose.connect(URL);

    if(conn) {
        console.log(`connection successfull to db.............`);
    }

    } catch (error) {
        throw new Error(error.message);
    }
}

export default connectDB;