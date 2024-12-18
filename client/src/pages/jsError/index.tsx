import React, { useState, useEffect } from "react"
import { Table, Button, Tag, Card, Pagination } from "antd"
import { post, get, uploadFile } from "@src/api/request"
import apiMap from "@src/api/apiMap"

const JsErrorPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
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
      title: "type",
      dataIndex: "type",
      key: "type"
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
  const getList = (page = 1, limit = 10) => {
    setLoading(true)
    get(apiMap["getJsReportList"], { page, limit })
      .then((res: any) => {
        setData(res?.list)
        setTotal(res?.total || 10)
        setCurrentPage(page)
      })
      .catch(err => {
        console.log(err)
        setData([])
        setCurrentPage(1)
      })
      .finally(() => {
        setLoading(false)
      })
  }
  useEffect(() => {
    getList()
  }, [])
  return (
    <Card title="js异常" style={{ margin: 30 }}>
      <div>
        <Button
          type="primary"
          style={{ marginBottom: 10 }}
          onClick={() => {
            getList()
          }}>
          查询
        </Button>
      </div>
      <div style={{ maxHeight: "50vh", overflow: "auto", marginBottom: 20 }}>
        <Table
          columns={columns}
          dataSource={data}
          bordered={true}
          loading={loading}
          pagination={false}
        />
      </div>
      {data?.length ? (
        <Pagination
          current={currentPage}
          pageSize={10}
          total={total}
          pageSizeOptions={[]}
          onChange={(page, pageSize) => {
            getList(page, pageSize)
          }}></Pagination>
      ) : (
        ""
      )}
    </Card>
  )
}
export default JsErrorPage
