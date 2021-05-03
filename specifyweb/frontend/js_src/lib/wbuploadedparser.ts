/*
 * Workbench Upload Results Parser
 *
 */

'use string';

import type { IR, R } from './components/wbplanview';
import icons from './icons';
import type { Schema } from './legacytypes';
import schema from './schema';
import type { State } from './statemanagement';
import type { UploadPlan } from './uploadplantomappingstree';
import { uploadPlanToMappingsTree } from './uploadplantomappingstree';
import { extractDefaultValues } from './wbplanviewhelper';
import {
  getNameFromTreeRankName,
  mappingPathToString,
} from './wbplanviewmodelhelper';
import {
  arrayToTree,
  deepMergeObject,
  mappingsTreeToArrayOfSplitMappings,
} from './wbplanviewtreehelper';

/*
 * If an UploadResult involves a tree record, this metadata indicates
 * where in the tree the record resides
 */
interface TreeInfo {
  // The tree rank a record relates to
  rank: string;
  // The name of the tree node a record relates to
  name: string;
}

/*
 * Records metadata about an UploadResult indicating the tables, data set
 * columns, and any tree information involved
 */
interface ReportInfo {
  // The name of the table a record relates to
  tableName: string;
  // The columns from the data set a record relates to
  columns: string[];
  treeInfo: TreeInfo | null;
}

/*
 * Indicates that a value had to be added to a picklist during uploading
 * a record
 */
interface PicklistAddition {
  // The new picklistitem id
  id: number;
  // The name of the picklist receiving the new item
  name: string;
  // The value of the new item
  value: string;
  // The data set column that produced the new item
  caption: string;
}

// Indicates that a new row was added to the database
interface Uploaded extends State<'Uploaded'> {
  // The database id of the added row
  id: number;
  picklistAdditions: PicklistAddition[];
  info: ReportInfo;
}

// Indicates that an existing record in the database was matched
interface Matched extends State<'Matched'> {
  // The id of the matched database row
  id: number;
  info: ReportInfo;
}

// Indicates failure due to finding multiple matches to existing records
interface MatchedMultiple extends State<'MatchedMultiple'> {
  // List of ids of the matching database records
  ids: number[];
  info: ReportInfo;
}

/*
 * Indicates that no record was uploaded because all relevant columns in
 * the data set are empty
 */
interface NullRecord extends State<'NullRecord'> {
  info: ReportInfo;
}

// Indicates a record didn't upload due to a business rule violation
interface FailedBusinessRule extends State<'FailedBusinessRule'> {
  // The error message generated by the business rule exception
  message: string;
  info: ReportInfo;
}

/*
 * Indicates failure due to inability to find an expected existing
 * matching record
 */
interface NoMatch extends State<'NoMatch'> {
  info: ReportInfo;
}

/*
 * Indicates one or more values were invalid, preventing a record
 * from uploading
 */
interface ParseFailures extends State<'ParseFailures'> {
  failures: [string, string][][];
}

// Indicates failure due to a failure to upload a related record
type PropagatedFailure = State<'PropagatedFailure'>;

type RecordResultTypes =
  | (State<string> & ParseFailures)
  | NoMatch
  | FailedBusinessRule
  | NullRecord
  | MatchedMultiple
  | Matched
  | Uploaded
  | PropagatedFailure;

// Records the specific result of attempting to upload a particular record
type RecordResult = {
  [recordResultType in RecordResultTypes['type']]: Omit<
    Extract<RecordResultTypes, State<recordResultType>>,
    'type'
  >;
};

interface UploadResult {
  UploadResult: {
    record_result: RecordResult;
    /*
     * Maps the names of -to-one relationships of the table to upload
     * results for each
     * 'parent' exists for tree nodes only
     */
    toOne: Record<'parent' | string, UploadResult>;
    /*
     * Maps the names of -to-many relationships of the table to an
     * array of upload results for each
     */
    toMany: IR<UploadResult[]>;
  };
}

export type UploadResults = UploadResult[];

interface UploadedColumn {
  readonly columnIndex: number;
  readonly rowIndex?: number;
  readonly recordId?: number;
  readonly cellValue?: string;
  readonly matched?: boolean;
  spanSize?: number;
}

export interface UploadedRow {
  readonly recordId: number;
  readonly rowIndex: number;
  readonly columns: UploadedColumn[];
}

