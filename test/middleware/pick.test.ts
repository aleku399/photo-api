import { expect } from "chai";
import { mockRequest, mockResponse } from "mock-req-res";
import { pick } from "../../src/middleware/pick";

describe("Remove createdAt and updateAt fields from requestBody", function () {
  context("When the fields are sent as part of the request body", function () {
    it("Removes the unwanted fields", function () {
      const req = mockRequest({
        body: {
          name: "v1b3m",
          age: 50,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      const res = mockResponse();

      pick(req, res, function () {
        const { body } = req;
        expect(body).to.haveOwnProperty("name");
        expect(body.name).to.equal("v1b3m");
        expect(body).to.haveOwnProperty("age");
        expect(body.age).to.equal(50);
        expect(body).to.not.haveOwnProperty("createdAt");
        expect(body).to.not.haveOwnProperty("updatedAt");
      });
    });
  });
});
