import React from 'react';
import {Text, StyleSheet} from 'react-native';

const Title = ({children}) => {
  return <Text style={styles.title}>{children}</Text>;
};

const styles = StyleSheet.create({
  title: {
    position: 'absolute',
    top: 80,
    fontSize: 40,
    marginBottom: 300,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default Title;
