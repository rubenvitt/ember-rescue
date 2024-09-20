import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function FormContentBox({ children }: Props): JSX.Element {
  return <div className="flex flex-col gap-4 rounded-lg bg-gray-50/10 p-8 shadow-lg">{children}</div>;
}
