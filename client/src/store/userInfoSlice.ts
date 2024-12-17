import { createSlice } from "@reduxjs/toolkit"

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: {
    token: localStorage.getItem("token"),
    userName: localStorage.getItem("name")
  },
  reducers: {
    updateUserInfo: (state, action) => {
      localStorage.setItem("token", action.payload.token)
      localStorage.setItem("name", action.payload.userName)
      state.token = action.payload.token
      state.userName = action.payload.userName
    },
    removeUserInfo: state => {
      localStorage.removeItem("token")
      localStorage.removeItem("name")
      state.token = null
      state.userName = ""
    }
  }
})
// 每个 case reducer 函数会生成对应的 Action creators
export const { updateUserInfo, removeUserInfo } = userInfoSlice.actions

export default userInfoSlice.reducer
