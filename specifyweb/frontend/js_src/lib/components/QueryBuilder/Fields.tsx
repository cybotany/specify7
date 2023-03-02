import React from 'react';

import { useReadyEffect } from '../../hooks/useReadyEffect';
import type { RA } from '../../utils/types';
import { Ul } from '../Atoms';
import type { Tables } from '../DataModel/types';
import { ErrorBoundary } from '../Errors/ErrorBoundary';
import { scrollIntoView } from '../TreeView/helpers';
import type { MappingPath } from '../WbPlanView/Mapper';
import { QueryLine } from './Field';
import type { QueryField } from './helpers';

export function QueryFields({
  baseTableName,
  fields,
  enforceLengthLimit,
  openedElement,
  showHiddenFields,
  getMappedFields,
  onChangeField: handleChangeField,
  onMappingChange: handleMappingChange,
  onRemoveField: handleRemoveField,
  onOpen: handleOpen,
  onClose: handleClose,
  onLineFocus: handleLineFocus,
  onLineMove: handleLineMove,
  onOpenMap: handleOpenMap,
  onChangeFields: handleChangeFields,
}: {
  readonly baseTableName: keyof Tables;
  readonly fields: RA<QueryField>;
  readonly enforceLengthLimit: boolean;
  readonly openedElement?: {
    readonly line: number;
    readonly index?: number;
  };
  readonly showHiddenFields: boolean;
  readonly getMappedFields: (mappingPathFilter: MappingPath) => RA<string>;
  readonly onChangeField:
    | ((line: number, field: QueryField) => void)
    | undefined;
  readonly onMappingChange:
    | ((
        line: number,
        payload: {
          readonly index: number;
          readonly close: boolean;
          readonly newValue: string;
          readonly isRelationship: boolean;
          readonly parentTableName: keyof Tables | undefined;
          readonly currentTableName: keyof Tables | undefined;
          readonly newTableName: keyof Tables | undefined;
          readonly isDoubleClick: boolean;
        }
      ) => void)
    | undefined;
  readonly onRemoveField: ((line: number) => void) | undefined;
  readonly onOpen: ((line: number, index: number) => void) | undefined;
  readonly onClose: (() => void) | undefined;
  readonly onLineFocus: ((line: number) => void) | undefined;
  readonly onLineMove:
    | ((line: number, direction: 'down' | 'up') => void)
    | undefined;
  readonly onOpenMap: ((line: number) => void) | undefined;
  readonly onChangeFields?: ((fields: RA<QueryField>) => void) | undefined;
}): JSX.Element {
  const fieldsContainerRef = React.useRef<HTMLUListElement | null>(null);

  const [draggedItem, setDraggedItem] = React.useState<QueryField | null>(null);

  const [isDragging, setIsDragging] = React.useState(false);

  React.useEffect(() => {
    if (isDragging) {
      const listNode = fieldsContainerRef.current;
      if (listNode === null) return;
      const { top, bottom } = listNode.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (top < 0) {
        // The dragged item is at the top of the screen
        listNode.scrollTop -= Math.abs(top);
      } else if (bottom > windowHeight) {
        // The dragged item is at the bottom of the screen
        listNode.scrollTop += bottom - windowHeight;
      }
    }
  }, [isDragging]);

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    setDraggedItem(fields[index]);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(index));
    event.currentTarget.classList.add('dragging');
    setIsDragging(true);
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    event.preventDefault();

    if (handleChangeFields === undefined) return;

    const draggedOverItem = fields[index];

    if (draggedItem === draggedOverItem) {
      return;
    }

    const newItems = Array.from(fields);
    const draggedItemIndex = draggedItem ? newItems.indexOf(draggedItem) : -1;

    if (draggedItemIndex < index && draggedItem !== null) {
      newItems.splice(index + 1, 0, draggedItem);
      newItems.splice(draggedItemIndex, 1);
    } else if (draggedItemIndex > index && draggedItem !== null) {
      newItems.splice(index, 0, draggedItem);
      newItems.splice(draggedItemIndex + 1, 1);
    }

    handleChangeFields(newItems);
    setIsDragging(false);
  };

  // Scroll to bottom if added a child
  const oldFieldCount = React.useRef(fields.length);
  // REFACTOR: extract this into hook and use everywhere where applicable
  useReadyEffect(
    React.useCallback(() => {
      if (
        fieldsContainerRef.current !== null &&
        fieldsContainerRef.current.lastChild !== null &&
        fieldsContainerRef.current.clientHeight !==
          fieldsContainerRef.current.scrollHeight &&
        fields.length > oldFieldCount.current
      )
        scrollIntoView(
          fieldsContainerRef.current.lastChild as HTMLElement,
          'nearest'
        );
      oldFieldCount.current = fields.length;
    }, [fields.length])
  );

  return (
    <Ul className="flex-1 overflow-y-auto" forwardRef={fieldsContainerRef}>
      {fields.map((field, line, { length }) => (
        <ErrorBoundary dismissible key={field.id}>
          <div
            className="flex items-center gap-2"
            draggable
            key={line}
            onDragOver={
              handleChangeFields === undefined
                ? undefined
                : (event) => handleDragOver(event, line)
            }
            onDragStart={
              handleChangeFields === undefined
                ? undefined
                : (event) => handleDragStart(event, line)
            }
          >
            <QueryLine
              baseTableName={baseTableName}
              enforceLengthLimit={enforceLengthLimit}
              field={field}
              fieldHash={`${line}_${length}`}
              getMappedFields={getMappedFields}
              isFocused={openedElement?.line === line}
              openedElement={
                openedElement?.line === line ? openedElement?.index : undefined
              }
              showHiddenFields={showHiddenFields}
              onChange={handleChangeField?.bind(undefined, line)}
              onClose={handleClose}
              onLineFocus={(target): void =>
                (target === 'previous' && line === 0) ||
                (target === 'next' && line + 1 >= length)
                  ? undefined
                  : handleLineFocus?.(
                      target === 'previous'
                        ? line - 1
                        : target === 'current'
                        ? line
                        : line + 1
                    )
              }
              onMappingChange={handleMappingChange?.bind(undefined, line)}
              onMoveDown={
                line + 1 === length || handleLineMove === undefined
                  ? undefined
                  : (): void => handleLineMove?.(line, 'down')
              }
              onMoveUp={
                line === 0 || handleLineMove === undefined
                  ? undefined
                  : (): void => handleLineMove?.(line, 'up')
              }
              onOpen={handleOpen?.bind(undefined, line)}
              onOpenMap={handleOpenMap?.bind(undefined, line)}
              onRemove={handleRemoveField?.bind(undefined, line)}
            />
          </div>
        </ErrorBoundary>
      ))}
    </Ul>
  );
}
