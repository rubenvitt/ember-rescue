import { ToPathOption } from '@tanstack/react-router';
import { WithIcon } from '../utils/common.types.js';

export type NavItem = {
  name: string;
  href: ToPathOption;
  current?: boolean;
} & WithIcon;

export interface NavItemProps {
  item: NavItem;
}

export interface NavListProps {
  items: NavItem[];
  title?: string;
}

export interface SidebarContentProps {}

export interface MobileSidebarProps extends SidebarContentProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export type DesktopSidebarProps = SidebarContentProps & {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
};

export interface SidebarComponentProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}
