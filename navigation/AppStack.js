import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


import { HomeScreen, HowItWorksScreen , ProfileScreen , ResultsScreen} from '../screens';
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
      <Tab.Screen 
        name="Home" 
        component={HomeScreenStack} 
        options={{tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home" color={color} size={size} />
        ),}} 
      />
      <Tab.Screen 
        name="Meus Resultados" 
        component={ResultsScreen} 
        options={{tabBarIcon: ({ color, size }) => (
        <MaterialCommunityIcons name="chart-bar" color={color} size={size} />
        ),}} 
      />
      <Tab.Screen 
        name="Como funciona" 
        component={HowItWorksScreen} 
        options={{tabBarIcon: ({ color, size }) => (
        <MaterialCommunityIcons name="help-circle" color={color} size={size} />
        ),}} 
        />
      <Tab.Screen 
        name="Perfil" 
        component={ProfileScreen} 
        options={{tabBarIcon: ({ color, size }) => (
        <MaterialCommunityIcons name="account" color={color} size={size} />
        ),}} 
      />
    </Tab.Navigator>
  );
};
