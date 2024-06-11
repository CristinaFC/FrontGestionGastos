import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import { persistReducer, persistStore } from 'redux-persist';

import AsyncStorage from '@react-native-async-storage/async-storage';
import rootReducer from './rootReducer';


// Configura la persistencia
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
};

// Combina los reducers en uno solo
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configura el store
const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk]
});

// Configura la persistencia
const persistor = persistStore(store);


export { store, persistor };

