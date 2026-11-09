import * as React from 'react';
import {NavigationContainer, Theme, DefaultTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import SplashScreen from '../screens/splash/SplashScreen';
import {ROUTE_NAMES} from './RouteNames';
import HomeScreen from '../screens/Home';
import WelcomeScreen from '../screens/WelcomeScreen';
import MainHome from '../screens/MainHome';
import PageOne from '../screens/Pages/PageOne';
import PageTwo from '../screens/Pages/PageTwo';
import {useMemo, useState, createContext} from 'react';

const Stack = createStackNavigator();

// Linking configuration for deep links
const linking = {
  prefixes: ['myapp://', 'example://'],
  config: {
    screens: {
      [ROUTE_NAMES.MAIN_HOME]: 'home',
      [ROUTE_NAMES.PAGE_ONE]: 'page1',
      [ROUTE_NAMES.PAGE_TWO]: 'page2',
      [ROUTE_NAMES.HOME]: 'chat',
      [ROUTE_NAMES.CHATBOT]: 'chatbot',
      [ROUTE_NAMES.WELCOME_SCREEN]: 'welcome',
    },
  },
};

// Create a ThemeContext to provide background color and setter
export const ThemeContext = createContext<{
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
}>({
  backgroundColor: 'white',
  setBackgroundColor: () => {},
});

const AppContainer = React.memo(() => {
  const [backgroundColor, setBackgroundColor] = useState('white');

  // Create a custom theme object based on the state
  const theme = useMemo(
    (): Theme => ({
      ...DefaultTheme,
      dark: false,
      colors: {
        ...DefaultTheme.colors,
        background: backgroundColor,
      },
    }),
    [backgroundColor],
  );

  return (
    <ThemeContext.Provider value={{backgroundColor, setBackgroundColor}}>
      <NavigationContainer theme={theme} linking={linking}>
        <Stack.Navigator
          initialRouteName={ROUTE_NAMES.SPLASH}
          screenOptions={{headerShown: false}}>
          <Stack.Group>
            <Stack.Screen name={ROUTE_NAMES.SPLASH} component={SplashScreen} />
            <Stack.Screen
              name={ROUTE_NAMES.MAIN_HOME}
              component={MainHome}
            />
            <Stack.Screen
              name={ROUTE_NAMES.PAGE_ONE}
              component={PageOne}
            />
            <Stack.Screen
              name={ROUTE_NAMES.PAGE_TWO}
              component={PageTwo}
            />
            <Stack.Screen
              name={ROUTE_NAMES.WELCOME_SCREEN}
              component={WelcomeScreen}
            />
            <Stack.Screen name={ROUTE_NAMES.HOME}>
              {props => (
                <HomeScreen {...props} onStatusBarColor={setBackgroundColor} />
              )}
            </Stack.Screen>
            <Stack.Screen name={ROUTE_NAMES.CHATBOT}>
              {props => (
                <HomeScreen {...props} onStatusBarColor={setBackgroundColor} />
              )}
            </Stack.Screen>
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  );
});

export default AppContainer;
