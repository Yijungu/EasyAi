import React, {useState} from 'react';
import {View, TouchableOpacity, Dimensions, StyleSheet} from 'react-native';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';

const StrokeView = ({color, size}) => {
  return (
    <View
      style={{
        backgroundColor: color,
        width: size,
        height: size,
        borderRadius: size / 2,
      }}
    />
  );
};

export const COLORS = [
  '#000000',
  '#FFFFFF',
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFFF00',
];

export const STROKE_SIZE = [6, 12, 18, 24];

const StrokeSettings = ({
  onChangeColor,
  onChangeStroke,
  currentColor,
  strokeWidth,
}) => {
  const [openColor, setOpenColor] = useState(false);
  const [openStroke, setOpenStroke] = useState(false);

  const COLOR_CONTAINER_WIDTH = openColor ? 250 : 40;
  const STROKE_CONTAINER_WIDTH = openStroke ? 180 : 45;

  const colorAnimatedStyles = useAnimatedStyle(() => {
    return {
      left: 10,
      width: withTiming(COLOR_CONTAINER_WIDTH),
    };
  });

  const strokeAnimatedStyles = useAnimatedStyle(() => {
    return {
      right: 10,
      width: withTiming(STROKE_CONTAINER_WIDTH),
    };
  });

  const handleColorSelector = c => {
    onChangeColor(c);
    setOpenColor(false);
  };

  const handleStrokeSelector = s => {
    onChangeStroke(s);
    setOpenStroke(false);
  };

  const handleToggleColor = () => {
    setOpenColor(old => !old);
    setOpenStroke(false);
  };

  const handleToggleStrokeSize = () => {
    setOpenStroke(old => !old);
    setOpenColor(false);
  };

  return (
    <>
      <Animated.View style={[styles.container, colorAnimatedStyles]}>
        <>
          {!openColor && (
            <TouchableOpacity
              onPress={handleToggleColor}
              style={[
                {
                  backgroundColor: currentColor,
                },
                styles.colorButton,
              ]}
            />
          )}
          {openColor &&
            COLORS.map(c => {
              return (
                <TouchableOpacity
                  key={c}
                  onPress={() => handleColorSelector(c)}
                  style={[{backgroundColor: c}, styles.colorButton]}
                />
              );
            })}
        </>
      </Animated.View>
      <Animated.View style={[styles.container, strokeAnimatedStyles]}>
        <>
          {!openStroke && (
            <TouchableOpacity
              onPress={handleToggleStrokeSize}
              style={styles.colorButton}>
              <StrokeView color={currentColor} size={strokeWidth} />
            </TouchableOpacity>
          )}
          {openStroke &&
            STROKE_SIZE.map(s => {
              return (
                <TouchableOpacity
                  key={s}
                  onPress={() => handleStrokeSelector(s)}
                  style={styles.colorButton}>
                  <StrokeView color={currentColor} size={s} />
                </TouchableOpacity>
              );
            })}
        </>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 30,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    top: 140,
  },
  colorButton: {
    width: 20,
    height: 20,
    borderRadius: 20,
    margin: 10,
  },
});

export default StrokeSettings;
