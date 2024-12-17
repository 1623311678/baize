import React from "react"
import { Form, Checkbox, Input, Button, Card } from "antd"
import { LockOutlined, UserOutlined } from "@ant-design/icons"
import { useDispatch } from "react-redux"
import { updateUserInfo } from "@src/store/userInfoSlice"
import apiMap from "@src/api/apiMap"
import { post, get, uploadFile } from "@src/api/request"
const FormItem = Form.Item
const InputStyle = { width: "240px" }
const Login = () => {
  const dispatch = useDispatch()
  const onFinish = values => {
    post(apiMap.login, {
      userName: values["username"],
      password: values["password"]
    })
      .then(res => {
        if (res?.userName) {
          const payload = {}
          payload.token = res?.access_token
          payload.userName = res?.userName
          dispatch(updateUserInfo(payload))
        }
      })
      .catch(() => {})
  }

  const onFinishFailed = errorInfo => {
    console.log("Failed:", errorInfo)
  }
  return (
    <Card title="登录验证" style={{ width: "60%", margin: "20px auto" }}>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
          username: "admin",
          password: "123456"
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{ width: 260, margin: "20px auto" }}>
        <FormItem
          name="username"
          style={InputStyle}
          rules={[{ required: true, message: "用户名必填" }]}>
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="请输入用户名"
          />
        </FormItem>
        <FormItem
          name="password"
          style={InputStyle}
          rules={[{ required: true, message: "密码必填" }]}>
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="请输入密码"
          />
        </FormItem>
        <FormItem>
          <FormItem name="remember" valuePropName="checked" noStyle>
            <Checkbox>记住密码</Checkbox>
          </FormItem>
        </FormItem>

        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button">
            登录
          </Button>
        </FormItem>
      </Form>
    </Card>
  )
}
export default Login
