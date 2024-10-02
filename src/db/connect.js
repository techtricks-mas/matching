import mongoose from "mongoose";

const dbConnect = () => {
  mongoose.connect(`${process.env.DB_URL}`).then(() => {
    console.log("DB Connected Successfully");
  });
};

export default dbConnect;