interface UploadedTreeRank {
  readonly recordId: number;
  readonly nodeName: string;
  readonly parentId?: number;
  readonly rankName: string;
  readonly children: number[];
  readonly rowIndex: number;
  readonly columns: string[];
}

interface UploadedTreeRankProcessed extends Omit<UploadedTreeRank, 'children'> {
  readonly children: Readonly<Record<number, UploadedTreeRankProcessed>>;
}

interface UploadedTreeRankSpacedOut
  extends Partial<Omit<UploadedTreeRank & { matched?: boolean }, 'children'>> {
  readonly children: Readonly<
    Record<number, UploadedTreeRankSpacedOut | undefined>
  >;
}

type SpacedOutTree = Record<number, UploadedTreeRankSpacedOut | undefined>;

export interface UploadedRowsTable {
  readonly tableLabel: string;
  readonly columnNames: string[];
  readonly tableIcon: string;
  readonly getRecordViewUrl: (rowId: number) => string;
  readonly rows: UploadedRow[];
  readonly rowsCount?: number;
}

export type UploadedRows = Readonly<IR<UploadedRowsTable>>;

export interface UploadedPicklistItem {
  readonly picklistValue: string;
  readonly id: number;
  readonly rowIndex: number;
  readonly columnIndex: number;
}

export type UploadedPicklistItems = R<UploadedPicklistItem[]>;

interface UploadedRowSorted extends Omit<UploadedRow, 'columns'> {
  columns: string[];
  treeInfo:
    | {
        rankName: string;
        parentId: number | undefined;
        children: number[];
      }
    | undefined;
  matched: boolean;
}

/*
 * Recursively traverses upload results to extract new rows,
 * tree nodes and picklist additions
 *
 */
function handleUploadResult(
  uploadedPicklistItems: UploadedPicklistItems,
  uploadedRows: R<UploadedRowSorted[]>,
  matchedRecordsNames: R<Record<number, string>>,
  headers: string[],
  line: UploadResult,
  rowIndex: number
): void {
  const uploadResult = line.UploadResult;

  const uploadStatus = Object.keys(
    uploadResult.record_result
  )[0] as keyof RecordResult;

  // Skip error statuses
  if (uploadStatus !== 'Uploaded' && uploadStatus !== 'Matched') return;

  const {
    id,
    info: { tableName, columns, treeInfo },
    ...rest
  } = uploadResult.record_result[uploadStatus];

  if (
    // Make sure the record is not present already
    uploadedRows[tableName]?.some(({ recordId }) => recordId === id)
  )
    return;

  const rank = treeInfo?.rank;
  const orderedColumns = getOrderedHeaders(headers, columns);

  if ('picklistAdditions' in rest)
    rest.picklistAdditions?.forEach(
      ({ id, name, value: picklistValue, caption }) => {
        uploadedPicklistItems[name] ??= [];
        uploadedPicklistItems[name].push({
          rowIndex,
          id,
          picklistValue,
          columnIndex: headers.indexOf(caption) || -1,
        });
      }
    );

  // 'parent' exists for tree ranks only
  const {
    parent: parentUploadResult = undefined,
    ...toOneUploadResults
  } = uploadResult.toOne;
  const parentBase = parentUploadResult?.UploadResult.record_result;
  const parentType =
    parentBase &&
    ('Matched' in parentBase
      ? 'Matched'
      : 'Uploaded' in parentBase
      ? 'Uploaded'
      : undefined);
  const parent = parentType && parentBase?.[parentType];

  if (uploadStatus === 'Matched') {
    matchedRecordsNames[tableName] ??= {};
    matchedRecordsNames[tableName][id] = treeInfo?.name ?? '';
  }

  uploadedRows[tableName] ??= [];
  uploadedRows[tableName].push({
    recordId: id,
    rowIndex,
    columns: orderedColumns,
    treeInfo: rank
      ? {
          rankName: rank,
          parentId: parent?.id,
          children: [],
        }
      : undefined,
    matched: uploadStatus === 'Matched',
  });

  [
    ...Object.values(uploadResult.toMany),
    Object.values(toOneUploadResults),
  ].forEach((lines: UploadResult[]) =>
    lines.forEach((line: UploadResult) =>
      handleUploadResult(
        uploadedPicklistItems,
        uploadedRows,
        matchedRecordsNames,
        headers,
        line,
        rowIndex
      )
    )
  );

  if (typeof parentUploadResult !== 'undefined')
    handleUploadResult(
      uploadedPicklistItems,
      uploadedRows,
      matchedRecordsNames,
      headers,
      parentUploadResult,
      rowIndex
    );
}

