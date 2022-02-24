import Promise from "bluebird";

import { ListQuery, ListResponse } from "../../src/utils/list";
import { expect } from "../chai";
import factory from "../factory";

export function testList<T>(
  listFn: (query: ListQuery) => Promise<ListResponse<T>>,
  factoryName: string
): void {
  context("when there are no records", function () {
    it("returns the correct data", function () {
      return expect(listFn({})).to.be.fulfilled.then(result => {
        expect(result).to.have.property("total", 0);
        expect(result).to.have.property("data").that.deep.eq([]);
      });
    });
  });

  context("when there are records", function () {
    context("and there is no pagination", function () {
      it("returns all data", function () {
        return expect(
          factory.createMany(factoryName, 20).then(() => listFn({}))
        ).to.be.fulfilled.then(result => {
          expect(result).to.have.property("total", 20);
          expect(result).to.have.property("data").that.has.lengthOf(20);
        });
      });
    });

    context("and there is pagination", function () {
      it("returns only enough data for a page", function () {
        return expect(
          factory
            .createMany(factoryName, 20)
            .then(() => listFn({ pageSize: 5, page: 1 }))
        ).to.be.fulfilled.then(result => {
          expect(result).to.have.property("total", 20);
          expect(result).to.have.property("data").that.has.lengthOf(5);
        });
      });
    });
  });
}
