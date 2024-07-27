import { listStyles } from '../../../styles/expandableList.styles.ts';
import { ExpandableListItem } from '../molecules/ExpandableListItem.component.js';
import { ExpandableListProps } from '../../../types/ui/expandableList.types.js';

import { Identifiable } from '../../../types/utils/common.types.js';

export const ExpandableList = <T extends Identifiable>({
                                                         items,
                                                         renderItem,
                                                         renderExpandedContent,
                                                         actionButtons,
                                                         isExpandable = true,
                                                       }: ExpandableListProps<T>) => {
  return (
    <ul className={listStyles()}>
      {items.map((item) => (
        <ExpandableListItem
          key={item.id}
          item={item}
          renderContent={renderItem}
          renderExpandedContent={renderExpandedContent}
          actionButtons={actionButtons}
          isExpandable={isExpandable}
        />
      ))}
    </ul>
  );
};