/*
 * Formats list of rows for easier manipulation when reconstructing the tree
 *
 */
function formatListOfRows(
  listOfRows: UploadedRowSorted[],
  data: string[][],
  mappedRanks: IR<string>,
  matchedRecordsNames: Record<number, string>,
  headers: string[],
  treeRanks: string[],
  defaultValues: IR<string>
) {
  const rows: [number, UploadedTreeRank][] = listOfRows
    .filter(({ treeInfo }) => typeof treeInfo !== 'undefined')
    .map(({ treeInfo, ...row }) => [
      row.recordId,
      {
        ...(treeInfo as {
          rankName: string;
          parentId: number | undefined;
          children: number[];
        }),
        ...row,
        nodeName:
          insertDefaultValue(
            defaultValues,
            mappedRanks[treeInfo!.rankName],
            data[row.rowIndex][headers.indexOf(mappedRanks[treeInfo!.rankName])]
          ) || matchedRecordsNames[row.recordId],
      },
    ]);
  const rowsObject = Object.fromEntries(
    rows as [number, UploadedTreeRank | undefined][]
  );

  rows.forEach(
    ([nodeId, rankData]) =>
      typeof rankData.parentId !== 'undefined' &&
      rowsObject[rankData.parentId]?.children.push(nodeId)
  );

  const ranksToShow = [...new Set(rows.map(([, { rankName }]) => rankName))];
  const sortedRanksToShow = treeRanks.filter((rankName) =>
    ranksToShow.includes(rankName)
  );

  return [rows, rowsObject, sortedRanksToShow] as [
    [number, UploadedTreeRank][],
    typeof rowsObject,
    typeof ranksToShow
  ];
}

/*
 * Finds the highest level rank among the newly added rows
 *
 */
const getMinNode = (
  rows: [number, UploadedTreeRank][],
  treeRanks: IR<string[]>,
  rowsObject: IR<UploadedTreeRank | undefined>,
  tableName: string
): number =>
  rows.reduce(
    ([minRank, minNodeId], [nodeId, rankData]) => {
      const rankIndex = treeRanks[tableName]?.indexOf(rankData.rankName || '');

      return typeof rowsObject[nodeId] !== 'undefined' &&
        rankIndex !== -1 &&
        (minRank === -1 || rankIndex < minRank)
        ? [rankIndex, nodeId]
        : [minRank, minNodeId];
    },
    [-1, -1]
  )[1];

/*
 * Turns a list of nodes with children and parents into a tree
 *
 */
function joinChildren(
  rowsObject: R<UploadedTreeRank | undefined>,
  nodeId: number
): UploadedTreeRankProcessed | undefined {
  if (typeof rowsObject[nodeId] === 'undefined') return undefined;

  const result = {
    ...rowsObject[nodeId],
    children: Object.fromEntries(
      (rowsObject[nodeId]?.children ?? []).map((childId) => [
        childId,
        joinChildren(rowsObject, childId),
      ])
    ),
  };

  rowsObject[nodeId] = undefined;

  // @ts-expect-error
  return result;
}

/*
 * Introduces empty cells between values in a row
 *
 */
const spaceOutNode = (
  uploadedTreeRank: UploadedTreeRankSpacedOut,
  levels: number
): UploadedTreeRankSpacedOut =>
  levels <= 0
    ? Object.values(uploadedTreeRank.children)[0]!
    : levels === 1
    ? uploadedTreeRank
    : {
        children: {
          0: spaceOutNode(uploadedTreeRank, levels - 1),
        },
      };

/*
 * Walk though the tree and offsets starting position of rows that share
 * common parents
 *
 */
const spaceOutChildren = (
  tree: SpacedOutTree,
  ranksToShow: string[],
  parentRankName: string | undefined = undefined
): SpacedOutTree =>
  Object.fromEntries(
    Object.entries(tree)
      .filter(([, nodeData]) => typeof nodeData !== 'undefined')
      .map(([nodeId, nodeData]) => [
        Number(nodeId),
        spaceOutNode(
          {
            children: {
              0: {
                ...nodeData,
                children: spaceOutChildren(
                  nodeData!.children,
                  ranksToShow,
                  nodeData!.rankName
                ),
              },
            },
          },
          Object.values(ranksToShow).indexOf(nodeData!.rankName ?? '') -
            (typeof parentRankName === 'undefined'
              ? 0
              : Object.values(ranksToShow).indexOf(parentRankName ?? '') + 1)
        ),
      ])
  );

