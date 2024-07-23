import React from 'react';
import { Button } from '../molecules/Button.component.tsx';
import { ButtonColor } from '../../../styles/button.styles.js';

interface ModalButtonProps {
  onClick: () => void;
  color?: ButtonColor;
  children: React.ReactNode;
}

export const ModalButton: React.FC<ModalButtonProps> = ({ onClick, color, children }) => (
  <Button
    className="cursor-pointer"
    onClick={onClick}
    // @ts-ignore
    color={color}
  >
    {children}
  </Button>
);