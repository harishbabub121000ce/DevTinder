import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const URI = "mongodb+srv://harishbabub121000ce:cY2zUFiqqRsxGrbi@namastecluster.u5ia6jq.mongodb.net/DevTinder?retryWrites=true&w=majority&appName=NamasteCluster"
    await mongoose.connect(
      URI
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection error", error);
    throw error;
  }
};

export default connectDB;
