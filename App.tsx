// import 'react-native-gesture-handler';
import React from 'react';
import {Provider} from 'react-redux';

import {persistor, store} from './src/store';
import {PersistGate} from 'redux-persist/integration/react';
import MainRouter, {MyDrawer} from './src/navigation/Router';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './src/navigation/RootRouting';

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <PersistGate persistor={persistor}>
          <MainRouter />
          {/* <MyDrawer /> */}
        </PersistGate>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
