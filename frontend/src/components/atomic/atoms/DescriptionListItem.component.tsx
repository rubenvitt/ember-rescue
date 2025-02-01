import React from 'react';

interface DescriptionListItemProps {
    label: string;
    value: React.ReactNode;
}

export const DescriptionListItem: React.FC<DescriptionListItemProps> = ({ label, value }) => {
    return (
        <div className="flex justify-between gap-x-4 py-3">
            <dt className="text-gray-500">{label}</dt>
            <dd className="text-gray-700 dark:text-gray-300">{value}</dd>
        </div>
    );
}; 