import { contentStyles, expandedContentStyles, listItemStyles } from '../../../styles/expandableList.styles.ts';
import { ActionButtons } from './ActionButtons.component.js';
import { ExpandIcon } from '../atoms/ExpandIcon.component.js';
import { ExpandableListItemProps } from '../../../types/ui/expandableList.types.ts';
import { useCallback, useState } from 'react';

export const ExpandableListItem = <T,>({
  item,
  renderContent,
  renderExpandedContent,
  actionButtons = [],
  isExpandable = true,
}: ExpandableListItemProps<T>) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = useCallback(() => {
    if (isExpandable) {
      setIsExpanded(!isExpanded);
    }
  }, [isExpandable, isExpanded]);

  return (
    <li className={listItemStyles({ isExpanded })}>
      <button onClick={toggleExpand} className={contentStyles()}>
        <div className="flex-grow">{renderContent(item)}</div>
        {isExpandable && (
          <div className="flex-shrink-0">
            <ExpandIcon isExpanded={isExpanded} />
          </div>
        )}
      </button>
      {isExpanded && isExpandable && (
        <div className={expandedContentStyles()}>
          {renderExpandedContent?.(item)}
          <ActionButtons buttons={actionButtons} item={item} />
        </div>
      )}
    </li>
  );
};
