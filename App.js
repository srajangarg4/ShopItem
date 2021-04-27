import React from 'react';
import Main from './components/MainComponent';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/ConfigureStore';
import { decode, encode } from 'base-64';
import { ThemeProvider } from 'react-native-elements'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

const store = ConfigureStore();

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={{colors: {primary: 'tomato'}}}>
      <Main />
      </ThemeProvider>
    </Provider>
  );
}