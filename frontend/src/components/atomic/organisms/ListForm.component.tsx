import React, { useState } from 'react';
import { GenericFormProps } from './GenericForm.component.js';
import { ListFormRow } from '../molecules/ListFormRow.component.js';

interface ListFormProps<T> extends Omit<GenericFormProps<T>, 'defaultValues' | 'onSubmit'> {
  items: T[];
  onItemsChange: (newItems: T[]) => void;
  itemTemplate: T;
  renderFunctions?: {
    [K in keyof T]?: (value: T[K]) => React.ReactNode;
  };
}

export function ListForm<T extends Record<string, any>>({
                                                          items,
                                                          onItemsChange,
                                                          itemTemplate,
                                                          renderFunctions,
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
        <thead className="bg-gray-50">
        <tr>
          {Object.keys(itemTemplate).map((key) => (
            <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {key}
            </th>
          ))}
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
        {items.map((item, index) => (
          // @ts-ignore
          <ListFormRow
            key={index}
            item={item}
            index={index}
            // @ts-ignore
            onSave={(updatedItem) => handleSaveItem(updatedItem, index)}
            onDelete={() => handleDeleteItem(index)}
            formProps={genericFormProps}
            renderFunctions={renderFunctions}
          />
        ))}
        {newItem && (
          <ListFormRow
            item={newItem}
            index={-1}
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
        <button
          onClick={handleAddItem}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Item
        </button>
      )}
    </div>
  );
}