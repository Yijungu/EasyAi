import React from 'react';
import Svg, {Circle, Line} from 'react-native-svg';

const ResetFieldIcon = () => (
  <Svg height="24" width="24" viewBox="0 0 24 24">
    <Circle
      cx="12"
      cy="12"
      r="10"
      stroke="black"
      strokeWidth="2"
      fill="white"
    />
    <Line x1="8" y1="8" x2="16" y2="16" stroke="black" strokeWidth="2" />
    <Line x1="16" y1="8" x2="8" y2="16" stroke="black" strokeWidth="2" />
  </Svg>
);

export default ResetFieldIcon;
