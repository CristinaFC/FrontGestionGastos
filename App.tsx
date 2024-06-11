import React from 'react';
import {Provider} from 'react-redux';

import {persistor, store} from './src/store';
import {PersistGate} from 'redux-persist/integration/react';
import MainRouter, {MyDrawer} from './src/navigation/Router';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './src/navigation/RootRouting';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <NavigationContainer ref={navigationRef}>
          <PersistGate persistor={persistor}>
            <MainRouter />
          </PersistGate>
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
