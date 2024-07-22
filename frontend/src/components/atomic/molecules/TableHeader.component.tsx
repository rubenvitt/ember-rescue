export const TableHeaderComponent = <T extends Record<string, any>>({ itemTemplate }: { itemTemplate: T }) => (
  <thead className="bg-gray-50 dark:bg-gray-800">
  <tr>
    {Object.keys(itemTemplate).map((key) => (
      <th
        key={key}
        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
      >
        {key}
      </th>
    ))}
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
      Actions
    </th>
  </tr>
  </thead>
);