import React, { FC, useEffect } from "react"
import { createRoot } from "react-dom/client"
import LayoutRouter from "@src/router"
import { BrowserRouter } from "react-router-dom"
import LayoutMenu from "./menu"
import LayoutHeader from "@src/components/Header"
import store from "./store"
import { Provider, useSelector } from "react-redux"
import Login from "./pages/Login"
import MonitoringSDK from '@hun-dun/monitor-sdk'
import "normalize.css"
import "./app.less"
new MonitoringSDK('http://localhost:3001/api/report');
const App: FC = () => {
  const token = useSelector((state: any) => {
    return state.userInfo.token
  })
  if (token) {
    return (
      <BrowserRouter>
        <LayoutHeader />
        <div style={{ display: "flex"}}>
          <LayoutMenu />
          <div style={{height:'80vh',overflow:'auto',width:'calc(100% - 300px)' }}>
          <LayoutRouter></LayoutRouter>
          </div>

        </div>
      </BrowserRouter>
    )
  }
  return <Login></Login>
}
const rootDom = document.getElementById("root")
const root = createRoot(rootDom)

root.render(
  <Provider store={store}>
    <App />
  </Provider>
)
