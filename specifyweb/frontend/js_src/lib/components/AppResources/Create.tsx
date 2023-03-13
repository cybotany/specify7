import React from 'react';
import { useOutletContext } from 'react-router';
import { useNavigate, useParams } from 'react-router-dom';

import { commonText } from '../../localization/common';
import { headerText } from '../../localization/header';
import { resourcesText } from '../../localization/resources';
import { f } from '../../utils/functools';
import { mappedFind } from '../../utils/utils';
import { Ul } from '../Atoms';
import { Button } from '../Atoms/Button';
import { Link } from '../Atoms/Link';
import { addMissingFields } from '../DataModel/addMissingFields';
import type { SerializedResource } from '../DataModel/helperTypes';
import { deserializeResource } from '../DataModel/serializers';
import type { SpAppResourceDir } from '../DataModel/types';
import {
  spAppResourceView,
  spViewSetNameView,
} from '../FormParse/webOnlyViews';
import { ResourceView } from '../Forms/ResourceView';
import { userInformation } from '../InitialContext/userInformation';
import { Dialog } from '../Molecules/Dialog';
import { NotFoundView } from '../Router/NotFoundView';
import { formatUrl } from '../Router/queryString';
import type { AppResourcesTree } from './hooks';
import { useResourcesTree } from './hooks';
import type { AppResourcesOutlet } from './index';
import type { AppResourceType } from './types';
import { appResourceSubTypes, appResourceTypes } from './types';

/**
 * Check if app resource is a sub type of XML
 */
export const isXmlSubType = (type: string, subType: string): boolean =>
  type === 'text/xml' && subType.includes('xml');

export function CreateAppResource(): JSX.Element {
  const navigate = useNavigate();
  const { directoryKey = '' } = useParams();
  const {
    getSet: [resources],
  } = useOutletContext<AppResourcesOutlet>();
  const resourcesTree = useResourcesTree(resources);
  const directory = React.useMemo(
    () => findAppResourceDirectory(resourcesTree, directoryKey),
    [resourcesTree, directoryKey]
  );

  const [name, setName] = React.useState<string>('');
  const [type, setType] = React.useState<AppResourceType | undefined>(
    undefined
  );
  const [mimeType, setMimeType] = React.useState<string | undefined>(undefined);
  return directory === undefined ? (
    <NotFoundView container={false} />
  ) : type === undefined ? (
    <Dialog
      buttons={commonText.cancel()}
      header={resourcesText.selectResourceType()}
      onClose={(): void => navigate('/specify/resources/')}
    >
      <Ul className="flex flex-col">
        {Object.entries(appResourceTypes).map(([key, type]) => (
          <li className="contents" key={key}>
            <Button.LikeLink
              onClick={(): void => {
                setType(type);
                if (key === 'viewSets') setMimeType('text/xml');
              }}
            >
              {type.icon}
              {type.label}
            </Button.LikeLink>
          </li>
        ))}
      </Ul>
    </Dialog>
  ) : mimeType === undefined ? (
    <Dialog
      buttons={commonText.cancel()}
      header={resourcesText.selectResourceType()}
      onClose={(): void => navigate('/specify/resources/')}
    >
      <table className="grid-table grid-cols-2 gap-2">
        <thead>
          <tr>
            <th scope="col">{resourcesText.type()}</th>
            <th scope="col">{headerText.documentation()}</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(appResourceSubTypes).map(
            ([key, { icon, mimeType, name = '', documentationUrl, label }]) => (
              <tr key={key}>
                <td>
                  <Button.LikeLink
                    onClick={(): void => {
                      setMimeType(mimeType ?? '');
                      setName(name);
                    }}
                  >
                    {icon}
                    {label}
                  </Button.LikeLink>
                </td>
                <td>
                  {typeof documentationUrl === 'string' && (
                    <Link.NewTab href={documentationUrl}>
                      {headerText.documentation()}
                    </Link.NewTab>
                  )}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </Dialog>
  ) : (
    <EditAppResource
      directory={directory}
      mimeType={mimeType || undefined}
      name={name}
      type={type}
    />
  );
}

/**
 * Traverse the recursive AppResourceTree structure in search of a directory
 * with a given searchKey
 */
export const findAppResourceDirectory = (
  tree: AppResourcesTree,
  searchKey: string
): SerializedResource<SpAppResourceDir> | undefined =>
  mappedFind(tree, ({ key, directory, subCategories }) =>
    key === searchKey
      ? directory
      : findAppResourceDirectory(subCategories, searchKey)
  );

/** Find "directoryKey" for an app resource directory with given id */
export const findAppResourceDirectoryKey = (
  tree: AppResourcesTree,
  directoryId: number
): string | undefined =>
  mappedFind(tree, ({ key, directory, subCategories }) =>
    directory?.id === directoryId
      ? key
      : findAppResourceDirectoryKey(subCategories, directoryId)
  );

function EditAppResource({
  directory,
  name,
  type,
  mimeType,
}: {
  readonly directory: SerializedResource<SpAppResourceDir>;
  readonly name: string;
  readonly type: AppResourceType;
  readonly mimeType: string | undefined;
}): JSX.Element {
  const resource = React.useMemo(
    () =>
      deserializeResource(
        addMissingFields(type.tableName as 'SpAppResource', {
          // I don't think this field is used anywhere
          level: 0,
          mimeType,
          name: name.trim(),
          specifyUser: userInformation.resource_uri,
          spAppResourceDir: directory.resource_uri,
        })
      ),
    [directory, name, type, mimeType]
  );

  const navigate = useNavigate();
  const { directoryKey = '' } = useParams();

  return (
    <ResourceView
      dialog="modal"
      isDependent={false}
      isSubForm={false}
      resource={resource}
      viewName={
        // Special views that include only "name" field
        type.tableName === 'SpAppResource'
          ? spAppResourceView
          : spViewSetNameView
      }
      onAdd={undefined}
      onClose={(): void => navigate('/specify/resources/')}
      onDeleted={undefined}
      // eslint-disable-next-line react/jsx-handler-names
      onSaved={f.never}
      onSaving={(unsetUnloadProtect): false => {
        unsetUnloadProtect();
        const path =
          type.tableName === 'SpAppResource' ? 'app-resource' : 'view-set';
        navigate(
          formatUrl(`/specify/resources/${path}/new/`, {
            directoryKey,
            name: resource.get('name'),
            mimeType: resource.get('mimeType'),
          })
        );
        /*
         * Prevent saving a resource to fix
         * https://github.com/specify/specify7/issues/1596
         */
        return false;
      }}
    />
  );
}
