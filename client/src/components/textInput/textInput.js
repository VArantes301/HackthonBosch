import React from 'react';
import { View, Text, TextInput } from 'react-native';
import styles from './style';

const CustomInput = ({ label, error, style, ...rest }) => {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor="#9CA3AF"
        {...rest}
      />
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default CustomInput;