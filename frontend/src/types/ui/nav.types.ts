import { ToPathOption } from '@tanstack/react-router';
import { WithIcon } from '../utils/common.types.js';

export type NavItem = {
  name: string;
  href: ToPathOption;
  current?: boolean;
} & WithIcon

export interface NavItemProps {
  item: NavItem;
}

export interface NavListProps {
  items: NavItem[];
  title?: string;
}

export interface ContextualNavigation {
  title: string;
  items: NavItem[];
}

export interface SidebarContentProps {
  navigation: NavItem[];
  contextualNavigation?: ContextualNavigation;
}

export interface MobileSidebarProps extends SidebarContentProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export type DesktopSidebarProps = SidebarContentProps;

export interface SidebarComponentProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  navigation: Omit<NavItem, 'current'>[];
  contextualNavigation?: ContextualNavigation;
}