import React from 'react';

import { useAsyncState } from '../../hooks/useAsyncState';
import { commonText } from '../../localization/common';
import { formsText } from '../../localization/forms';
import { f } from '../../utils/functools';
import type { RA } from '../../utils/types';
import { Button } from '../Atoms/Button';
import type { AnySchema } from '../DataModel/helperTypes';
import type { SpecifyResource } from '../DataModel/legacyTypes';
import type { Relationship } from '../DataModel/specifyField';
import type { SpecifyTable } from '../DataModel/specifyTable';
import { format } from '../Formatters/formatters';
import { Dialog, dialogClassNames } from '../Molecules/Dialog';
import { TableIcon } from '../Molecules/TableIcon';
import { ResourceView } from './ResourceView';

export type DeleteBlocker = {
  readonly table: SpecifyTable;
  readonly field: string;
  readonly id: number;
};

export function DeleteBlocked({
  resource: parentResource,
  blockers,
  onClose: handleClose,
  onDeleted: handleDeleted,
}: {
  readonly resource: SpecifyResource<AnySchema>;
  readonly blockers: RA<DeleteBlocker>;
  readonly onClose: () => void;
  readonly onDeleted: () => void;
}): JSX.Element | null {
  const [preview, setPreview] = React.useState<
    | {
        readonly resource: SpecifyResource<AnySchema>;
        readonly field: Relationship | undefined;
      }
    | undefined
  >(undefined);

  const [data, setData] = useAsyncState(
    React.useCallback(
      async () =>
        Promise.all(
          blockers.map(async ({ table, field, id }) => {
            const resource = new table.Resource({ id });
            return f.all({
              field:
                parentResource.specifyTable.getRelationship(field) ?? field,
              resource,
              formatted: await format(resource, undefined, true),
            });
          })
        ),
      [blockers]
    ),
    true
  );
  React.useEffect(
    () =>
      Array.isArray(data) && data.length === 0 ? handleDeleted() : undefined,
    [data, handleDeleted]
  );

  return Array.isArray(data) ? (
    typeof preview === 'object' ? (
      <BlockerPreview
        field={preview.field}
        parentResource={parentResource}
        resource={preview.resource}
        onClose={(): void => setPreview(undefined)}
        onDeleted={(): void =>
          setData(data.filter(({ resource }) => resource !== preview.resource))
        }
      />
    ) : (
      <Dialog
        buttons={commonText.close()}
        className={{
          container: dialogClassNames.wideContainer,
        }}
        header={formsText.deleteBlocked()}
        onClose={handleClose}
      >
        {formsText.deleteBlockedDescription()}
        {/* BUG: apply these styles everywhere where necessary */}
        <table className="grid-table grid-cols-[minmax(0,1fr),auto] gap-2">
          <thead>
            <tr>
              <th scope="col">{formsText.record()}</th>
              <th scope="col">{formsText.relationship()}</th>
            </tr>
          </thead>
          <tbody>
            {data.map(({ formatted, field, resource }, index) => (
              <tr key={index}>
                <td>
                  <Button.LikeLink
                    // BUG: consider applying these styles everywhere
                    className="max-w-full overflow-auto text-left"
                    onClick={(): void =>
                      setPreview({
                        resource,
                        field: typeof field === 'object' ? field : undefined,
                      })
                    }
                  >
                    <TableIcon label name={resource.specifyTable.name} />
                    {formatted}
                  </Button.LikeLink>
                </td>
                <td>{typeof field === 'object' ? field.label : field}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Dialog>
    )
  ) : null;
}

function BlockerPreview({
  resource,
  parentResource,
  field,
  onClose: handleClose,
  onDeleted: handleDeleted,
}: {
  readonly resource: SpecifyResource<AnySchema>;
  readonly parentResource: SpecifyResource<AnySchema>;
  readonly field: Relationship | undefined;
  readonly onClose: () => void;
  readonly onDeleted: () => void;
}): JSX.Element {
  return (
    <ResourceView
      dialog="modal"
      isDependent={false}
      isSubForm={false}
      resource={resource}
      onAdd={undefined}
      onClose={handleClose}
      onDeleted={(): void => {
        handleDeleted();
        handleClose();
      }}
      onSaved={(): void => {
        if (
          typeof field === 'object' &&
          resource.get(field.name) !== parentResource.get('resource_uri')
        )
          handleDeleted();
        handleClose();
      }}
    />
  );
}
