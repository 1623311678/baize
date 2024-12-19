import React, { useState, useEffect } from "react"
import { Table, Button, Tag, Card, Pagination } from "antd"
import { post, get, uploadFile } from "@src/api/request"
import apiMap from "@src/api/apiMap"

const PvPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const columns = [
    {
      title: "页面链接",
      dataIndex: "url",
      key: "url"
    },
    {
      title: "访问量",
      dataIndex: "count",
      key: "count"
    },
    {
      title: "平均FCP(ms)",
      dataIndex: "fcp",
      key: "fcp"
    },
    {
      title: "平均LCP(ms)",
      dataIndex: "lcp",
      key: "lcp"
    },
    {
      title: "平均加载时间(ms)",
      dataIndex: "loadTime",
      key: "loadTime"
    },
    {
      title: "用户设备",
      dataIndex: "userAgent",
      key: "userAgent",
      width:300,
    }
  ]
  const getList = (page = 1, limit = 10) => {
    setLoading(true)
    get(apiMap["getPvList"], { page, limit })
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
    <Card title="PV信息" style={{ margin: 30, width: "80vw" }}>
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
export default PvPage
