import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    managerId: localStorage.getItem("manager_id"),
    managerName: localStorage.getItem("manager_name"),
    managerToken: localStorage.getItem("manager_token"),
}
export const managerSlice = createSlice({
    name: "managerData",
    initialState,
    reducers: {
        LoginManager: (state, action) => {
            state.managerId = action.payload.id
            state.managerName = action.payload.name
            state.managerToken = action.payload.token

            localStorage.setItem("manager_id", action.payload.id)
            localStorage.setItem("manager_name", action.payload.name)
            localStorage.setItem("manager_token", action.payload.token)
        },
        LogoutManager: (state, action) => {
            localStorage.removeItem("manager_id")
            localStorage.removeItem("manager_name")
            localStorage.removeItem("manager_token")
        }
    }
})

export const { LoginManager, LogoutManager } = managerSlice.actions
export default managerSlice.reducer 