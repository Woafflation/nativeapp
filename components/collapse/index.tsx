import React, {useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  UIManager,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export interface IProps {
  id?: number;
  title: string;
  description: string;
  isExpanded?: boolean;
  setIsExpanded?: () => void;
}

const Collapse = ({title, description, isExpanded, setIsExpanded}: IProps) => {
  const handleIsExpandedChange = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (setIsExpanded) {
      setIsExpanded();
    }
  }, [setIsExpanded]);

  return (
    <View style={styles.root}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleIsExpandedChange}
        style={styles.collapseBtn}>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
      {isExpanded && (
        <View style={[styles.collapseBlock]}>
          <Text style={styles.description}>{description}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    borderWidth: 1,
    borderColor: '#d9d9d9',
    overflow: 'hidden',
  },
  collapseBtn: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  title: {
    fontSize: 17,
    color: 'rgba(0,0,0,.85)',
  },
  collapseBlock: {
    borderTopWidth: 1,
    borderTopColor: '#d9d9d9',
  },
  description: {
    fontSize: 17,
    padding: 10,
  },
});

export default Collapse;
