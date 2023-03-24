import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import Routes from './src/routes';
import AuthProvider from './src/contexts/auth';

import { StatusBar } from 'react-native';


export default function DevPostApp() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar backgroundColor="#36393f" barStyle='light-content' translucent={false} />
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  );
}