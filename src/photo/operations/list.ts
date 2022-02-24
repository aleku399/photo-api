import Promise from "bluebird";
import { FindOptions } from "sequelize";
import { buildQuery, ListQuery, ListResponse } from "../../utils/list";
import { models } from "../../models";
import { PhotoAttrs } from "../model";
import { StringRecordUnknown } from "../../types";

export function list(
  query?: ListQuery,
  findOptions?: FindOptions<PhotoAttrs>
): Promise<ListResponse<PhotoAttrs>> {
  const options: StringRecordUnknown = buildQuery(query);
  return models.Photo.findAndCountAll({
    ...options,
    order: [["name", "ASC"]],
    ...findOptions,
    raw: true
  }).then(({ rows, count }) => ({
    data: rows,
    total: count
  }));
}
