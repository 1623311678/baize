import React from "react"
import { Button, Card } from "antd"
const style = {
  margin: 5
}
const ActionsPage = () => {
  return (
    <Card title="异常触发" style={{ margin: 30, width: "80vw" }}>
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
          console.error("js错误-console.error")
        }}>
        触发console.error异常
      </Button>
      <Button
        style={style}
        type="primary"
        onClick={() => {
          new Promise((resolve, reject) => {
            reject(new Error("This is an unhandled rejection123333"))
          })
        }}>
        unhandledrejection 异常
      </Button>

      <Button
        style={style}
        type="primary"
        onClick={() => {
          // 模拟图片加载失败
          const img = document.createElement("img")
          img.src = "non-existent-image.png"
          img.alt = "This image does not exist"
          document.body.appendChild(img)

          // 模拟脚本加载失败
          const script = document.createElement("script")
          script.src = "non-existent-script.js"
          document.body.appendChild(script)

          // 模拟样式表加载失败
          const link = document.createElement("link")
          link.rel = "stylesheet"
          link.href = "non-existent-stylesheet.css"
          document.head.appendChild(link)
        }}>
        静态资源
      </Button>

      <Button
        style={style}
        type="primary"
        onClick={() => {
          const monitor: any = window.Monitor
          monitor.report({
            message: "自定义上报信息",
            type: "javascript",
            level: "info"
          })
        }}>
        自定义上报信息
      </Button>
      <Button
        style={style}
        type="primary"
        onClick={() => {
          const monitor: any = window.Monitor
          monitor.report({
            message: "自定义上报异常",
            type: "javascript",
            level: "warn"
          })
        }}>
        自定义上报异常
      </Button>
      <Button
        style={style}
        type="primary"
        onClick={() => {
          const monitor: any = window.Monitor
          monitor.report({
            message: "自定义上报警告",
            type: "javascript",
            level: "error"
          })
        }}>
        自定义上报警告
      </Button>
    </Card>
  )
}
export default ActionsPage
