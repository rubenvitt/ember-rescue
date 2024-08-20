import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function FormContentBox({ children }: Props): JSX.Element {
  return <div className="bg-gray-50/10 p-8 rounded-lg shadow-lg flex flex-col gap-4">
    {children}
  </div>;
}