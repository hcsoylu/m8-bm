import express from "express";
import AccomodationModel from "./schema.js";

const accomodationRouter = express.Router();

accomodationRouter.get("/", async (req, res, next) => {
  try {
    const accomodations = await AccomodationModel.find();
    if (accomodations) {
      res.send(accomodations);
    } else {
      res.status(404).send("No accomodation yet!");
    }
  } catch (error) {
    next(error);
  }
});

accomodationRouter.post("/", async (req, res, next) => {
  try {
    const newAccomodation = new AccomodationModel(req.body);
    const theNewAccomodation = await newAccomodation.save();
    res.status(201).send(theNewAccomodation);
  } catch (error) {
      if (error.name === "ValidationError") {
      let errors = {};

      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });

      return res.status(400).send(errors);
    }
    res.status(500).send("Something went wrong");
  }
});

accomodationRouter.get("/:accoId", async (req, res, next) => {
  try {
    const id = req.params.accoId;
    const accomodation = await AccomodationModel.findById(id);
    if (accomodation) {
      res.send(accomodation);
    } else {
      const error = new Error("No accomodation found!");
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

accomodationRouter.put("/:accoId", async (req, res, next) => {
  try {
    const accomodation = await AccomodationModel.findByIdAndUpdate(
      req.params.accoId,
      req.body,
      { runValidators: true, new: true }
    );
    if (accomodation) {
      res.send(`${req.params.accoId} is updated!`);
    } else {
      const error = new Error(`${req.params.accoId} is not found!`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

accomodationRouter.delete("/:accoId", async (req, res, next) => {
  try {
    const accomodation = await AccomodationModel.findByIdAndDelete(
      req.params.accoId
    );
    if (accomodation) {
      res.send(`item ${req.params.accoId} is deleted.`);
    } else {
      res.send(404).send(`Accomodation ${req.params.accoId} is not found!`);
    }
  } catch (error) {
    next(error);
  }
});

export default accomodationRouter;
