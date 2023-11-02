import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit';
import userSlice from './components/Reducer/Reducer.jsx';
import { localStorageMiddleware } from './components/MiddleWare/MiddleWare.jsx';
import App from './App.jsx'
import './index.css'

export const preloadedState = () => { return JSON.parse(localStorage.getItem('userData')) || {} } // Load from localStorage

const store = configureStore({
    reducer: {
        userData: userSlice,
    },
    middleware: (getData) => {
        return getData().concat(localStorageMiddleware)
    },
    preloadedState: preloadedState()
});


ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App />
    </Provider>
)