import { Identifiable } from '../../../types.js';
import { ItemType } from './Combobox.component.js';
import { Fragment, ReactNode, useMemo } from 'react';

export function DynamicGrid<T extends Identifiable>({
                                                      items,
                                                      render,
                                                    }: {
  items?: ItemType<T>[];
  render: (item: T, className: string) => ReactNode;
}) {
  const renderItems = useMemo(() => {
    return items?.map((itemWrapper, index) => {
      let className = 'p-4 flex items-center justify-center';

      if (index === items.length - 1) { // Letztes Element
        if (items.length % 3 === 1) {
          className += ' col-span-3'; // Zentriert über volle Breite
        } else if (items.length % 3 === 2) {
          className += ' col-start-2 col-span-2'; // Zentriert über 2 Spalten
        }
      }

      return (
        <Fragment key={itemWrapper.item.id}>
          {render(itemWrapper.item, className)}
        </Fragment>
      );
    }) ?? [];
  }, [items, render]);

  return (
    <div className="grid grid-cols-3 gap-4 auto-rows-auto justify-items-center">
      {renderItems.map((renderItem) => renderItem)}
    </div>
  );
}
