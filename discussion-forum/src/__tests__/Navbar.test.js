// src/components/__tests__/Navbar.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../Navbar';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, combineReducers } from 'redux';
import sidebarReducer from '../../context/sidebarSlice';
import themeReducer from '../../context/themeSlice'; // Adjust the path as per your project structure
import '@testing-library/jest-dom/extend-expect';

const rootReducer = combineReducers({
  sidebar: sidebarReducer,
  theme: themeReducer,
});

const store = createStore(rootReducer);

describe('Navbar Component', () => {
  test('renders Navbar component and toggles sidebar', () => {
    render(
      <Provider store={store}>
        <Router>
          <Navbar />
        </Router>
      </Provider>
    );

    // Check if the Navbar component renders correctly
    const navbarElement = screen.getByTestId('navbar-component');
    expect(navbarElement).toBeInTheDocument();

    // Check initial state
    expect(store.getState().sidebar.open).toBe(false); // Assuming sidebar starts closed

    // Simulate clicking on the hamburger icon to toggle sidebar
    fireEvent.click(navbarElement.querySelector('.transition-transform')); // Adjust selector based on actual button in Navbar

    // Assert that sidebar state is toggled
    expect(store.getState().sidebar.open).toBe(true);
  });
});
