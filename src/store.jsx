import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // Middleware for handling async actions
import rootReducer from './redux/index'; // Import the root reducer

// Initial state (optional)
const initialState = {};

// Middleware array (you can add more middleware if needed)
const middleware = [thunk];

// Create the Redux store
const store = createStore(
  rootReducer, // Root reducer that combines all individual reducers
  initialState, // Initial state (if any)
  applyMiddleware(...middleware) // Apply middleware
);

export default store;