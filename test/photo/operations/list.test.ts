import { list } from "../../../src/photo/operations/list";
import { sequelize } from "../../../src/models";
import { testList } from "../../helpers/test-list";

describe("Photo.Operations.List", function () {
  beforeEach(async () => await sequelize.truncate({ cascade: true }));

  testList(list, "contact");
});
