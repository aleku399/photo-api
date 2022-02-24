import { create } from "../../../src/photo/operations/create";
import { sequelize } from "../../../src/models";
import { expect } from "../../chai";

describe("Contact.Operations.Create", function () {
  beforeEach(() => sequelize.truncate({ cascade: true }));

  afterEach(() => sequelize.truncate({ cascade: true }));

  context("when the input data is correct", function () {
    it("creates the contact", function () {
      return expect(
        create({
          photos: "primary"
        })
      ).to.be.fulfilled.then(contact => {
        expect(contact).to.have.property("photos", "primary");
      });
    });
  });
});
