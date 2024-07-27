import { ReactNode } from 'react';
import { ButtonColor } from '../../styles/button.styles.js';
import { SVGComponent } from '../utils/common.types.js';


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