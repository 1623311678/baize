import React, { FC, useEffect, useState } from "react"

import { Menu } from "antd"
import { AppstoreOutlined,ThunderboltOutlined,PieChartOutlined,AreaChartOutlined } from "@ant-design/icons"
import { useHistory } from "react-router-dom"

const items = [
  {
    label: "操作",
    key: "actions",
    icon: <ThunderboltOutlined />
  },
  {
    label: "告警信息",
    key: "js-error",
    icon: <AppstoreOutlined></AppstoreOutlined>
  },
  {
    label: "PV",
    key: "pv",
    icon: <PieChartOutlined></PieChartOutlined>
  },
  {
    label: "UV",
    key: "uv",
    icon: <AreaChartOutlined />
  },
  // {
  //   label: "菜单",
  //   key: "menu",
  //   icon: <AppstoreOutlined></AppstoreOutlined>,
  //   children: [
  //     {
  //       label: "主页",
  //       key: "/",
  //       parentkey: ["menu"],
  //       icon: <AppstoreOutlined></AppstoreOutlined>
  //     },
  //     {
  //       label: "子菜单项1",
  //       key: "/about",
  //       parentkey: ["menu"],
  //       icon: <AppstoreOutlined></AppstoreOutlined>
  //     },
  //     {
  //       label: "子菜单项2",
  //       key: "/users",
  //       parentkey: ["menu"],
  //       icon: <AppstoreOutlined></AppstoreOutlined>,
  //       children: [
  //         {
  //           label: "users1",
  //           parentkey: ["menu", "/users"],
  //           key: "/users/app1",
  //           icon: <AppstoreOutlined></AppstoreOutlined>
  //         },
  //         {
  //           label: "users2",
  //           parentkey: ["menu", "/users"],
  //           key: "/users/app2",
  //           icon: <AppstoreOutlined></AppstoreOutlined>
  //         }
  //       ]
  //     }
  //   ]
  // }
]

const LayoutMenu: FC = () => {
  const history = useHistory()
  const pathName = history.location.pathname
  const [openKeys, setOpenKeys] = useState([])
  function handleClick(item) {
    history.push(item.key)
  }
  useEffect(() => {
    const getOpenKeys = () => {
      let openkeys = []
      const interate = (arr: any[]) => {
        for (let i = 0; i < arr.length; i++) {
          const current = arr[i]
          const curKey = current["key"]
          if (pathName === curKey) {
            openkeys = current["parentkey"]
          }
          const children = current["children"]
          if (children) {
            interate(children)
          }
        }
      }
      interate(items)
      return openkeys
    }
    const openkeys = getOpenKeys()
    setOpenKeys([...openkeys])
  }, [history])

  return (
    <Menu
      onClick={handleClick}
      style={{
        width: 256,
        minWidth: 256,
        height: `calc(100vh - ${80}px)`,
        background: "#fefefe",
        position: 'fixed',
        top: 80,
        bottom: 0,
        left: 0,
        overflow: 'auto',
        zIndex:999
      }}
      defaultSelectedKeys={[pathName]}
      openKeys={openKeys}
      // 注意这个属性 `onOpenChange`
      onOpenChange={openKeys => {
        setOpenKeys([...openKeys])
      }}
      mode="inline"
      items={items}
    />
  )
}
export default LayoutMenu
