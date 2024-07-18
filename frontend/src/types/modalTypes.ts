import { ReactNode } from 'react';
import { SVGComponent } from './types.js';
import { ButtonColor } from '../styles/button.styles.js';


export type ModalVariant = 'dialog' | 'panel';
export type PanelColor = ButtonColor;

export interface ModalAction {
  label: string;
  onClick: () => void;
  color?: ButtonColor;
}

export interface ModalConfig {
  title: string;
  content: ReactNode;
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
  icon?: SVGComponent;
  fullWidth?: boolean;
  variant?: ModalVariant;
  panelColor?: PanelColor;
}

export type IsOpen = { isOpen: boolean; }