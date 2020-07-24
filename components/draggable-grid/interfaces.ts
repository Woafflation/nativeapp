import * as React from 'react';
import {Animated} from 'react-native';

export interface IOnLayoutEvent {
  nativeEvent: {layout: {x: number; y: number; width: number; height: number}};
}

export interface IBaseItemType {
  key: string;
  disabledDrag?: boolean;
  disabledReSorted?: boolean;
}

export interface IDraggableGridProps<DataType extends IBaseItemType> {
  numColumns: number;
  data: DataType[];
  renderItem: (item: DataType, order: number) => React.ReactElement;
  onDragRelease?: (newSortedData: DataType[]) => void;
}

export interface IMap<T> {
  [key: string]: T;
}

export interface IPositionOffset {
  x: number;
  y: number;
}

export interface IOrderMapItem {
  order: number;
}

export interface IItem<DataType> {
  key: string;
  itemData: DataType;
  currentPosition: Animated.AnimatedValueXY;
}
