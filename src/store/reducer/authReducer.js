import {createSlice} from '@reduxjs/toolkit';

const authReducer = createSlice({
    name: 'authentication',
    initialState: {
        isLogin: !!localStorage.getItem('token'),
        user: {
            username: null,
            email: null,
            role: null,
            createdAt: null
        }
    },
    reducers: {
        login(state, action) {
            state.isLogin = true;
            state.user.username = action.payload.username;
            state.user.email = action.payload.email;
            state.user.role = action.payload.role;
            state.user.createdAt = action.payload.createdAt;
        },
        logout(state) {
            localStorage.removeItem('token');
            state.isLogin = false;
        }
    }
});

export const authAction = authReducer.actions;

export default authReducer;
