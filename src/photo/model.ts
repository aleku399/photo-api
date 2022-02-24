import * as sequelize from "sequelize";

import { UUID } from "../types";

export interface PhotoModel extends sequelize.Model<Photo, PhotoAttrs> {
  associate?(models: sequelize.Models): void;
}

export interface Photo
  extends sequelize.Instance<PhotoAttrs>,
    PhotoAttrs {}

export interface PhotoAttrs {
  photos: string;
  id?: UUID;
}

export type PhotoAttr = keyof PhotoAttrs;

export default function (
  sequelize: sequelize.Sequelize,
  dataTypes: sequelize.DataTypes
): PhotoModel {
  const Photo: PhotoModel = sequelize.define<Photo, PhotoAttrs>(
    "Photo",
    {
      id: {
        type: dataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: dataTypes.UUIDV4
      },
      photos: {
        type: dataTypes.STRING,
        allowNull: true
      }
    },
    {
      updatedAt: false,
      createdAt: false
    }
  );

  return Photo;
}
