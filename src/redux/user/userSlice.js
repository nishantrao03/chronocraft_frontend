import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    user: null,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    // reducers:{
    //     setUser: (state, action) => {
    //         state.user = action.payload;
    //       },
    //       clearUser: (state) => {
    //         state.user = null;
    //       },
    // },
    reducers: {
      setUserId: (state, action) => {
          state.userId = action.payload;
      },
      setToken: (state, action) => {
          state.token = action.payload;
      },
      setIsAuthenticated: (state, action) => {
        state.isAuthenticated = action.payload;
      },
  },
})

export const {setIsAuthenticated, setUserId, setToken} = userSlice.actions

export default userSlice.reducer