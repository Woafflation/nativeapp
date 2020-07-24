import * as React from 'react';
import {useState, useEffect, useCallback} from 'react';
import {
  PanResponder,
  Animated,
  StyleSheet,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';

import GridItem from './GridItem';

import {differenceBy, findIndex, findKey} from './utils';
import {
  IBaseItemType,
  IDraggableGridProps,
  IItem,
  IMap,
  IOnLayoutEvent,
  IOrderMapItem,
  IPositionOffset,
} from './interfaces';

let activeBlockOffset = {x: 0, y: 0};

const DraggableGrid = function <DataType extends IBaseItemType>(
  props: IDraggableGridProps<DataType>,
) {
  const [blockPositions] = useState<IPositionOffset[]>([]);
  const [orderMap] = useState<IMap<IOrderMapItem>>({});
  const [itemMap] = useState<IMap<DataType>>({});
  const [items] = useState<IItem<DataType>[]>([]);
  const [blockHeight, setBlockHeight] = useState(0);
  const [blockWidth, setBlockWidth] = useState(0);
  const [gridHeight] = useState<Animated.Value>(new Animated.Value(0));
  const [hadInitBlockSize, setHadInitBlockSize] = useState(false);
  const [dragStartAnimatedValue] = useState(new Animated.Value(1));
  const [gridLayout, setGridLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [activeItemIndex, setActiveItemIndex] = useState<undefined | number>();

  const getActiveItem = () => {
    if (activeItemIndex === undefined) {
      return false;
    }
    return items[activeItemIndex];
  };

  const moveBlockToBlockOrderPosition = (itemKey: string) => {
    const itemIndex = findIndex(items, (item) => item.key === itemKey);
    items[itemIndex].currentPosition.flattenOffset();
    Animated.timing(items[itemIndex].currentPosition, {
      toValue: blockPositions[orderMap[itemKey].order],
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const getKeyByOrder = (order: number) =>
    findKey(orderMap, (item: IOrderMapItem) => item.order === order) as string;

  const getSortData = () => {
    const sortData: DataType[] = [];
    items.forEach((item) => {
      sortData[orderMap[item.key].order] = item.itemData;
    });
    return sortData;
  };

  const assessGridSize = (event: IOnLayoutEvent) => {
    if (!hadInitBlockSize) {
      const blockWidth = event.nativeEvent.layout.width / props.numColumns;
      setBlockWidth(blockWidth);
      setBlockHeight(blockWidth);
      setGridLayout(event.nativeEvent.layout);
      setHadInitBlockSize(true);
    }
  };

  const [panResponderCapture, setPanResponderCapture] = useState(false);

  const resetBlockPositionByOrder = (
    activeItemOrder: number,
    insertedPositionOrder: number,
  ) => {
    let disabledReSortedItemCount = 0;
    if (activeItemOrder > insertedPositionOrder) {
      for (let i = activeItemOrder - 1; i >= insertedPositionOrder; i--) {
        const key = getKeyByOrder(i);
        const item = itemMap[key];
        if (item && item.disabledReSorted) {
          disabledReSortedItemCount++;
        } else {
          orderMap[key].order += disabledReSortedItemCount + 1;
          disabledReSortedItemCount = 0;
          moveBlockToBlockOrderPosition(key);
        }
      }
    } else {
      for (let i = activeItemOrder + 1; i <= insertedPositionOrder; i++) {
        const key = getKeyByOrder(i);
        const item = itemMap[key];
        if (item && item.disabledReSorted) {
          disabledReSortedItemCount++;
        } else {
          orderMap[key].order -= disabledReSortedItemCount + 1;
          disabledReSortedItemCount = 0;
          moveBlockToBlockOrderPosition(key);
        }
      }
    }
  };

  const getDistance = (
    startOffset: IPositionOffset,
    endOffset: IPositionOffset,
  ) => {
    const xDistance = startOffset.x + activeBlockOffset.x - endOffset.x;
    const yDistance = startOffset.y + activeBlockOffset.y - endOffset.y;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
  };

  const onHandMove = (
    nativeEvent: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => {
    const activeItem = getActiveItem();
    if (!activeItem) {
      return false;
    }
    const {moveX, moveY} = gestureState;

    const xChokeAmount = Math.max(
      0,
      activeBlockOffset.x + moveX - (gridLayout.width - blockWidth),
    );
    const xMinChokeAmount = Math.min(0, activeBlockOffset.x + moveX);

    const dragPosition = {
      x: moveX - xChokeAmount - xMinChokeAmount,
      y: moveY,
    };
    const originPosition = blockPositions[orderMap[activeItem.key].order];
    const dragPositionToActivePositionDistance = getDistance(
      dragPosition,
      originPosition,
    );
    activeItem.currentPosition.setValue(dragPosition);

    let closetItemIndex = activeItemIndex as number;
    let closetDistance = dragPositionToActivePositionDistance;

    items.forEach((item, index) => {
      if (item.itemData.disabledReSorted) {
        return;
      }
      if (index !== activeItemIndex) {
        const dragPositionToItemPositionDistance = getDistance(
          dragPosition,
          blockPositions[orderMap[item.key].order],
        );
        if (
          dragPositionToItemPositionDistance < closetDistance &&
          dragPositionToItemPositionDistance < blockWidth
        ) {
          closetItemIndex = index;
          closetDistance = dragPositionToItemPositionDistance;
        }
      }
    });
    if (activeItemIndex !== closetItemIndex) {
      const closetOrder = orderMap[items[closetItemIndex].key].order;
      resetBlockPositionByOrder(orderMap[activeItem.key].order, closetOrder);
      orderMap[activeItem.key].order = closetOrder;
    }
  };

  const onHandRelease = () => {
    const activeItem = getActiveItem();
    if (!activeItem) {
      return false;
    }
    props.onDragRelease && props.onDragRelease(getSortData());
    setPanResponderCapture(false);
    activeItem.currentPosition.flattenOffset();
    moveBlockToBlockOrderPosition(activeItem.key);
    setActiveItemIndex(undefined);
  };

  const onStartDrag = (
    nativeEvent: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => {
    const activeItem = getActiveItem();
    if (!activeItem) {
      return false;
    }
    const {x0, y0, moveX, moveY} = gestureState;
    const activeOrigin = blockPositions[orderMap[activeItem.key].order];
    const x = activeOrigin.x - x0;
    const y = activeOrigin.y - y0;
    activeItem.currentPosition.setOffset({
      x,
      y,
    });
    activeBlockOffset = {
      x,
      y,
    };
    activeItem.currentPosition.setValue({
      x: moveX,
      y: moveY,
    });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => false,
    onMoveShouldSetPanResponder: () => panResponderCapture,
    onMoveShouldSetPanResponderCapture: () => panResponderCapture,
    onShouldBlockNativeResponder: () => false,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: onStartDrag,
    onPanResponderMove: onHandMove,
    onPanResponderRelease: onHandRelease,
  });

  const getBlockPositionByOrder = useCallback(
    (order: number) => {
      if (blockPositions[order]) {
        return blockPositions[order];
      }
      const columnOnRow = order % props.numColumns;
      const y = blockHeight * Math.floor(order / props.numColumns);
      const x = columnOnRow * blockWidth;
      return {
        x,
        y,
      };
    },
    [blockHeight, blockPositions, blockWidth, props.numColumns],
  );

  const initBlockPositions = useCallback(() => {
    items.forEach((item, index) => {
      blockPositions[index] = getBlockPositionByOrder(index);
    });
  }, [blockPositions, getBlockPositionByOrder, items]);

  const resetGridHeight = () => {
    const rowCount = Math.ceil(props.data.length / props.numColumns);
    gridHeight.setValue(rowCount * blockHeight);
  };

  const setActiveBlock = (itemIndex: number, item: DataType) => {
    if (item.disabledDrag) {
      return;
    }

    setPanResponderCapture(true);
    setActiveItemIndex(itemIndex);
  };

  const getBlockStyle = (itemIndex: number) => [
    {
      justifyContent: 'center',
      alignItems: 'center',
    },
    hadInitBlockSize && {
      width: blockWidth,
      height: blockHeight,
      position: 'absolute',
      top: items[itemIndex].currentPosition.getLayout().top,
      left: items[itemIndex].currentPosition.getLayout().left,
    },
  ];

  const getDefaultDragStartAnimation = () => ({
    transform: [
      {
        scale: dragStartAnimatedValue,
      },
    ],
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  });

  const getDragStartAnimation = (itemIndex: number) => {
    if (activeItemIndex !== itemIndex) {
      return;
    }

    const dragStartAnimation = getDefaultDragStartAnimation();
    return {
      zIndex: 3,
      ...dragStartAnimation,
    };
  };

  const addItem = (item: DataType, index: number) => {
    blockPositions.push(getBlockPositionByOrder(items.length));
    orderMap[item.key] = {
      order: index,
    };
    itemMap[item.key] = item;
    items.push({
      key: item.key,
      itemData: item,
      currentPosition: new Animated.ValueXY(getBlockPositionByOrder(index)),
    });
  };

  const removeItem = (item: IItem<DataType>) => {
    const itemIndex = findIndex(items, (curItem) => curItem.key === item.key);
    items.splice(itemIndex, 1);
    blockPositions.pop();
    delete orderMap[item.key];
  };

  const diffData = () => {
    props.data.forEach((item, index) => {
      if (orderMap[item.key]) {
        if (orderMap[item.key].order !== index) {
          orderMap[item.key].order = index;
          moveBlockToBlockOrderPosition(item.key);
        }
        const currentItem = items.find((i) => i.key === item.key);
        if (currentItem) {
          currentItem.itemData = item;
        }
        itemMap[item.key] = item;
      } else {
        addItem(item, index);
      }
    });
    const deleteItems = differenceBy(items, props.data, 'key');
    deleteItems.forEach((item) => {
      removeItem(item);
    });
  };

  useEffect(() => {
    if (hadInitBlockSize) {
      initBlockPositions();
    }
  }, [gridLayout, hadInitBlockSize, initBlockPositions]);

  useEffect(() => {
    resetGridHeight();
  });

  if (hadInitBlockSize) {
    diffData();
  }

  const itemList = items.map((item, itemIndex) => {
    return (
      <GridItem
        onPress={setActiveBlock.bind(null, itemIndex, item.itemData)}
        onLongPress={setActiveBlock.bind(null, itemIndex, item.itemData)}
        panHandlers={panResponder.panHandlers}
        style={getBlockStyle(itemIndex)}
        dragStartAnimationStyle={getDragStartAnimation(itemIndex)}
        key={item.key}>
        {props.renderItem(item.itemData, orderMap[item.key].order)}
      </GridItem>
    );
  });

  return (
    <Animated.View
      style={[
        styles.draggableGrid,
        {
          height: gridHeight,
        },
      ]}
      onLayout={assessGridSize}>
      {hadInitBlockSize && itemList}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  draggableGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: '100%',
  },
});

export default DraggableGrid;
