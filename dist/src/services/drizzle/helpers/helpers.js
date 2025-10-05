"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonBuildObject = jsonBuildObject;
exports.jsonAggBuildObject = jsonAggBuildObject;
const drizzle_orm_1 = require("drizzle-orm");
function jsonBuildObject(shape) {
    const chunks = [];
    Object.entries(shape).forEach(([key, value]) => {
        if (chunks.length > 0) {
            chunks.push(drizzle_orm_1.sql.raw(','));
        }
        chunks.push(drizzle_orm_1.sql.raw(`'${key}',`));
        chunks.push((0, drizzle_orm_1.sql) `${value}`);
    });
    return (0, drizzle_orm_1.sql) `jsonb_build_object(${drizzle_orm_1.sql.join(chunks)})`;
}
function jsonAggBuildObject(shape, idColumn = 'id') {
    return (0, drizzle_orm_1.sql) `coalesce(
    json_agg(DISTINCT ${jsonBuildObject(shape)}) FILTER (WHERE ${(0, drizzle_orm_1.sql) `${shape[idColumn]} IS NOT NULL`}),
    '${(0, drizzle_orm_1.sql) `[]`}'
  )`;
}
