import React from 'react';

import { useLiveState } from '../../hooks/useLiveState';
import { commonText } from '../../localization/common';
import { formsText } from '../../localization/forms';
import type { RA } from '../../utils/types';
import { Button } from '../Atoms/Button';
import { serializeResource } from '../DataModel/helpers';
import type { SerializedResource } from '../DataModel/helperTypes';
import type { SpecifyResource } from '../DataModel/legacyTypes';
import type { SpQuery, Tables } from '../DataModel/types';
import type { SpQueryField } from '../DataModel/types';
import { Dialog, dialogClassNames } from '../Molecules/Dialog';
import { QueryFieldSpec } from '../QueryBuilder/fieldSpec';
import { QueryBuilder } from '../QueryBuilder/Wrapped';
import type { QuerySpec } from './types';
import { wbPlanText } from '../../localization/wbPlan';

const addPath = (
  fields: RA<SerializedResource<SpQueryField>>
): RA<Partial<SerializedResource<SpQueryField>> & { readonly path: string }> =>
  fields.map((field) => ({
    ...field,
    path: QueryFieldSpec.fromStringId(field.stringId, field.isRelFld ?? false)
      .toMappingPath()
      .join('.'),
  }));
export const queryToSpec = (query: SerializedResource<SpQuery>): QuerySpec => ({
  tableName: query.contextName as keyof Tables,
  fields: addPath(query.fields),
  isDistinct: query.selectDistinct,
});

export function FrontEndStatsResultDialog({
  query: originalQuery,
  onClose: handleClose,
  label,
  showClone,
  onEdit: handleEdit,
  onClone: handleClone,
}: {
  readonly query: SpecifyResource<SpQuery>;
  readonly onClose: () => void;
  readonly label: string;
  readonly showClone: boolean;
  readonly onEdit: ((querySpec: QuerySpec) => void) | undefined;
  readonly onClone: ((querySpec: QuerySpec) => void) | undefined;
}): JSX.Element | null {
  const [query, setQuery] = useLiveState(
    React.useCallback(
      () => queryToSpec(serializeResource(originalQuery)),
      [originalQuery]
    )
  );
  const isDisabled = query.fields.length === 0 || handleEdit === undefined;
  const [showEmbeddedMappingView, setShowEmbeddedMappingView] =
    React.useState(true);
  return (
    <Dialog
      buttons={
        <div className="flex flex-1 gap-2">
          {showClone && (
            <Button.Info
              disabled={handleClone === undefined}
              onClick={(): void => {
                handleClone?.(query);
                handleClose();
              }}
            >
              {formsText.clone()}
            </Button.Info>
          )}

          <span className="-ml-2 flex-1" />

          <Button.DialogClose>{commonText.close()}</Button.DialogClose>

          {typeof handleEdit === 'function' && (
            <Button.Info
              disabled={isDisabled}
              onClick={(): void => {
                handleEdit(query);
                handleClose();
              }}
            >
              {commonText.save()}
            </Button.Info>
          )}
        </div>
      }
      headerButtons={
        <>
          <span className="-ml-2 flex-1" />
          <Button.Small
            onClick={() => setShowEmbeddedMappingView(!showEmbeddedMappingView)}
          >
            {showEmbeddedMappingView
              ? wbPlanText.hideFieldMapper()
              : wbPlanText.showFieldMapper()}
          </Button.Small>
        </>
      }
      className={{
        container: dialogClassNames.wideContainer,
      }}
      header={label}
      onClose={handleClose}
    >
      <QueryBuilder
        autoRun={showClone}
        forceCollection={undefined}
        isEmbedded
        query={originalQuery}
        recordSet={undefined}
        onChange={
          typeof handleEdit === 'function'
            ? ({ fields, isDistinct }): void =>
                setQuery({
                  tableName: query.tableName,
                  fields: addPath(fields),
                  isDistinct,
                })
            : undefined
        }
        showEmbeddedMappingView={showEmbeddedMappingView}
      />
    </Dialog>
  );
}
