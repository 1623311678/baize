import React, { useState, useEffect } from "react"
import { Table, Button, Tag, Card, Pagination } from "antd"
import { post, get, uploadFile } from "@src/api/request"
import apiMap from "@src/api/apiMap"

const UvPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const columns = [
    {
      title: "url",
      dataIndex: "url",
      key: "url"
    },
    {
      title: "count",
      dataIndex: "count",
      key: "count"
    },
    {
      title: "userAgent",
      dataIndex: "userAgent",
      key: "userAgent"
    }
  ]
  const getList = (page = 1, limit = 10) => {
    setLoading(true)
    get(apiMap["totalUv"], { date:'2024-12-18' })
      .then((res: any) => {
    
        setTotal(res || 0)
      })
      .catch(err => {
        // console.log(err)
        // setData([])
        // setCurrentPage(1)
      })
      .finally(() => {
        setLoading(false)
      })
  }
  useEffect(() => {
    getList()
  }, [])
  return (
    <Card title="UV信息" style={{ margin: 30, width: "80vw" }}>
      <div>
        <Button
          type="primary"
          style={{ marginBottom: 10 }}
          onClick={() => {
            getList()
          }}>
          查询
        </Button>
        <Button
          type="primary"
          style={{marginLeft:10}}
        >
          总数{total}
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
export default UvPage
