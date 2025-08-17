import { sql, type SQL, SelectedFields } from 'drizzle-orm';
import { type SelectResultFields } from 'node_modules/drizzle-orm/query-builders/select.types';

export function jsonBuildObject<T extends SelectedFields<any, any>>(shape: T) {
  const chunks: SQL[] = [];

  Object.entries(shape).forEach(([key, value]) => {
    if (chunks.length > 0) {
      chunks.push(sql.raw(','));
    }

    chunks.push(sql.raw(`'${key}',`));
    chunks.push(sql`${value}`);
  });

  return sql<SelectResultFields<T>>`jsonb_build_object(${sql.join(chunks)})`;
}

export function jsonAggBuildObject<T extends SelectedFields<any, any>>(
  shape: T,
  idColumn: keyof T = 'id' as keyof T
) {
  return sql<SelectResultFields<T>[]>`coalesce(
    json_agg(DISTINCT ${jsonBuildObject(shape)}) FILTER (WHERE ${sql`${shape[idColumn]} IS NOT NULL`}),
    '${sql`[]`}'
  )`;
}