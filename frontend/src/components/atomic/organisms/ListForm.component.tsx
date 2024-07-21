import { ReactNode, useState } from 'react';
import { GenericFormProps } from './GenericForm.component.js';
import { ListFormRow } from '../molecules/ListFormRow.component.js';
import { Button } from '../../deprecated/button.js';

interface ListFormProps<T> extends Omit<GenericFormProps<T>, 'defaultValues' | 'onSubmit'> {
  items: T[];
  onItemsChange: (newItems: T[]) => void;
  itemTemplate: T;
  renderFunctions?: Partial<Record<keyof T, (value: T[keyof T]) => ReactNode>>;
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

  const handleAddItem = () => {
    setNewItem({ ...itemTemplate });
  };

  const handleSaveItem = (updatedItem: T, index: number) => {
    const newItems = [...items];
    newItems[index] = updatedItem;
    onItemsChange(newItems);
  };

  const handleDeleteItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onItemsChange(newItems);
  };

  const handleSaveNewItem = (item: T) => {
    onItemsChange([...items, item]);
    setNewItem(null);
  };

  const handleCancelNewItem = () => {
    setNewItem(null);
  };

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          {Object.keys(itemTemplate).map((key) => (
            <th key={key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {key}
            </th>
          ))}
          <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Actions
          </th>
        </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-900 dark:text-gray-100">
        {items.map((item, index) => (
          // @ts-ignore
          <ListFormRow
            key={index}
            item={item}
            onSave={(updatedItem) => handleSaveItem(updatedItem, index)}
            onDelete={() => handleDeleteItem(index)}
            formProps={genericFormProps}
            renderFunctions={renderFunctions}
            produceDefaultItem={produceDefaultItem}
          />
        ))}
        {newItem && (
          <ListFormRow
            item={newItem}
            onSave={handleSaveNewItem}
            onDelete={handleCancelNewItem}
            formProps={genericFormProps}
            renderFunctions={renderFunctions}
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