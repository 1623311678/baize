import React, { useState, useEffect } from "react"
import { Table, Button, Tag, Card, Pagination, Modal } from "antd"
import { post, get, uploadFile } from "@src/api/request"
import apiMap from "@src/api/apiMap"
import { formatTimeStr } from "@src/utils"

const JsErrorPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [previewStr, setPreviewStr] = useState(null)
  const getContent = (text = "") => {
    return (
      <div>
        <div>{text.slice(0, 100)}</div>
        <Button
          type="primary"
          size="small"
          onClick={() => {
            setPreviewStr(text)
          }}>
          查看详情
        </Button>
      </div>
    )
  }
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 50
    },
    {
      title: "页面链接",
      dataIndex: "url",
      key: "url",
      width: 200
    },
    {
      title: "级别",
      dataIndex: "level",
      key: "level",
      width: 200
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      width: 200
    },
    {
      title: "信息",
      dataIndex: "message",
      key: "message",
      width: 300,
      render: (text: string) => {
        return <div>{getContent(text)}</div>
      }
    },
    {
      title: "调用栈",
      dataIndex: "stack",
      key: "stack",
      width: 300,
      render: (text: string) => {
        return <div>{getContent(text)}</div>
      }
    },
    {
      title: "userAgent",
      dataIndex: "userAgent",
      key: "userAgent",
      width: 300,
      render: (text: string) => {
        return <div>{getContent(text)}</div>
      }
    },
    {
      title: "时间",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (text: number) => {
        return <div>{formatTimeStr(text, "YYYY-MM-DD HH:mm:ss")}</div>
      }
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
    <Card title="告警信息" style={{ margin: 30 }}>
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
      <Modal
        open={!!previewStr}
        title="详细信息"
        onOk={() => {
          setPreviewStr(null)
        }}
        onCancel={() => {
          setPreviewStr(null)
        }}>
        {previewStr}
      </Modal>
    </Card>
  )
}
export default JsErrorPage
