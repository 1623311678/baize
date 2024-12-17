import React, { useState, useEffect } from "react"
import { Table, Button,Tag,Card } from "antd"
import { post, get, uploadFile } from "@src/api/request"
import apiMap from "@src/api/apiMap"

const JsErrorPage = () => {
  const [data, setData] = useState([])
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id"
    },
    {
      title: "url",
      dataIndex: "url",
      key: "url"
    },
    {
      title: "message",
      dataIndex: "message",
      key: "message"
    },
    {
      title: "stack",
      dataIndex: "stack",
      key: "stack"
    },
    {
      title: "userAgent",
      dataIndex: "userAgent",
      key: "userAgent"
    },
    {
      title: "timestamp",
      dataIndex: "timestamp",
      key: "timestamp"
    }
  ]
  useEffect(() => {
    get(apiMap["getJsReportList"]).then((res: any) => {
      setData(res)
    }).catch((err) => {
      console.log(err)
      setData([])
    })
  }, [])
  return (
    <Card title='js异常' style={{margin:30}}>
      <Table columns={columns} dataSource={data} />
    </Card>
  )
}
export default JsErrorPage
