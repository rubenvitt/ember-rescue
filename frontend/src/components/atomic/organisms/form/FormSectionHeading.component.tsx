import { ReactNode } from 'react';

interface FormSectionHeadingProps {
  heading: ReactNode;
  subHeading?: ReactNode;
}

export function FormSectionHeading({ heading, subHeading }: FormSectionHeadingProps): JSX.Element {
  return (
    <div className="space-y-1">
      {typeof heading === 'string' ? (
        <h3 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">{heading}</h3>
      ) : (
        heading
      )}
      {subHeading &&
        (typeof subHeading === 'string' ? (
          <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">{subHeading}</p>
        ) : (
          subHeading
        ))}
    </div>
  );
}
