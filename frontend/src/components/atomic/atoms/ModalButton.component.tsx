import React from 'react';
import { Button, ButtonColor } from '../../deprecated/button.js';

interface ModalButtonProps {
  onClick: () => void;
  color?: ButtonColors;
  outline?: true;
  children: React.ReactNode;
}

export const ModalButton: React.FC<ModalButtonProps> = ({ onClick, color, outline, children }) => (
  <Button
    className="cursor-pointer"
    onClick={onClick}
    color={color}
  >
    {children}
  </Button>
);