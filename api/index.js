const express = require("express"); //importing express
const app = express(); //this is our application
const mongoose = require("mongoose");
const dotenv = require("dotenv"); //import dotenv
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const cors = require("cors");

dotenv.config(); //my configuration

mongoose
  .connect(
    process.env.MONGO_URL
    //unique key
  )
  .then(() => console.log("DB connection success"))
  .catch((err) => {
    console.log(err);
  });
//this is a promise

app.use(cors());
app.use(express.json()); //to get a json from user
app.use("/api/auth", authRoute); //authentication route
app.use("/api/users", userRoute); //we can use our userRoute
app.use("/api/products", productRoute); //product route
app.use("/api/carts", cartRoute); //cart route
app.use("/api/orders", orderRoute); //order route
app.use("/api/checkout", stripeRoute); //order route

app.listen(process.env.PORT || 5000, () => {
  //listen on port 5000
  console.log("Backend server is running");
});
