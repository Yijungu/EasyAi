import React, {useState, useRef} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import StrokeSettings, {COLORS, STROKE_SIZE} from './StrokeSettings';
import ResetFieldIcon from './ResetFieldIcon';

const Canvas = () => {
  const [paths, setPaths] = useState([]);
  const [color, setColor] = useState(COLORS[0]);
  const [stroke, setStroke] = useState(STROKE_SIZE[0]);
  const [canvasLayout, setCanvasLayout] = useState(null);
  const isDrawing = useRef(false);
  const diffCoords = useRef({x: null, y: null});

  const setNewPath = (e, x, y) => {
    const {locationX, locationY, pageX, pageY} = e.nativeEvent;
    const diffX = pageX - locationX;
    const diffY = pageY - locationY;
    diffCoords.current = {x: diffX, y: diffY};
    setPaths(prev => {
      const result = [...prev, {path: [`M${x} ${y}`], color, stroke}];
      return result;
    });
  };

  const updatePath = (x, y) => {
    setPaths(prev => {
      const currentPath = paths[paths.length - 1];
      if (currentPath) {
        currentPath.path.push(`L${x} ${y}`);
      }
      return currentPath ? [...prev.slice(0, -1), currentPath] : prev;
    });
  };

  const getRelativeCoords = e => {
    const {locationX, locationY} = e.nativeEvent;
    return {x: locationX, y: locationY};
  };

  return (
    <>
      <View
        style={styles.canvas}
        onLayout={e => {
          const layout = e.nativeEvent.layout;
          setCanvasLayout(layout);
        }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderStart={e => {
          if (canvasLayout) {
            e.stopPropagation(); // Prevent event propagation
            const {x, y} = getRelativeCoords(e);
            setNewPath(e, x, y);
            isDrawing.current = true;
          }
        }}
        onResponderMove={e => {
          if (canvasLayout) {
            e.stopPropagation(); // Prevent event propagation
            const {locationX, locationY, pageX, pageY} = e.nativeEvent;
            const {x: diffX, y: diffY} = diffCoords.current;
            if (pageX - locationX === diffX && pageY - locationY === diffY) {
              if (isDrawing.current) {
                updatePath(locationX, locationY);
              } else {
                setNewPath(e, locationX, locationY);
                isDrawing.current = true;
              }
            } else {
              isDrawing.current = false;
            }
          }
        }}
        onResponderEnd={() => {
          isDrawing.current = false;
        }}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => setPaths([])}>
          <ResetFieldIcon />
        </TouchableOpacity>
        <Svg style={StyleSheet.absoluteFill}>
          {paths.map(({path, color: c, stroke: s}, i) => (
            <Path
              key={i}
              d={path.join(' ')}
              fill="none"
              strokeWidth={s}
              stroke={c}
            />
          ))}
        </Svg>
      </View>
      <StrokeSettings
        strokeWidth={stroke}
        currentColor={color}
        onChangeColor={setColor}
        onChangeStroke={setStroke}
      />
    </>
  );
};

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  resetButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
});

export default Canvas;
