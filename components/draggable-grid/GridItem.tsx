/** @format */

import * as React from 'react';
import {
  Animated,
  StyleProp,
  TouchableWithoutFeedback,
  StyleSheet,
  GestureResponderHandlers,
} from 'react-native';
import {FunctionComponent} from 'react';

interface BlockProps {
  style?: StyleProp<any>;
  dragStartAnimationStyle: StyleProp<any>;
  onPress?: () => void;
  onLongPress: () => void;
  panHandlers: GestureResponderHandlers;
}

const GridItem: FunctionComponent<BlockProps> = ({
  style,
  dragStartAnimationStyle,
  onPress,
  onLongPress,
  children,
  panHandlers,
}) => {
  return (
    <Animated.View
      style={[styles.blockContainer, style, dragStartAnimationStyle]}
      {...panHandlers}>
      <Animated.View>
        <TouchableWithoutFeedback onPress={onPress} onLongPress={onLongPress}>
          {children}
        </TouchableWithoutFeedback>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  blockContainer: {
    alignItems: 'center',
  },
});

export default GridItem;
