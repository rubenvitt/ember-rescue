import { Button, Tooltip } from 'antd';
import React from 'react';
import { PiCaretLeft, PiCaretRight } from 'react-icons/pi';
import { DesktopSidebarProps } from '../../../../types/ui/nav.types.js';
import { SidebarContentComponent } from './SidebarContent.component.js';

export const DesktopSidebarComponent: React.FC<DesktopSidebarProps> = ({ setIsCollapsed, isCollapsed }) => {
  return (
    <div className={` hidden transition-all duration-300 ease-in-out lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col ${isCollapsed ? 'lg:w-16' : 'lg:w-72'}`}>
      <SidebarContentComponent isCollapsed={isCollapsed} />
      <Tooltip title="Navigation Ein/Ausklappen" placement="right" arrow={true}>
        <div className="absolute -right-3 top-8 rounded-full text-white shadow-lg">
          <Button onClick={() => setIsCollapsed(!isCollapsed)} shape="circle" className="p-1 text-white shadow-lg">
            {isCollapsed ? <PiCaretRight size={20} /> : <PiCaretLeft size={20} />}
          </Button>
        </div>
      </Tooltip>
    </div>
  );
};
