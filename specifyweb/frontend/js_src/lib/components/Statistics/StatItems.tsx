import React from 'react';

import { statsText } from '../../localization/stats';
import { userText } from '../../localization/user';
import type { AjaxResponseObject } from '../../utils/ajax';
import { ajax } from '../../utils/ajax';
import { Http } from '../../utils/ajax/definitions';
import { throttledPromise } from '../../utils/ajax/throttledPromise';
import type { RA } from '../../utils/types';
import { formatNumber } from '../Atoms/Internationalization';
import type { Tables } from '../DataModel/types';
import { hasTablePermission } from '../Permissions/helpers';
import {
  appendDynamicPathToValue,
  queryCountPromiseGenerator,
  querySpecToResource,
  useResolvedStatSpec,
  useStatValueLoad,
} from './hooks';
import { StatsResult } from './StatsResult';
import type {
  BackendStatsResult,
  CustomStat,
  DefaultStat,
  QuerySpec,
  StatFormatterSpec,
} from './types';

export function StatItem({
  item,
  categoryIndex,
  itemIndex,
  formatterSpec,
  hasPermission,
  onRemove: handleRemove,
  onClick: handleClick,
  onEdit: handleEdit,
  onLoad: handleLoad,
  onRename: handleRename,
  onClone: handleClone,
}: {
  readonly item: CustomStat | DefaultStat;
  readonly formatterSpec: StatFormatterSpec;
  readonly categoryIndex: number;
  readonly itemIndex: number;
  readonly hasPermission: boolean;
  readonly onRemove: (() => void) | undefined;
  readonly onClick: (() => void) | undefined;
  readonly onEdit:
    | ((querySpec: QuerySpec, itemName: string) => void)
    | undefined;
  readonly onLoad:
    | ((
        categoryIndex: number,
        itemIndex: number,
        value: number | string
      ) => void)
    | undefined;
  readonly onRename: ((newLabel: string) => void) | undefined;
  readonly onClone: ((querySpec: QuerySpec) => void) | undefined;
}): JSX.Element | null {
  const handleLoadItem = React.useCallback(
    (value: number | string) => handleLoad?.(categoryIndex, itemIndex, value),
    [handleLoad, categoryIndex, itemIndex]
  );
  const resolvedSpec = useResolvedStatSpec(item, formatterSpec);

  return resolvedSpec?.type === 'QueryStat' &&
    resolvedSpec.querySpec !== undefined ? (
    <QueryItem
      hasPermission={hasPermission}
      label={item.label}
      querySpec={resolvedSpec.querySpec}
      value={item.itemValue}
      onClick={handleClick}
      onClone={handleClone}
      onEdit={
        handleEdit === undefined
          ? undefined
          : (querySpec) => {
              handleEdit(querySpec, item.label);
            }
      }
      onLoad={handleLoadItem}
      onRemove={handleRemove}
      onRename={handleRename}
    />
  ) : item?.type === 'DefaultStat' &&
    resolvedSpec?.type === 'BackEndStat' &&
    resolvedSpec?.pathToValue !== undefined &&
    resolvedSpec?.pathToValue !== null ? (
    <BackEndItem
      fetchUrl={resolvedSpec.fetchUrl}
      formatter={resolvedSpec.formatter}
      hasPermission={hasPermission}
      label={item.label}
      pathToValue={resolvedSpec.pathToValue.toString()}
      querySpec={resolvedSpec.querySpec}
      tableNames={resolvedSpec.tableNames}
      value={item.itemValue}
      onClick={handleClick}
      onLoad={handleLoadItem}
      onRemove={handleRemove}
      onRename={handleRename}
    />
  ) : null;
}

