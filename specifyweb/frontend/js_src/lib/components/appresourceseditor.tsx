import React from 'react';

import type {
  SpAppResource,
  SpAppResourceDir,
  SpViewSetObj as SpViewSetObject,
} from '../datamodel';
import type { SerializedResource } from '../datamodelutils';
import { serializeResource } from '../datamodelutils';
import { formsText } from '../localization/forms';
import { hasToolPermission } from '../permissionutils';
import { createResource } from '../resource';
import { toTable } from '../specifymodel';
import {
  AppResourceDownload,
  AppResourceEditButton,
  AppResourceIcon,
  AppResourceLoad,
} from './appresourceeditorcomponents';
import { useAppResourceData } from './appresourceshooks';
import { AppResourcesTabs } from './appresourcestabs';
import { Button, Container, DataEntry, Form } from './basic';
import { AppTitle } from './common';
import { LoadingContext } from './contexts';
import { DeleteButton } from './deletebutton';
import { useIsModified } from './hooks';
import { deserializeResource } from './resource';
import { BaseResourceView } from './resourceview';
import { SaveButton } from './savebutton';

export function AppResourceEditor({
  resource,
  directory,
  initialData,
  onSaved: handleSaved,
  onClone: handleClone,
  onDeleted: handleDeleted,
}: {
  readonly resource: SerializedResource<SpAppResource | SpViewSetObject>;
  readonly directory: SerializedResource<SpAppResourceDir>;
  readonly initialData: string | undefined;
  readonly onDeleted: () => void;
  readonly onClone: (
    resource: SerializedResource<SpAppResource | SpViewSetObject>,
    directory: SerializedResource<SpAppResourceDir>,
    initialData: string
  ) => void;
  readonly onSaved: (
    resource: SerializedResource<SpAppResource | SpViewSetObject>,
    directory: SerializedResource<SpAppResourceDir>
  ) => void;
}): JSX.Element | null {
  const appResource = React.useMemo(
    () => deserializeResource(resource),
    [resource]
  );
  const isModified = useIsModified(appResource);

  const { resourceData, setResourceData, isChanged } = useAppResourceData(
    resource,
    initialData
  );

  const formRef = React.useRef<HTMLFormElement | null>(null);
  const isReadOnly = !hasToolPermission(
    'resources',
    appResource.isNew() ? 'create' : 'update'
  );

  const loading = React.useContext(LoadingContext);

  const showValidationRef = React.useRef<(() => void) | null>(null);
  return typeof resourceData === 'object' ? (
    <Container.Base className="flex-1 overflow-hidden">
      <BaseResourceView
        isLoading={false}
        resource={appResource}
        mode="edit"
        isSubForm={false}
      >
        {({ title, formatted, form }): JSX.Element => {
          const headerButtons = (
            <>
              <AppResourceEditButton title={title}>
                {form()}
              </AppResourceEditButton>
              <AppTitle title={formatted} type="form" />
              <span className="-ml-4 flex-1" />
              <AppResourceLoad
                onLoaded={(data: string, mimeType: string): void => {
                  setResourceData({
                    ...resourceData,
                    data,
                  });
                  toTable(appResource, 'SpAppResource')?.set(
                    'mimeType',
                    mimeType
                  );
                }}
              />
              <AppResourceDownload
                resource={resource}
                data={resourceData?.data ?? ''}
              />
            </>
          );
          return (
            <>
              <DataEntry.Header>
                <AppResourceIcon resource={resource} />
                <h3 className="overflow-auto whitespace-nowrap text-2xl">
                  {formatted}
                </h3>
                {headerButtons}
              </DataEntry.Header>
              <Form forwardRef={formRef} className="flex-1 overflow-hidden">
                <AppResourcesTabs
                  label={formatted}
                  isReadOnly={isReadOnly}
                  showValidationRef={showValidationRef}
                  headerButtons={headerButtons}
                  appResource={appResource}
                  resource={resource}
                  data={resourceData.data}
                  onChange={(data): void =>
                    setResourceData({ ...resourceData, data })
                  }
                />
              </Form>
              <DataEntry.Footer>
                {!appResource.isNew() &&
                hasToolPermission('resources', 'delete') ? (
                  <DeleteButton
                    resource={appResource}
                    onDeleted={handleDeleted}
                  />
                ) : undefined}
                <span className="-ml-2 flex-1" />
                {hasToolPermission('resources', 'create') && (
                  <Button.Orange
                    onClick={(): void =>
                      loading(
                        appResource
                          .clone()
                          .then((appResourceClone) =>
                            handleClone(
                              serializeResource(appResourceClone),
                              directory,
                              resourceData.data ?? ''
                            )
                          )
                      )
                    }
                    disabled={isChanged || isModified}
                  >
                    {formsText('clone')}
                  </Button.Orange>
                )}
                {formRef.current !== null &&
                hasToolPermission(
                  'resources',
                  appResource.isNew() ? 'create' : 'update'
                ) ? (
                  <SaveButton
                    resource={appResource}
                    form={formRef.current}
                    canAddAnother={false}
                    saveRequired={isChanged}
                    onIgnored={(): void => {
                      showValidationRef.current?.();
                    }}
                    onSaving={(): false => {
                      loading(
                        (async (): Promise<void> => {
                          const resourceDirectory =
                            typeof directory.id === 'number'
                              ? directory
                              : await createResource(
                                  'SpAppResourceDir',
                                  directory
                                );

                          if (appResource.isNew())
                            appResource.set(
                              'spAppResourceDir',
                              resourceDirectory.resource_uri
                            );
                          await appResource.save();

                          const appResourceData = deserializeResource({
                            ...resourceData,
                            spAppResource:
                              toTable(appResource, 'SpAppResource')?.get(
                                'resource_uri'
                              ) ?? null,
                            spViewSetObj:
                              toTable(appResource, 'SpViewSetObj')?.get(
                                'resource_uri'
                              ) ?? null,
                          });
                          await appResourceData.save();

                          handleSaved(
                            serializeResource(appResource),
                            resourceDirectory
                          );
                        })()
                      );

                      return false;
                    }}
                  />
                ) : undefined}
              </DataEntry.Footer>
            </>
          );
        }}
      </BaseResourceView>
    </Container.Base>
  ) : null;
}
