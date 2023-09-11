const mongoose = require("mongoose");
require("dotenv").config();
exports.dbConnect = async () => {
  await mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Db connected Successfully");
    })
    .catch((err) => {
      console.log(err.message);
      process.exit(1);
    });
};
