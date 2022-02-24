import Promise from "bluebird";
import { CreateOptions } from "sequelize";

import { models } from "../../models";
import { Photo, PhotoAttrs } from '../model';

export function create(
  photo: PhotoAttrs,
  options?: CreateOptions
): Promise<Photo> {
  return models.Photo.create(photo, options);
}
