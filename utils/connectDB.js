import mongoose from 'mongoose'

const connectDB = async () => {
    if(mongoose.connections[0].readyState){
        console.log('Already connected.')
        return;
    }
    await mongoose.connect(process.env.MONGODB_URL)
    .then((result) => {
        if(result.connections[0].readyState) console.log("Database Connected successfully!");
    })
    .catch(err => console.log("Connection to DB failed! reason : "+err));
}


export default connectDB