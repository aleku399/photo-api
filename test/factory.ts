import * as FactoryGirl from "factory-girl";
import { models } from "../src/models";
import { PhotoAttrs } from "../src/photo/model";

const factory = FactoryGirl.factory;
const adapter = new FactoryGirl.SequelizeAdapter();

factory.setAdapter(adapter);

factory.define("photo", models.Photo, {
  photos: "Doe"
} as PhotoAttrs);

export default factory;