function BackEndItem({
  value,
  tableNames,
  fetchUrl,
  pathToValue,
  formatter,
  label,
  querySpec,
  hasPermission,
  onClick: handleClick,
  onRemove: handleRemove,
  onRename: handleRename,
  onLoad: handleLoad,
}: {
  readonly value: number | string | undefined;
  readonly fetchUrl: string;
  readonly pathToValue: string;
  readonly tableNames: RA<keyof Tables>;
  readonly label: string;
  readonly querySpec: QuerySpec | undefined;
  readonly hasPermission: boolean;
  readonly formatter: (rawValue: any) => string | undefined;
  readonly onClick: (() => void) | undefined;
  readonly onRemove: (() => void) | undefined;
  readonly onRename: ((newLabel: string) => void) | undefined;
  readonly onLoad: ((value: number | string) => void) | undefined;
}): JSX.Element {
  const [hasStatPermission, setStatPermission] = React.useState<boolean>(
    tableNames.every((tableName) => hasTablePermission(tableName, 'read'))
  );
  const handleLoadResolve = hasStatPermission ? handleLoad : undefined;
  const querySpecResolved =
    querySpec === undefined
      ? undefined
      : {
          ...querySpec,
          fields: appendDynamicPathToValue(pathToValue, querySpec.fields),
        };
  const promiseGenerator = React.useCallback(
    async () =>
      throttledPromise<BackendStatsResult | undefined>(
        'backendStats',
        async () =>
          ajax<BackendStatsResult | undefined>(
            fetchUrl,
            {
              method: 'GET',
              headers: {
                Accept: 'application/json',
              },
            },
            { expectedResponseCodes: [Http.OK, Http.FORBIDDEN] }
          ).then(({ data, status }) => {
            if (status === Http.FORBIDDEN) {
              setStatPermission(false);
              return undefined;
            }
            return data;
          }),
        fetchUrl
      ).then((data) => {
        if (data === undefined) {
          return undefined;
        }
        const fetchValue = formatter?.(data[pathToValue]);
        if (fetchValue === undefined) handleRemove?.();
        return fetchValue;
      }),
    [pathToValue, fetchUrl, handleRemove]
  );
  useStatValueLoad(value, promiseGenerator, handleLoadResolve);
  return (
    <StatsResult
      hasPermission={hasPermission}
      label={label}
      query={
        querySpecResolved === undefined
          ? undefined
          : querySpecToResource(label, querySpecResolved)
      }
      value={hasStatPermission ? value : userText.noPermission()}
      onClick={handleClick}
      onClone={undefined}
      onEdit={undefined}
      onRemove={handleRemove}
      onRename={handleRename}
    />
  );
}

function QueryItem({
  value,
  label,
  querySpec,
  hasPermission,
  onClick: handleClick,
  onRemove: handleRemove,
  onEdit: handleEdit,
  onRename: handleRename,
  onLoad: handleLoad,
  onClone: handleClone,
}: {
  readonly value: number | string | undefined;
  readonly querySpec: QuerySpec;
  readonly label: string;
  readonly hasPermission: boolean;
  readonly onClick: (() => void) | undefined;
  readonly onRemove: (() => void) | undefined;
  readonly onEdit: ((querySpec: QuerySpec) => void) | undefined;
  readonly onRename: ((newLabel: string) => void) | undefined;
  readonly onLoad: ((value: number | string) => void) | undefined;
  readonly onClone: ((querySpec: QuerySpec) => void) | undefined;
}): JSX.Element | null {
  const [statState, setStatState] = React.useState<
    'error' | 'noPermission' | 'valid'
  >(hasTablePermission(querySpec.tableName, 'read') ? 'valid' : 'noPermission');

  React.useEffect(() => {
    setStatState(
      hasTablePermission(querySpec.tableName, 'read') ? 'valid' : 'noPermission'
    );
  }, [querySpec]);
  const handleLoadResolve = statState === 'valid' ? handleLoad : undefined;
  const query = React.useMemo(
    () => querySpecToResource(label, querySpec),
    [label, querySpec]
  );

  const promiseGenerator = React.useCallback(
    async () =>
      throttledPromise<AjaxResponseObject<{ readonly count: number }>>(
        'queryStats',
        queryCountPromiseGenerator(query),
        JSON.stringify(querySpec)
      ).then(({ data, status }) => {
        if (status === Http.OK) {
          setStatState('valid');
          return formatNumber(data.count);
        }
        if (status === Http.FORBIDDEN) setStatState('noPermission');
        setStatState('error');
        return undefined;
      }),

    [query, setStatState]
  );

  useStatValueLoad(value, promiseGenerator, handleLoadResolve);

  return (
    <StatsResult
      hasPermission={hasPermission}
      label={label}
      query={query}
      value={
        statState === 'noPermission'
          ? userText.noPermission()
          : statState === 'error'
          ? statsText.error()
          : value
      }
      onClick={handleClick}
      onClone={handleClone}
      onEdit={handleEdit}
      onRemove={handleRemove}
      onRename={handleRename}
    />
  );
}
