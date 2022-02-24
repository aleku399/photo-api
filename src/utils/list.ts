/* eslint-disable indent */
import { isEmpty, Merge, mergeDeepRight, values } from "ramda";
import { FindOptions, Op, WhereOptions } from "sequelize";
import { StringRecordUnknown } from "../../src/types";

export interface ListQuery {
  field?: string;
  order?: "ASC" | "DESC";
  page?: number;
  pageSize?: number;
  ids?: StringRecordUnknown;
  filter?: {
    [key: string]: string | number;
  };
  tableFilter?: {
    [key: string]: string | number;
  };
}

export interface ListResponse<T> {
  total: number;
  data: T[];
}

export function buildQuery(
  query: ListQuery = {}
): Merge<StringRecordUnknown, StringRecordUnknown, "deep"> {
  const options: StringRecordUnknown = mergeDeepRight(
    mergeDeepRight(sort(query), paginate(query)),
    mergeDeepRight(filter(query), byIds(query))
  );

  const tableOptions: StringRecordUnknown = mergeDeepRight(
    mergeDeepRight(sort(query), paginate(query)),
    mergeDeepRight(tableFilter(query), byIds(query))
  );
  const optionsQuery = query.tableFilter ? tableOptions : options;

  return optionsQuery;
}

export function paginate<T>(query: ListQuery): FindOptions<T> {
  if (query.page && query.pageSize) {
    const limit = Number(query.pageSize);
    const page = Number(query.page);
    const offset = limit * (page - 1);

    return { offset, limit };
  }

  return {};
}

export function sort<T>(query: ListQuery): FindOptions<T> {
  if (query.field) {
    return {
      order: [[query.field, query.order || "ASC"]]
    };
  }

  return {};
}

export function filter<T>(query: ListQuery): FindOptions<T> {
  if (query.filter) {
    const filter =
      typeof query.filter === "string"
        ? JSON.parse(query.filter)
        : query.filter;
    if (isEmpty(filter)) return {};
    return {
      where: filter as WhereOptions<T>
    };
  }

  return {};
}

export function tableFilter<T>(query: ListQuery): FindOptions<T> {
  if (query.tableFilter) {
    const filter =
      typeof query.tableFilter === "string"
        ? JSON.parse(query.tableFilter)
        : query.tableFilter;
    const key = Object.keys(filter)[0];
    const value = filter[Object.keys(filter)[0]];
    const tableFilter = isEmpty(filter)
      ? {}
      : key === "score" || key === "workflowNumber" || key === "rating"
      ? {
          [`${key}`]: {
            [Op.gte]: parseFloat(value)
          }
        }
      : key === "role"
      ? { role: value }
      : {
          [`${key}`]: {
            [Op.like]: `%${value}%`
          }
        };
    return {
      where: { ...query.filter, ...tableFilter } as WhereOptions<T>
    };
  }

  return {};
}

export function byIds<T>(query: ListQuery): FindOptions<T> {
  if (query.ids) {
    return {
      where: {
        id: {
          [Op.in]: values(query.ids)
        }
      } as WhereOptions<T>
    };
  }

  return {};
}
