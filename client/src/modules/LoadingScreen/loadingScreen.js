import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import styles from './style';

export default function LoadingScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      
      navigation.replace('Login');
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2563EB" />
      <Text style={styles.text}>Quase lá...</Text>
    </View>
  );
}