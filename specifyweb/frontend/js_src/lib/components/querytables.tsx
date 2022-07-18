import React from 'react';

import type { SpQuery, Tables } from '../datamodel';
import type { SerializedResource } from '../datamodelutils';
import { commonText } from '../localization/common';
import { hasTablePermission, hasToolPermission } from '../permissionutils';
import { getModel, getModelById } from '../schema';
import type { SpecifyModel } from '../specifymodel';
import type { RA } from '../types';
import { filterArray } from '../types';
import { Button, DataEntry, Link, Ul } from './basic';
import { TableIcon } from './common';
import { useBooleanState } from './hooks';
import { icons } from './icons';
import { Dialog, dialogClassNames } from './modaldialog';
import { usePref } from './preferenceshooks';
import { QueryImport } from './queryimport';
import { QueryTablesEdit } from './querytablesedit';

export const defaultQueryTablesConfig: RA<keyof Tables> = [
  'Accession',
  'AddressOfRecord',
  'Agent',
  'Appraisal',
  'Attachment',
  'Author',
  'Borrow',
  'CollectingEvent',
  'CollectingTrip',
  'CollectionObject',
  'CollectionRelationship',
  'ConservDescription',
  'Container',
  'DNASequence',
  'Deaccession',
  'Determination',
  'Disposal',
  'DisposalPreparation',
  'ExchangeIn',
  'ExchangeOut',
  'Exsiccata',
  'ExsiccataItem',
  'FieldNotebook',
  'FieldNotebookPage',
  'FieldNotebookPageSet',
  'Geography',
  'GeologicTimePeriod',
  'Gift',
  'GiftPreparation',
  'GroupPerson',
  'InfoRequest',
  'Journal',
  'LithoStrat',
  'Loan',
  'LoanPreparation',
  'LoanReturnPreparation',
  'Locality',
  'MaterialSample',
  'PaleoContext',
  'Permit',
  'Preparation',
  'Project',
  'ReferenceWork',
  'RepositoryAgreement',
  'Shipment',
  'SpAuditLog',
  'Storage',
  'Taxon',
  'TreatmentEvent',
];

export function useQueryModels(): [
  RA<SpecifyModel>,
  (models: RA<SpecifyModel>) => void
] {
  const [tables, setTables] = usePref('queryBuilder', 'general', 'shownTables');
  const visibleTables =
    tables.length === 0
      ? filterArray(defaultQueryTablesConfig.map(getModel))
      : tables.map(getModelById);
  const accessibleTables = visibleTables.filter(({ name }) =>
    hasTablePermission(name, 'read')
  );
  const handleChange = React.useCallback(
    (models: RA<SpecifyModel>) =>
      setTables(models.map((model) => model.tableId)),
    [setTables]
  );
  return [accessibleTables, handleChange];
}

export function QueryTables({
  isReadOnly,
  queries,
  onClose: handleClose,
}: {
  readonly isReadOnly: boolean;
  readonly queries: RA<SerializedResource<SpQuery>> | undefined;
  readonly onClose: () => void;
}): JSX.Element {
  const [tables] = useQueryModels();

  const [isEditing, handleEditing] = useBooleanState();
  const [isImporting, handleImporting] = useBooleanState();
  return isImporting ? (
    <QueryImport onClose={handleClose} queries={queries} />
  ) : isEditing ? (
    <QueryTablesEdit onClose={handleClose} />
  ) : (
    <Dialog
      icon={<span className="text-blue-500">{icons.documentSearch}</span>}
      onClose={handleClose}
      className={{
        container: dialogClassNames.narrowContainer,
      }}
      header={commonText('newQueryDialogTitle')}
      headerButtons={<DataEntry.Edit onClick={handleEditing} />}
      buttons={
        <>
          {!isReadOnly && hasToolPermission('queryBuilder', 'create') ? (
            <Button.Green onClick={handleImporting}>
              {commonText('import')}
            </Button.Green>
          ) : undefined}
          <span className="-ml-2 flex-1" />
          <Button.Gray onClick={handleClose}>{commonText('close')}</Button.Gray>
        </>
      }
    >
      <Ul>
        {tables.map(({ name, label }, index) => (
          <li key={index}>
            <Link.Default href={`/specify/query/new/${name.toLowerCase()}/`}>
              <TableIcon name={name} label={false} />
              {label}
            </Link.Default>
          </li>
        ))}
      </Ul>
    </Dialog>
  );
}
