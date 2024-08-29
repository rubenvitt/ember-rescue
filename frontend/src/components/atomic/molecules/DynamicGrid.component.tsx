import { gridItemStyles } from '../../../styles/dynamicGrid.styles.ts';
import { Fragment, ReactNode, useMemo } from 'react';
import { Identifiable } from '../../../types/utils/common.types.js';

export function DynamicGrid<T extends Identifiable>({
                                                      items = [],
                                                      render,
                                                      columns = 3,
                                                    }: {
  items?: T[];
  render: (item: T, className: string) => ReactNode;
  columns?: number;
}) {
  const renderItems = useMemo(() => {
    return items.map((item, index) => {
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
        <Fragment key={item.id}>
          {render(item, className)}
        </Fragment>
      );
    });
  }, [items, render, columns]);

  // noinspection com.intellij.reactbuddy.ArrayToJSXMapInspection
  return (
    <div
      className={`grid gap-4 auto-rows-auto justify-items-center
              grid-cols-1 md:grid-cols-${columns}`}
    >
      {renderItems}
    </div>
  );
}