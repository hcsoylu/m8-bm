import mongoose from "mongoose";
import app from "./app.js";

const port = 3001 || process.env.PORT;

mongoose
  .connect(process.env.MONGO_CONNECTION + "/prd", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    app.listen(port, () => {
      console.log("Running on port", port);
    })
  )
  .catch((err) => console.log(err));
