import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: "UserData",
    initialState: {},
    reducers: {
        LoginUser: (state, action) => {
            state.initialState = action.payload
        }
    }
})

export const { LoginUser } = userSlice.actions
export default userSlice.reducer