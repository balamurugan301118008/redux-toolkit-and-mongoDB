import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    adminId: localStorage.getItem("admin_id"),
    adminName: localStorage.getItem("admin_name"),
    adminToken: localStorage.getItem("admin_token"),
}
export const adminSlice = createSlice({
    name: "adminData",
    initialState,
    reducers: {
        LoginAdmin: (state, action) => {
            state.adminId = action.payload.id
            state.adminName = action.payload.name
            state.adminToken = action.payload.token

            localStorage.setItem("admin_id", action.payload.id)
            localStorage.setItem("admin_name", action.payload.name)
            localStorage.setItem("admin_token", action.payload.token)
        },
        LogoutAdmin: (state, action) => {
            localStorage.removeItem("admin_id")
            localStorage.removeItem("admin_name")
            localStorage.removeItem("admin_token")
        }
    }
})

export const { LoginAdmin, LogoutAdmin } = adminSlice.actions
export default adminSlice.reducer 