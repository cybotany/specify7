import React from 'react';

import { useAsyncState } from '../../hooks/useAsyncState';
import { commonText } from '../../localization/common';
import { Link } from '../Atoms/Link';
import type { SpecifyResource } from '../DataModel/legacyTypes';
import type { CollectionObject } from '../DataModel/types';
import { softFail } from '../Errors/Crash';
import { fetchOtherCollectionData } from './collectionRelData';

export function CollectionOneToOnePlugin({
  resource,
  relationship,
  formatting,
}: {
  readonly resource: SpecifyResource<CollectionObject>;
  readonly relationship: string;
  readonly formatting: string | undefined;
}): JSX.Element | null {
  const [data] = useAsyncState(
    React.useCallback(
      async () =>
        fetchOtherCollectionData(resource, relationship, formatting)
          .then((data) => data ?? false)
          .catch((error) => {
            softFail(error);
            return undefined;
          }),
      [resource, relationship]
    ),
    false
  );

  return data === undefined ? (
    <>{commonText.loading()}</>
  ) : typeof data === 'object' && data.collectionObjects.length > 0 ? (
    <Link.Default href={data.collectionObjects[0].resource.viewUrl()}>
      {data.collectionObjects[0].formatted}
    </Link.Default>
  ) : null;
}
