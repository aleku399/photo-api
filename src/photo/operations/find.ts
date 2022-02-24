import { FindOptions } from "sequelize";
import { models } from "../../models";
import { Photo, PhotoAttrs } from "../model";

export function find(options?: FindOptions<PhotoAttrs>): Promise<Photo> {
  return models.Photo.findOne({
    ...options,
    rejectOnEmpty: true
  });
}

export default find;
