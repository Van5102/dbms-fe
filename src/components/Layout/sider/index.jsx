import { useMemo } from "react"
import { AiptLogo } from "assets"
import { findPageByPath, findChildByName, isEmpty } from "utils/helps"
import { useLocation } from "react-router-dom"
import pages from "pages"
import './index.scss'

import {
  Layout, Menu
} from "antd"

const AppSider = () => {
  const currentPath = useLocation().pathname

  // menu items
  const items = pages.filter(page => page?.auth === true && page?.label && !page?.parent)
    .map(page => {
      const children = findChildByName(page?.name)
      let item = {
        key: page?.name,
        icon: page?.icon,
        label: page?.label,
      } 
      
      if (!isEmpty(children)) {
        item.children = children
      }
      return item
    });

  // menu default selected key
  const selectedKeys = useMemo(() => {
    const page = findPageByPath(currentPath, pages)
    let key = page?.name

    if (!key) {
      key = 'home'
    }
    else if (key === 'file-preview') {
      key = 'document'
    }

    return key
  }, [currentPath])

  return (
    <Layout.Sider className="app-sider"
      breakpoint="lg"
      collapsedWidth={0}
      width={225}
    >
      <div className="app-sider--logo">
        <img src={AiptLogo} alt="logo" />
      </div>

      <div className="app-sider--buttom">
        <Menu
          className="w-full"
          items={items}
          theme="light"
          mode="inline"
          onClick={(e) => window.navigatePage(e.key)}
          defaultSelectedKeys={selectedKeys}
        />
      </div>
    </Layout.Sider>
  )
}

export default AppSider