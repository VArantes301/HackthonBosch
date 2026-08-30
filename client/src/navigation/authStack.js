import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from '../modules/registerScreen/registerScreen';
import LoginScreen from '../modules/loginScreen/loginScreen';
import LoadingScreen from '../modules/LoadingScreen/loadingScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName='Loading' screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Loading" component={LoadingScreen}/>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}