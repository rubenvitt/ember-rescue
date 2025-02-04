import { useCallback, useState } from 'react';
import { contentStyles, expandedContentStyles, listItemStyles } from '../../../styles/expandableList.styles.ts';
import { ExpandableListItemProps } from '../../../types/ui/expandableList.types.ts';
import { ExpandIcon } from '../atoms/ExpandIcon.component.js';
import { ActionButtons } from './ActionButtons.component.js';

export const ExpandableListItem = <T,>({
  item,
  renderContent,
  renderExpandedContent,
  actionButtons = () => [],
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
        <div className="grow">{renderContent(item)}</div>
        {isExpandable && (
          <div className="shrink-0">
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
