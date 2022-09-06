import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AnimatedTabBarNavigator } from 'react-native-animated-nav-tab-bar';
import Feather from "react-native-vector-icons/Feather";
import { OverlayProvider } from 'stream-chat-react-native';
import { View, Text } from 'react-native';
// import screens
import HomeScreen from './src/screens/Home';
import RegisterScreen from './src/screens/Register';
import ChatStack from './src/screens/Chat';
import SplashScreen from './src/screens/SplashScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SignInScreen from './src/screens/SignIn';
import { AuthProvider } from './context/UserAuth';
import { theme } from './src/components/Theme';

const Stack = createStackNavigator();
const Tabs = AnimatedTabBarNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Home'
        component={HomeScreen}
        options={{
          headerLeft: () => null,
          gestureEnabled: false
        }}
      />
    </Stack.Navigator>
  );
}

const NotificationScreen = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: 'grey', fontSize: 24, fontWeight: '700' }}>
        No Notification
      </Text>
    </View>
  );
}

const MainTab = ({ navigation, route }) => {
  return (
    <OverlayProvider value={{ style: theme }}>
      <Tabs.Navigator
        initialRouteName='Chats'
        tabBarOptions={{
          tabStyle: {
            borderRadius: 18,
            height: 75,
          },
          activeTintColor: 'white'
        }}
        appearance={{ floating: true, activeTabBackgrounds: 'purple' }}
      >
        <Tabs.Screen name='Home' component={HomeStack}
          options={{
            tabBarIcon: ({ focused }) => <Feather name="home" size={24} color={focused ? "white" : "purple"} />
          }}
        />
        <Tabs.Screen name='Chats' component={ChatStack}
          options={{
            tabBarIcon: ({ focused }) => <Feather name="message-square" size={24} color={focused ? "white" : "purple"} />
          }}
        />
        <Tabs.Screen name='Notification' component={NotificationScreen}
          options={{
            tabBarIcon: ({ focused }) => <Feather name="bell" size={24} color={focused ? "white" : "purple"} />
          }}
        />
        <Tabs.Screen name='Profile' component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) => <Feather name="user" size={24} color={focused ? "white" : "purple"} />
          }}
        />
      </Tabs.Navigator>
    </OverlayProvider>
  );
}

const RootStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name='splash' component={SplashScreen} />
      <Stack.Screen name='auth' component={SignInScreen} />
      <Stack.Screen name='register' component={RegisterScreen} />
      <Stack.Screen
        name='main'
        component={MainTab}
        options={{
          headerLeft: () => null,
          gestureEnabled: false
        }}
      />
    </Stack.Navigator>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;