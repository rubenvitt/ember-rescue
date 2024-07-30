import { ReactNode, useCallback, useState } from 'react';
import { ListFormRow } from '../molecules/ListFormRow.component.js';
import { TableHeaderComponent } from '../molecules/TableHeader.component.js';
import { GenericFormProps } from '../../../types/ui/form.types.ts';
import { Button } from '../molecules/Button.component.tsx';

interface ListFormProps<T> extends Omit<GenericFormProps<T>, 'defaultValues' | 'onSubmit'> {
  items: T[];
  onItemsChange: (newItems: T[]) => void;
  itemTemplate: T;
  renderFunctions?: Partial<Record<keyof T, (value: T[keyof T]) => ReactNode>>;
  produceDefaultItem?: (item: T) => T;
}

export function ListForm<T extends Record<string, any>>({
                                                          items,
                                                          onItemsChange,
                                                          itemTemplate,
                                                          renderFunctions,
                                                          produceDefaultItem,
                                                          ...genericFormProps
                                                        }: ListFormProps<T>) {
  const [newItem, setNewItem] = useState<T | null>(null);

  const handleAddItem = useCallback(() => {
    setNewItem({ ...itemTemplate });
  }, [itemTemplate]);

  const handleSaveItem = useCallback((updatedItem: T, index: number) => {
    onItemsChange(items.map((item, i) => i === index ? updatedItem : item));
  }, [items, onItemsChange]);

  const handleDeleteItem = useCallback((index: number) => {
    onItemsChange(items.filter((_, i) => i !== index));
  }, [items, onItemsChange]);

  const handleSaveNewItem = useCallback((item: T) => {
    onItemsChange([...items, item]);
    setNewItem(null);
  }, [items, onItemsChange]);

  const handleCancelNewItem = useCallback(() => {
    setNewItem(null);
  }, []);

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <TableHeaderComponent itemTemplate={itemTemplate} />
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-900 dark:text-gray-100">
        {items.map((item, index) => (
          <ListFormRow
            key={index}
            item={item}
            onSave={(updatedItem) => handleSaveItem(updatedItem, index)}
            onDelete={() => handleDeleteItem(index)}
            formProps={genericFormProps as Omit<GenericFormProps<T>, 'defaultValues' | 'onSubmit'>}
            renderFunctions={renderFunctions}
            produceDefaultItem={produceDefaultItem}
          />
        ))}
        {newItem && (
          <ListFormRow
            item={newItem}
            onSave={handleSaveNewItem}
            onDelete={handleCancelNewItem}
            formProps={genericFormProps as Omit<GenericFormProps<T>, 'defaultValues' | 'onSubmit'>}
            renderFunctions={renderFunctions}
            produceDefaultItem={produceDefaultItem}
            isNew
          />
        )}
        </tbody>
      </table>
      {!newItem && (
        <Button onClick={handleAddItem}>
          Neue Einheit anlegen
        </Button>
      )}
    </div>
  );
}