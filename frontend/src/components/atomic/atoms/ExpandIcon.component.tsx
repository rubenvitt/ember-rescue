import { PiCaretDownLight, PiCaretRightLight } from 'react-icons/pi';
import React from 'react';

export const ExpandIcon: React.FC<{ isExpanded: boolean }> = ({ isExpanded }) =>
  isExpanded ? (
    <PiCaretDownLight className="h-5 w-5 text-gray-400" />
  ) : (
    <PiCaretRightLight className="h-5 w-5 text-gray-400" />
  );