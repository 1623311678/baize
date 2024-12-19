import React, { useState, useEffect } from "react"
import { Table, Button, Tag, Card, Pagination, Flex } from "antd"
import { post, get, uploadFile } from "@src/api/request"
import apiMap from "@src/api/apiMap"
import { formatTimeStr } from "@src/utils"
const size = 10
const tagStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  width: 150,
  cursor: "pointer"
}
const numberStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: "bold"
}
const UvPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [userCount, setUserCount] = useState(0)
  const [userSevenDayCount, setSevenDayCount] = useState(0)
  const [userOneDayCount, setOneDayCount] = useState(0)
  const [userMonthCount, setMonthCount] = useState(0)
  const columns = [
    {
      title: "日期",
      dataIndex: "visitDate",
      key: "visitDate",
      render: (text: string) => {
        return <div>{formatTimeStr(text, "YYYY-MM-DD")}</div>
      }
    },
    {
      title: "UV总数",
      dataIndex: "uniqueVisitors",
      key: "uniqueVisitors",
      render: (text: number) => {
        return <div>{text}</div>
      }
    }
  ]
  const getList = (page = 1, limit = size) => {
    setLoading(true)
    get(apiMap["daliyUVList"], { page, limit })
      .then((res: any) => {
        setData(res?.data || [])
        setTotal(res?.total || 0)
        setCurrentPage(page)
      })
      .catch(err => {
        // console.log(err)
        setData([])
        setCurrentPage(1)
      })
      .finally(() => {
        setLoading(false)
      })
  }
  const getUserCount = () => {
    get(apiMap["getAllUserCounts"]).then((res: number) => {
      setUserCount(res ? res : 0)
    })
  }
  const getActiveUserCount = (days,callback) => {
    get(apiMap["getActiveUsersCounts"],{days}).then((res: number) => {
      callback(res)
    })
  }
  useEffect(() => {
    getList()
    getUserCount()
    getActiveUserCount(7,setSevenDayCount)
    getActiveUserCount(1,setOneDayCount)
    getActiveUserCount(30,setMonthCount)
  }, [])
  return (
    <Card title="UV信息" style={{ margin: 30, width: "80vw" }}>
      <div style={{ marginBottom: 20 }}>
        <Flex gap="4px 0" wrap={false} style={{ height: 80 }}>
          <Tag color="#55acee" style={tagStyle}>
            <div>用户总数量</div>
            <div style={numberStyle}>{userCount}</div>
          </Tag>
          <Tag color="#55acee" style={tagStyle}>
          <div>24小时活跃用户</div>
          <div style={numberStyle}>{userOneDayCount}</div>
          </Tag>
          <Tag color="#cd201f" style={tagStyle}>
          <div>7日活跃用户</div>
          <div style={numberStyle}>{userSevenDayCount}</div>
          </Tag>
          <Tag color="#3b5999" style={tagStyle}>
          <div>月活用户</div>
          <div style={numberStyle}>{userMonthCount}</div>
          </Tag>
        </Flex>
      </div>
      <div>
        <Button
          type="primary"
          style={{ marginBottom: 10 }}
          onClick={() => {
            getList()
          }}>
          查询
        </Button>
        {/* <Button
          type="primary"
          style={{marginLeft:10}}
        >
          总数{total}
        </Button> */}
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
          pageSize={size}
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
