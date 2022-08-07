const request = require('supertest');
const app  = require('../app');

describe("Test the root path", () => {
  test("It should response the GET method", done => {
    request(app)
      .get("/")
      .then(response => {
        expect(response.status).toBe(200);
        done();
      });
  });
});

describe("Test the campground path", () => {
  test("It should response the GET method", done => {
    request(app)
      .get("/campgrounds")
      .then(response => {
        expect(response.status).toBe(200);
        done();
      });
  });
});