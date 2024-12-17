import React from "react"
import { Button, Card } from "antd"
const style={
    margin:5
}
const ActionsPage = () => {
  return (
    <Card title="异常触发" style={{ margin: 30 }}>
      <Button
        type="primary"
        style={style}
        onClick={() => {
          bbb = 1
        }}>
        触发js异常
      </Button>
      <Button
       style={style}
        type="primary"
        onClick={() => {
          console.error('js错误')
        }}>
        触发console.error异常
      </Button>
    </Card>
  )
}
export default ActionsPage
