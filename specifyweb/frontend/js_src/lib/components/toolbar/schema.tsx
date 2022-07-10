/**
 * Data Model viewer
 */

import React from 'react';

import { f } from '../../functools';
import { adminText } from '../../localization/admin';
import { commonText } from '../../localization/common';
import { welcomeText } from '../../localization/welcome';
import { wbText } from '../../localization/workbench';
import { schema } from '../../schema';
import {
  javaTypeToHuman,
  localizedRelationshipTypes,
} from '../../schemaconfighelper';
import type { SpecifyModel } from '../../specifymodel';
import { getSystemInfo } from '../../systeminfo';
import type { RA } from '../../types';
import { fieldFormat, resolveParser } from '../../uiparse';
import { Button, className, Container, H2, H3, Link } from '../basic';
import { TableIcon } from '../common';
import { downloadFile } from '../filepicker';
import { useTitle } from '../hooks';
import { formatNumber } from '../internationalization';
import type { UserTool } from '../main';

function Table({
  children,
  headers,
}: {
  readonly headers: RA<string>;
  readonly children: RA<JSX.Element>;
}): JSX.Element {
  return (
    <div
      role="table"
      className={`grid-table grid-cols-[repeat(var(--cols),auto)] border rounded
        flex-1 overflow-auto`}
      style={{ '--cols': headers.length } as React.CSSProperties}
    >
      <div role="row">
        {headers.map((label, index) => (
          <div
            key={index}
            role="columnheader"
            className={`sticky top-0 p-2 font-bold border bg-[color:var(--background)]`}
          >
            {label}
          </div>
        ))}
      </div>
      <div role="rowgroup">{children}</div>
    </div>
  );
}

function Cell({
  children,
}: {
  readonly children: React.ReactNode;
}): JSX.Element {
  return (
    <div role="cell" className="p-2 border">
      {children}
    </div>
  );
}

const parser = f.store(() =>
  resolveParser(
    {},
    {
      type: 'java.lang.Boolean',
    }
  )
);

const booleanFormatter = (value: boolean): string =>
  fieldFormat(undefined, parser(), value);

/*
 * FEATURE: add sorting by column headers
 * FEATURE: adapt this page for printing
 */
