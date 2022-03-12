import { ajax } from './ajax';
import type { AnySchema } from './datamodelutils';
import { contextUnlockedPromise } from './initialcontext';
import type { SpecifyResource } from './legacytypes';
import type { LiteralField } from './specifyfield';
import type { Collection } from './specifymodel';
import type { RA } from './types';
import { defined, filterArray } from './types';
import { fieldFormat, resolveParser } from './uiparse';

export type Formatter = {
  readonly name: string | undefined;
  readonly title: string | undefined;
  readonly className: string | undefined;
  readonly isDefault: boolean;
  readonly switchFieldName: string | undefined;
  readonly fields: RA<{
    readonly value: string | undefined;
    readonly fields: RA<{
      readonly fieldName: string;
      readonly separator: string;
      readonly formatter: string;
      readonly fieldFormatter: string | undefined;
    }>;
  }>;
};

export type Aggregator = {
  readonly name: string | undefined;
  readonly title: string | undefined;
  readonly className: string | undefined;
  readonly isDefault: boolean;
  readonly separator: string;
  readonly format: string;
  /*
   * Readonly ending: string;
   * readonly count: string;
   * readonly orderFieldName: string | undefined;
   */
};

export const fetchFormatters: Promise<{
  readonly formatters: RA<Formatter>;
  readonly aggregators: RA<Aggregator>;
}> = contextUnlockedPromise
  .then(async () =>
    ajax<Document>('/context/app.resource?name=DataObjFormatters', {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: { Accept: 'application/xml' },
    })
  )
  .then(({ data: definitions }) => ({
    formatters: filterArray(
      Array.from(definitions.getElementsByTagName('format'), (formatter) => {
        const switchElement = formatter.getElementsByTagName('switch')[0];
        if (typeof switchElement === 'undefined') return undefined;
        const isSingle =
          switchElement.getAttribute('single')?.trim() !== 'false';
        const field = switchElement.getAttribute('field')?.trim();
        const fields = Array.from(
          switchElement.getElementsByTagName('fields'),
          (fields) => ({
            value: fields.getAttribute('value') ?? undefined,
            fields: Array.from(
              fields.getElementsByTagName('field'),
              (field) => ({
                fieldName: field.textContent?.trim() ?? '',
                separator: field.getAttribute('sep') ?? '',
                formatter: field.getAttribute('formatter')?.trim() ?? '',
                fieldFormatter: field.getAttribute('format')?.trim(),
              })
            ).filter(({ fieldName }) => fieldName.length > 0),
          })
        ).filter(({ fields }) => fields.length > 0);
        // External DataObjFormatters are not supported
        if (fields.length === 0) return undefined;
        return {
          name: formatter.getAttribute('name')?.trim() ?? undefined,
          title: formatter.getAttribute('title')?.trim() ?? undefined,
          className: formatter.getAttribute('class')?.trim() ?? undefined,
          isDefault: formatter.getAttribute('default')?.trim() === 'true',
          fields,
          switchFieldName:
            typeof field === 'string' && !isSingle ? field : undefined,
        };
      })
    ),
    aggregators: filterArray(
      Array.from(
        definitions.getElementsByTagName('aggregator'),
        (aggregator) => {
          return {
            name: aggregator.getAttribute('name')?.trim() ?? undefined,
            title: aggregator.getAttribute('title')?.trim() ?? undefined,
            className: aggregator.getAttribute('class')?.trim() ?? undefined,
            isDefault: aggregator.getAttribute('default')?.trim() === 'true',
            separator: aggregator.getAttribute('separator') ?? '',
            format: aggregator.getAttribute('format') ?? '',
          };
        }
      )
    ),
  }));

export async function format(
  resource: SpecifyResource<AnySchema> | undefined,
  formatterName?: string
): Promise<string | undefined> {
  if (typeof resource !== 'object' || resource === null) return undefined;
  await resource.fetchIfNotPopulated();
  const resolvedFormatterName =
    formatterName ?? resource.specifyModel.getFormat();

  const { formatters } = await fetchFormatters;
  const formatter =
    formatters.find(({ name }) => name === resolvedFormatterName) ??
    formatters.find(
      ({ className, isDefault }) =>
        className === resource.specifyModel.longName && isDefault
    );
  if (typeof formatter === 'undefined') return undefined;

  // Doesn't support switch fields that are in child objects
  const fields =
    typeof formatter.switchFieldName === 'string'
      ? formatter.fields.find(
          ({ value }) =>
            (value ?? '') ===
            (resource.get(formatter.switchFieldName ?? '') ?? '')
        )?.fields ?? formatter.fields[0].fields
      : formatter.fields[0].fields;

  return Promise.all(
    fields.map(async ({ fieldName, formatter, separator, fieldFormatter }) => {
      const formatted = await (
        resource.rgetPromise(fieldName) as Promise<
          string | SpecifyResource<AnySchema> | undefined
        >
      ).then(async (value) => {
        if (formatter.length > 0 && typeof value === 'object')
          return (await format(value, formatter)) ?? '';
        else {
          const field = defined(
            resource.specifyModel.getField(fieldName) as LiteralField
          );
          return fieldFormat(
            field,
            defined(resolveParser(field)),
            value as string | undefined,
            false
          );
        }
      });
      return `${separator}${
        typeof fieldFormatter === 'string' && fieldFormatter === ''
          ? ''
          : formatted
      }`;
    })
  ).then((values) => values.join(''));
}

export async function aggregate(
  collection: Collection<AnySchema>
): Promise<string> {
  const { aggregators } = await fetchFormatters;

  const aggregatorName = collection.model.specifyModel.getAggregator();

  const aggregator =
    aggregators.find(({ name }) => name === aggregatorName) ??
    aggregators.find(
      ({ className, isDefault }) =>
        className === collection.model.specifyModel.longName && isDefault
    );

  if (typeof aggregator === 'undefined')
    throw new Error('Aggregator not found');

  if (!collection.isComplete()) throw new Error('Collection is not complete');

  return Promise.all(
    collection.models.map(async (resource) =>
      format(resource, aggregator.format)
    )
  ).then((formatted) => formatted.join(aggregator.separator));
}