/*
 * Value to use for an empty cell
 *
 */
const emptyCell = (columnIndex: number): UploadedColumn => ({
  columnIndex,
  cellValue: '',
});

/*
 * Turns a tree of new nodes back into rows that are readable by
 * `wbuploadedview`
 *
 */
const compileRows = (
  mappedRanks: IR<string>,
  ranksToShow: string[],
  headers: string[],
  spacedOutTree: SpacedOutTree,
  parentColumns: UploadedColumn[] = []
): UploadedRow[] =>
  Object.entries(spacedOutTree).flatMap(([nodeId, nodeData], index) => {
    if (typeof nodeData === 'undefined') return [];

    const columns: UploadedColumn[] = [
      ...(index === 0
        ? parentColumns
        : new Array<UploadedColumn>(parentColumns.length).fill(emptyCell(-1))),
      typeof nodeData.rankName === 'undefined'
        ? emptyCell(-3)
        : {
            columnIndex: headers.includes(mappedRanks[nodeData.rankName])
              ? headers.indexOf(mappedRanks[nodeData.rankName])
              : 3,
            rowIndex: nodeData.rowIndex,
            recordId: Number(nodeId),
            cellValue: nodeData.nodeName,
            matched: nodeData.matched,
          },
    ];

    return Object.keys(nodeData.children).length === 0
      ? [
          {
            rowIndex: -1,
            recordId: -1,
            columns: [
              ...columns,
              ...new Array<UploadedColumn>(
                ranksToShow.length - columns.length > 0
                  ? ranksToShow.length - columns.length
                  : 0
              ).fill(emptyCell(-2)),
            ],
          },
        ]
      : compileRows(
          mappedRanks,
          ranksToShow,
          headers,
          nodeData.children,
          columns
        );
  });

/*
 * Replaces empty cells with colspan
 *
 */
function joinRows(finalRows: UploadedRow[]) {
  if (finalRows.length === 0) return [];
  const spanSize: number[] = new Array<number>(
    finalRows[0].columns.length
  ).fill(1);
  return finalRows
    .reverse()
    .map((row) => ({
      ...row,
      columns: row.columns.reduce<UploadedColumn[]>(
        (newColumns, column, index) => {
          if (column.columnIndex === -1) spanSize[index] += 1;
          else {
            if (spanSize[index] !== 1) {
              column.spanSize = spanSize[index];
              spanSize[index] = 1;
            }
            newColumns.push(column);
          }
          return newColumns;
        },
        []
      ),
    }))
    .reverse();
}

const getOrderedHeaders = (
  headers: string[],
  headersSubset: string[]
): string[] => headers.filter((header) => headersSubset.includes(header));

const insertDefaultValue = (
  defaultValues: IR<string>,
  headerName: string,
  value: string
) =>
  headerName in defaultValues && value === ''
    ? defaultValues[headerName]
    : value;

