import express from "express";
// import mongoDB from "./db/index.js";
import cors from "cors";
import mongoose from "mongoose";
import {
  badRequest,
  notFound,
  unauthorized,
  genericError,
} from "./errorHandlers.js";
import listEndpoints from "express-list-endpoints";
import accomodationRouter from "./services/accomodation/index.js";
import * as OpenApiValidator from "express-openapi-validator";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

import userRouter from "./services/users/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const apiSpec = path.join(__dirname, "apiDesc.yaml");

// const port = 3001 || process.env.PORT;

const app = express();

app.use("/spec", express.static(apiSpec));

app.use(express.json());

app.use(cors());

app.use(
  OpenApiValidator.middleware({
    apiSpec: "./apiDesc.yaml",
    apiSpec,
    validateRequests: true, // (default)
    validateResponses: true, // false by default
  })
);

app.get("/test", (req, res) => {
  res.status(200).send({ message: "Test success!" });
});

app.use("/accomodation", accomodationRouter);

app.use(badRequest);
app.use(notFound);
app.use(unauthorized);
app.use(genericError);

console.table(listEndpoints(app));

// app.listen(port, mongoDB(), () =>
//   console.log(`Example app listening on port port!`)
// );

// mongoose
//   .connect(process.env.MONGO_CONNECTION + 'prd', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(
//     app.listen(port, () => {
//       console.log("Running on port", port);
//     })
//   )
//   .catch((err) => console.log(err));

export default app;
