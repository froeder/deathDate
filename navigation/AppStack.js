import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HomeScreen, HowItWorksScreen } from '../screens';
const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

<Tab.Navigator>
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Profile" component={HomeScreen} />
</Tab.Navigator>

function HomeScreenStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={HomeScreen}  options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}


export const AppStack = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreenStack} />
      <Tab.Screen name="Meus Resultados" component={HowItWorksScreen} />
      <Tab.Screen name="Como funciona" component={HowItWorksScreen} />
      <Tab.Screen name="Perfil" component={HowItWorksScreen} />
    </Tab.Navigator>
  );
};
