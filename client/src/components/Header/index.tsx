import React from "react"
import { Dropdown, Card, Button } from "antd"
import { useDispatch, useSelector } from "react-redux"
import { removeUserInfo } from "@src/store/userInfoSlice"
import { post, get, uploadFile } from "@src/api/request"
import logoImage from "@src/assets/images/logo.png"

const Header = () => {
  const dispatch = useDispatch()
  const name = useSelector((state: any) => {
    return state.userInfo.userName
  })
  return (
    <div
      style={{
        height: 80,
        background: "black",
        display: "flex",
        alignItems: "center",
        position:'fixed',
        width:'100%',
        top:0,
        zIndex:999
      }}>
      <div>
        <img
          src={logoImage}
          alt="icon"
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "25px",
            marginLeft: 10
          }}></img>
      </div>
      <div
        className="title"
        style={{
          color: "white",
          width: "50px",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "18px"
        }}>
        白泽
      </div>
      <Dropdown
        overlay={
          <Card title="退出登录">
            <Button
              onClick={() => {
                post("/auth/logout").then(res => {
                  dispatch(removeUserInfo())
                  console.log("res", res)
                })
              }}>
              退出
            </Button>
          </Card>
        }>
        <div
          className="avtar"
          style={{
            position: "absolute",
            right:30,
            // background: "green",
            // marginLeft: "85%",
            borderRadius: "25px",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            fontSize: "14px",
            // fontWeight: "bold",
            overflow: "hidden"
          }}>
          {name}
        </div>
      </Dropdown>
    </div>
  )
}
export default Header
