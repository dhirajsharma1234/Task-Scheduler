import "dotenv/config";
import express from "express";
import connectDB from "./db/conn.js";
import router from "./router/route.js";
import morgan from "morgan";
const app = express();

const PORT = process.env.PORT || 8000;

//convert every incoming request data into json data
app.use(express.json());
app.use(morgan("dev"))
app.use(router);

app.listen(PORT,async()=>{
    console.log(`server is listening to the port: ${PORT}`);
    await connectDB()
});