import { gridItemStyles } from '../../../styles/dynamicGrid.styles.ts';
import { Identifiable } from '../../../types/types.js';
import { ItemType } from './Combobox.component.js';
import { Fragment, ReactNode, useMemo } from 'react';

export function DynamicGrid<T extends Identifiable>({
                                                      items = [],
                                                      render,
                                                      columns = 3,
                                                    }: {
  items?: ItemType<T>[];
  render: (item: T, className: string) => ReactNode;
  columns?: number;
}) {
  const renderItems = useMemo(() => {
    return items.map((itemWrapper, index) => {
      const isLastItem = index === items.length - 1;
      const remainingItems = items.length % columns;

      const span = isLastItem
        ? remainingItems === 1
          ? 'full'
          : remainingItems === 2
            ? 'two'
            : 'default'
        : 'default';

      const className = gridItemStyles({ span });

      return (
        <Fragment key={itemWrapper.item.id}>
          {render(itemWrapper.item, className)}
        </Fragment>
      );
    });
  }, [items, render, columns]);

  // noinspection com.intellij.reactbuddy.ArrayToJSXMapInspection
  return (
    <div
      className={`grid gap-4 auto-rows-auto justify-items-center`}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {renderItems}
    </div>
  );
}