export function DataModelView({
  model: initialModel,
}: {
  readonly model: SpecifyModel | undefined;
}): JSX.Element {
  useTitle(commonText('databaseSchema'));

  const [model] = React.useState<SpecifyModel | undefined>(initialModel);

  return typeof model === 'object' ? (
    <Container.Full>
      <div className="flex items-center gap-2">
        <TableIcon name={model.name} label={false} />
        <H2 className="text-2xl">{model.name}</H2>
      </div>
      <H3>{commonText('fields')}</H3>
      <Table
        headers={[
          commonText('name'),
          commonText('label'),
          commonText('description'),
          commonText('hidden'),
          commonText('readOnly'),
          commonText('required'),
          commonText('type'),
          commonText('length'),
          commonText('databaseColumn'),
        ]}
      >
        {model.literalFields.map((field) => (
          <div role="row" key={field.name}>
            {[
              field.name,
              field.label,
              field.getLocalizedDesc(),
              booleanFormatter(field.isHidden),
              booleanFormatter(field.isReadOnly),
              booleanFormatter(field.isRequired),
              javaTypeToHuman(field.type, undefined),
              <span className="tabular-nums flex justify-end w-full">
                {f.maybe(field.length, formatNumber)}
              </span>,
              field.dbColumn,
            ].map((label, index) => (
              <Cell key={index}>{label}</Cell>
            ))}
          </div>
        ))}
      </Table>
      <H3>{commonText('relationships')}</H3>
      <Table
        headers={[
          commonText('name'),
          commonText('label'),
          commonText('description'),
          commonText('hidden'),
          commonText('readOnly'),
          commonText('required'),
          commonText('type'),
          commonText('databaseColumn'),
          commonText('relatedModel'),
          commonText('otherSideName'),
          commonText('dependent'),
        ]}
      >
        {model.relationships.map((field) => (
          <Link.Default
            key={field.name}
            role="row"
            href={`/specify/datamodel/${field.relatedModel.name.toLowerCase()}/`}
          >
            {[
              field.name,
              field.label,
              field.getLocalizedDesc(),
              booleanFormatter(field.isHidden),
              booleanFormatter(field.isReadOnly),
              booleanFormatter(field.isRequired),
              localizedRelationshipTypes[field.type] ?? field.type,
              field.dbColumn,
              <>
                <TableIcon name={field.relatedModel.name} label={false} />
                {field.relatedModel.name}
              </>,
              field.otherSideName,
              booleanFormatter(field.isDependent()),
            ].map((label, index) => (
              <Cell key={index}>{label}</Cell>
            ))}
          </Link.Default>
        ))}
      </Table>
    </Container.Full>
  ) : (
    <Container.Full>
      <div className="flex items-center gap-2">
        <H2 className="text-2xl">
          {`${welcomeText('schemaVersion')} ${getSystemInfo().schema_version}`}
        </H2>
        <span className="flex-1 -ml-2" />
        <Link.Green
          href="/context/datamodel.json"
          className={`${className.navigationHandled} print:hidden`}
          download
        >
          {commonText('downloadAsJson')}
        </Link.Green>
        <Button.Green
          className="print:hidden"
          onClick={(): void =>
            void downloadFile(
              `Specify 7 datamodel - v${getSystemInfo().schema_version}.tsv`,
              dataModelToTsv()
            ).catch(console.error)
          }
        >
          {commonText('downloadAsTsv')}
        </Button.Green>
      </div>
      <Table
        headers={[
          commonText('name'),
          commonText('label'),
          commonText('system'),
          commonText('hidden'),
          commonText('tableId'),
          commonText('fieldCount'),
          commonText('relationshipCount'),
        ]}
      >
        {Object.entries(schema.models).map(([key, model]) => (
          <Link.Default
            key={key}
            href={`/specify/datamodel/${model.name.toLowerCase()}/`}
            role="row"
          >
            {[
              <>
                <TableIcon name={model.name} label={false} />
                {model.name}
              </>,
              model.label,
              booleanFormatter(model.isSystem),
              booleanFormatter(model.isHidden),
              <span className="tabular-nums flex justify-end w-full">
                {model.tableId}
              </span>,
              <span className="tabular-nums flex justify-end w-full">
                {formatNumber(model.fields.length)}
              </span>,
              <span className="tabular-nums flex justify-end w-full">
                {formatNumber(model.relationships.length)}
              </span>,
            ].map((label, index) => (
              <Cell key={index}>{label}</Cell>
            ))}
          </Link.Default>
        ))}
      </Table>
    </Container.Full>
  );
}

export const userTool: UserTool = {
  task: 'schema',
  title: commonText('databaseSchema'),
  isOverlay: false,
  view: '/specify/datamodel/',
  groupLabel: commonText('developers'),
};

const dataModelToTsv = (): string =>
  [
    [
      adminText('table'),
      commonText('label'),
      commonText('system'),
      commonText('hidden'),
      commonText('tableId'),
      commonText('name'),
      commonText('label'),
      commonText('description'),
      commonText('hidden'),
      commonText('readOnly'),
      commonText('required'),
      wbText('relationshipInline'),
      commonText('type'),
      commonText('length'),
      commonText('databaseColumn'),
      commonText('relatedModel'),
      commonText('otherSideName'),
      commonText('dependent'),
    ],
    ...Object.values(schema.models).flatMap((model) =>
      f.var(
        [
          model.name,
          model.label,
          booleanFormatter(model.isSystem),
          booleanFormatter(model.isHidden),
          model.tableId,
        ],
        (commonColumns) => [
          ...model.literalFields.map((field) => [
            ...commonColumns,
            field.name,
            field.label,
            field.getLocalizedDesc(),
            booleanFormatter(field.isHidden),
            booleanFormatter(field.isReadOnly),
            booleanFormatter(field.isRequired),
            booleanFormatter(false),
            javaTypeToHuman(field.type, undefined),
            field.length,
            field.dbColumn,
            '',
            '',
            '',
          ]),
          ...model.relationships.map((relationship) => [
            ...commonColumns,
            relationship.name,
            relationship.label,
            relationship.getLocalizedDesc(),
            booleanFormatter(relationship.isHidden),
            booleanFormatter(relationship.isReadOnly),
            booleanFormatter(relationship.isRequired),
            booleanFormatter(true),
            localizedRelationshipTypes[relationship.type] ?? relationship.type,
            '',
            relationship.dbColumn,
            relationship.relatedModel.name,
            relationship.otherSideName,
            booleanFormatter(relationship.isDependent()),
          ]),
        ]
      )
    ),
  ]
    .map((line) => line.join('\t'))
    .join('\n');
