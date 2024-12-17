import React, { useEffect ,useState} from "react"
import { post, get, uploadFile } from "@src/api/request"
import {Table} from 'antd'

function Home() {
  const [data,setData] = useState([])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Password',
      dataIndex: 'password',
      key: 'password',
    },
    {
      title: 'Name',
      dataIndex: 'userName',
      key: 'name',
    },
  ];
  useEffect(() => {
    get("/users").then((res) => {
      setData(res)
    }).catch((err) => {
      setData([])
    })
  }, [])
  return (
    <div style={{margin:20}}>
     <div>用户列表</div>
     <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
    />
    </div>
  )
}
export default Home
