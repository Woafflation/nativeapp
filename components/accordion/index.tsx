import React, {useState} from 'react';
import Collapse, {IProps as CollapseProps} from '../collapse';

interface IProps {
  data: Array<CollapseProps>;
}

const Accordion = ({data}: IProps) => {
  const [currentOpenedCollapseId, setCurrentOpenedCollapse] = useState('');

  const handleOpenedCollapseChange = (collapseId: string) => {
    if (currentOpenedCollapseId === collapseId) {
      setCurrentOpenedCollapse('');
    } else {
      setCurrentOpenedCollapse(collapseId);
    }
  };

  return (
    <>
      {data.map(({id, title, description}) => (
        <Collapse
          key={id}
          title={title}
          description={description}
          isExpanded={currentOpenedCollapseId === id}
          setIsExpanded={() => handleOpenedCollapseChange(id)}
        />
      ))}
    </>
  );
};

export default Accordion;