export function parseUploadResults(
  uploadResults: UploadResults,
  headers: string[],
  data: string[][],
  treeRanks: IR<string[]>,
  plan: UploadPlan | null
): [UploadedRows, UploadedPicklistItems] {
  if (plan === null) throw new Error('Upload plan is invalid');

  const { baseTableName, mappingsTree } = uploadPlanToMappingsTree(
    headers,
    plan
  );
  const arrayOfMappings = mappingsTreeToArrayOfSplitMappings(mappingsTree);
  const headerGroups = Object.values(
    arrayOfMappings
      .map((splitMappingPath) => ({
        ...splitMappingPath,
        groupName: mappingPathToString(
          splitMappingPath.mappingPath.slice(0, -1)
        ),
      }))
      .reduce<Record<string, string[]>>(
        (headerGroups, { groupName, headerName }) => {
          headerGroups[groupName] ??= [];
          headerGroups[groupName].push(headerName);
          return headerGroups;
        },
        {}
      )
  );
  console.log(headerGroups);

  const mappedRanksTree = arrayOfMappings
    .filter(
      ({ mappingPath }) =>
        mappingPath.length >= 2 &&
        mappingPath[mappingPath.length - 1] === 'name'
    )
    .map(({ mappingPath, headerName }) =>
      arrayToTree(
        [
          mappingPath.length === 2 ? [baseTableName] : mappingPath.slice(-3)[0],
          getNameFromTreeRankName(mappingPath.slice(-2)[0]),
          headerName,
        ],
        true
      )
    )
    .reduce(deepMergeObject, {}) as IR<IR<string>>;

  const defaultValues = extractDefaultValues(arrayOfMappings);

  const uploadedRows: IR<UploadedRowSorted[]> = {};
  const uploadedPicklistItems: UploadedPicklistItems = {};
  const matchedRecordsNames: IR<Record<number, string>> = {};

  uploadResults.forEach(
    handleUploadResult.bind(
      undefined,
      uploadedPicklistItems,
      uploadedRows,
      matchedRecordsNames,
      headers
    )
  );

  const treeTables: IR<
    Omit<UploadedRowsTable, 'getRecordViewUrl' | 'tableLabel' | 'tableIcon'>
  > = Object.fromEntries(
    Object.entries(uploadedRows)
      .filter(
        ([tableName]) =>
          typeof treeRanks[tableName.toLowerCase()] !== 'undefined'
      )
      .map(([originalTableName, listOfRows]) => {
        const tableName = originalTableName.toLowerCase();
        const mappedRanks = mappedRanksTree[tableName] ?? {};

        const [rows, rowsObject, ranksToShow] = formatListOfRows(
          listOfRows,
          data,
          mappedRanks,
          matchedRecordsNames[originalTableName] ?? {},
          headers,
          treeRanks[tableName],
          defaultValues
        );

        const tree: Record<number, UploadedTreeRankProcessed | undefined> = {};
        let minNodeId: number;

        while (
          (minNodeId = getMinNode(rows, treeRanks, rowsObject, tableName)) !==
          -1
        )
          tree[minNodeId] = joinChildren(rowsObject, minNodeId);

        const spacedOutTree: SpacedOutTree = spaceOutChildren(
          tree,
          ranksToShow
        );

        const compiledRows: UploadedRow[] = compileRows(
          mappedRanks,
          ranksToShow,
          headers,
          spacedOutTree
        );

        const joinedRows: UploadedRow[] = joinRows(compiledRows);

        return [
          originalTableName,
          {
            rows: joinedRows,
            columnNames: ranksToShow,
            rowsCount: Object.entries(listOfRows).filter(
              ([, { matched }]) => !matched
            ).length,
          },
        ];
      })
  );

  const normalTableNames = Object.keys(((schema as unknown) as Schema).models);
  const lowercaseTableNames = normalTableNames.map((tableName) =>
    tableName.toLowerCase()
  );
  const schemaModels = Object.values(((schema as unknown) as Schema).models);

  let columnNames: string[];
  return [
    Object.fromEntries(
      Object.entries(uploadedRows).map(([tableName, tableRecords]) => [
        tableName,
        {
          tableLabel: schemaModels[
            lowercaseTableNames.indexOf(tableName.toLowerCase())
          ].getLocalizedName(),
          tableIcon: icons.getIcon(
            normalTableNames[
              lowercaseTableNames.indexOf(tableName.toLowerCase())
            ]
          ),
          getRecordViewUrl: (recordId: number) =>
            `/specify/view/${tableName}/${recordId}/`,
          ...(tableName in treeTables
            ? treeTables[tableName]
            : {
                columnNames: (columnNames = getOrderedHeaders(headers, [
                  // Save list of column indexes to `columnIndexes`
                  ...new Set(
                    // Make the list unique
                    tableRecords.flatMap(
                      // Get column names
                      ({ columns }) => Object.values(columns)
                    )
                  ),
                ])),
                rows: tableRecords.map(({ recordId, rowIndex, columns }) => ({
                  recordId,
                  rowIndex,
                  columns: columnNames
                    .map((columnName) => ({
                      columnName,
                      columnIndex: headers.indexOf(columnName),
                      rowsColumn: columns.includes(columnName),
                    }))
                    .map(({ columnName, columnIndex, rowsColumn }) =>
                      columnIndex === -1 || !rowsColumn
                        ? {
                            columnIndex: -1,
                            cellValue: '',
                          }
                        : {
                            columnIndex,
                            cellValue: insertDefaultValue(
                              defaultValues,
                              columnName,
                              data[rowIndex][columnIndex] ?? ''
                            ),
                          }
                    ),
                })),
              }),
        },
      ])
    ),
    uploadedPicklistItems,
  ];
}
