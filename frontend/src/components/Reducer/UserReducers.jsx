import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userId: localStorage.getItem("user_id"),
    userName: localStorage.getItem("user_name"),
    userToken: localStorage.getItem("user_token"),
}
export const userSlice = createSlice({
    name: "UserData",
    initialState,
    reducers: {
        LoginUser: (state, action) => {
            state.userId = action.payload.user_id
            state.userName = action.payload.user_name
            state.userToken = action.payload.token

            localStorage.setItem("user_id", action.payload.user_id)
            localStorage.setItem("user_name", action.payload.user_name)
            localStorage.setItem("user_token", action.payload.token)
        },
        LogoutUser: (state, action) => {
            localStorage.removeItem("user_id")
            localStorage.removeItem("user_name")
            localStorage.removeItem("user_token")
        }
    }
})

export const { LoginUser, LogoutUser } = userSlice.actions
export default userSlice.reducer

