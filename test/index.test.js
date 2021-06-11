import dotenv from "dotenv";
import supertest from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import accomodationRouter from "../src/services/accomodation/index.js";
import AccomodationModel from "../src/services/accomodation/schema.js";

dotenv.config();

const request = supertest(app);

beforeAll((done) => {
  console.log(process.env.MONGO_CONNECTION);
  mongoose
    .connect(process.env.MONGO_CONNECTION + "/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to Atlas in test.");
      done();
    });
});

afterAll((done) => {
  mongoose.connection.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

describe("Stage I - Testing the test env", () => {
  it("should test that true is true", () => {
    expect(true).toBe(true);
  });

  it("should test that false is not true", () => {
    expect(false).not.toBe(true);
  });

  it("should test that false is falsy", () => {
    expect(false).toBeFalsy();
  });

  it("should expect that the test key is 123", () => {
    console.log(process.env.TEST_KEY);
    expect(process.env.TEST_KEY).toBeDefined();
    expect(process.env.TEST_KEY).toBe("123");
  });
});

describe("Checking application main endpoints", () => {
  it("should check that the /test endpoint is working", async () => {
    const response = await request.get("/test");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Test success!");
  });

  it("should check that the /accomodation endpoint is working", async () => {
    const response = await request.get("/accomodation");
    expect(response.status).toBe(200);
  });

  const validData = {
    name: "Das Zimmer",
    description: "Test product",
    maxGuest: 88,
    city: "Berlin",
  };

  it("should check that the /accomodation endpoint is allowing POST requests with valid data", async () => {
    const response = await request.post("/accomodation").send(validData);
    expect(response.status).toBe(201);
    console.log("the body", response.body);
    expect(response.body._id).toBeDefined();
    expect(response.body.description).toEqual(validData.description);
  });

  const invalidData = {
    description: "something seomthing",
  };

  it("should check that the /accomodation endpoint is NOT allowing POST requests with invalid data", async () => {
    const response = await request.post("/accomodation").send(invalidData);
    expect(response.status).toBe(400);
    expect(response.body._id).not.toBeDefined();
  });

  it("should test that the /accomodation endpoint is returning valid data after creating", async () => {
    const response = await request.post("/accomodation").send(validData);

    expect(response.body._id).toBeDefined();

    const accomodation = await AccomodationModel.findById(response.body._id);

    expect(accomodation.createdAt).toStrictEqual(
      new Date(response.body.createdAt)
    );
  });

  it("should test that the /accomodation endpoint is returning all the accomodation available", async () => {
    const accomodationResponse = await request
      .post("/accomodation")
      .send(validData);

    const response = await request.get("/accomodation");

    const included = response.body.accomodation.some(
      (accomodation) => accomodation._id === accomodationResponse.body._id
    );

    expect(included).toBe(true);
  });
});
