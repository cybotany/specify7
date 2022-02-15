/*
 * This is a composition model that loads the Specify datamodel JSON and
 * reifies it into the objects defined in specifymodel.ts and
 * specifyfield.ts.
 */

import { error } from './assert';
import type { AnySchema } from './datamodelutils';
import { load } from './initialcontext';
import { schemaBase } from './schemabase';
import { schemaExtras } from './schemaextras';
import { LiteralField, Relationship } from './specifyfield';
import { type TableDefinition, SpecifyModel } from './specifymodel';
import type { IR, RA } from './types';

export type SchemaLocalization = {
  readonly name: string | null;
  readonly desc: string | null;
  readonly format: string | null;
  readonly aggregator: string | null;
  readonly ishidden: 0 | 1;
  readonly items: IR<{
    readonly name: string | null;
    readonly desc: string | null;
    readonly format: string | null;
    readonly picklistname: string | null;
    readonly weblinkname: string | null;
    readonly isrequired: boolean;
    readonly ishidden: boolean;
  }>;
};
// The schema config / localization information is loaded dynamically.
export let localization: IR<SchemaLocalization> = undefined!;

const processFields = <FIELD_TYPE extends LiteralField | Relationship>(
  fields: FIELD_TYPE[],
  frontEndFields: RA<FIELD_TYPE>
): RA<FIELD_TYPE> => [
  ...fields.sort((left, right) =>
    left.label?.localeCompare(right.label ?? '') ? 1 : -1
  ),
  ...frontEndFields.map((field) => {
    field.overrides.isReadOnly = true;
    return field;
  }),
];

export const fetchContext = Promise.all([
  load<RA<TableDefinition>>('/context/datamodel.json', 'application/json'),
  load<IR<SchemaLocalization>>(
    '/context/schema_localization.json',
    'application/json'
  ),
] as const).then(([tables, data]) => {
  localization = data;
  // @ts-expect-error Assigning to read-only value
  schemaBase.models = Object.fromEntries(
    tables
      .map((tableDefinition) => {
        const model = new SpecifyModel(tableDefinition);
        return [tableDefinition, model] as const;
      })
      .map(([tableDefinition, model]) => {
        const [frontEndFields, frontEndRelationships] = schemaExtras[
          model.name
        ]?.(model) ?? [[], []];

        model.literalFields = processFields(
          tableDefinition.fields.map(
            (fieldDefinition) => new LiteralField(model, fieldDefinition)
          ),
          frontEndFields
        );
        model.relationships = processFields(
          tableDefinition.relationships.map(
            (relationshipDefinition) =>
              new Relationship(model, relationshipDefinition)
          ),
          frontEndRelationships
        );
        model.fields = [...model.literalFields, ...model.relationships];

        return [model.name, model] as const;
      })
  );
});

export const schema = schemaBase;

// Returns a schema model object describing the named Specify model.
export function getModel(name: string): SpecifyModel | undefined {
  const lowerCase = name.toLowerCase();
  return Object.values(schema.models as unknown as IR<SpecifyModel>).find(
    (model) => model.name.toLowerCase() === lowerCase
  );
}

/*
 * Looks up a schema model object describing Specify model using the Specify
 * tableId integer.
 */
export const getModelById = <SCHEMA extends AnySchema>(
  tableId: number
): SpecifyModel<SCHEMA> =>
  (Object.values(schema.models).find((model) => model.tableId === tableId) as
    | SpecifyModel<SCHEMA>
    | undefined) ?? error(`Model with id ${tableId} does not exist`);
