import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import chaiDatetime from "chai-datetime";

chai.use(chaiAsPromised);
chai.use(chaiDatetime);

export const expect = chai.expect;
