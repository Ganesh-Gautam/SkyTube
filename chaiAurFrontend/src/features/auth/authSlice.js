import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentUser, loginUser , registerUser , logoutUser  } from "./authService.js";

const login = createAsyncThunk("auth/login", async(data)=>{
    return await loginUser(data);
})

const register = createAsyncThunk("auth/register", async(data)=>{
    return await registerUser(data);
})

const logout = createAsyncThunk("auth/logout", async () => {
    return await logoutUser();
});

const fetchCurrentUser = createAsyncThunk("auth/currentUser",async()=>{
    return await getCurrentUser();
});

const authSlice = createSlice({
    name : "auth",
    initialState : {
        user : null,
        status : false,  
    },
    reducers : {},
    extraReducers : (builder) =>{
        builder
        .addCase(login.fulfilled, (state, action) => {
            state.status=true;
            state.user = action.payload.data;
        })
        .addCase(register.fulfilled, (state, action) => {
            state.status=false;
            state.user = action.payload.data;
        })
        .addCase(fetchCurrentUser.fulfilled, (state, action) => {
            state.status=true;
            state.user = action.payload.data;
        })
        .addCase(logout.fulfilled, (state) => {
            state.status=false;
            state.user = null;
        })
        .addCase(logout.rejected, (state) => {
            state.status=false;
            state.user = null;
        });
    }
})
export {login, register, logout, fetchCurrentUser}
export default authSlice.reducer;
