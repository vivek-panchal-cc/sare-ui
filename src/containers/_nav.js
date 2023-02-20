import React from 'react'
import CIcon from '@coreui/icons-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faUser,faUserFriends, faCogs,faFileAlt,faTasks,faFlag,faCog} from '@fortawesome/free-solid-svg-icons'

const _nav =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/admin/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>,
    module_name:'dashboard',
    id:'dashboard_sidebar_id'
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Access']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Modules Management',
    to: '/admin/system_modules',
    icon: <FontAwesomeIcon icon={faCogs} className="c-sidebar-nav-icon"/>,
    module_name:'system_modules',
    id:'system_modules_sidebar_id'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Groups Management',
    to: '/admin/user_groups',
    icon: <FontAwesomeIcon icon={faUserFriends} className="c-sidebar-nav-icon"/>,
    module_name:'user_groups',
    id:'user_groups_sidebar_id'
  },{

    _tag: 'CSidebarNavItem',
    name: 'Users Management',
    to: '/admin/users',
    icon: <FontAwesomeIcon icon={faUser} className="c-sidebar-nav-icon"/>,
    module_name:'users',
    id:'users_sidebar_id'
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Content Management']
  }
  ,{
    _tag: 'CSidebarNavItem',
    name: 'Pages',
    to: '/admin/cms_pages',
    icon: <FontAwesomeIcon icon={faFileAlt} className="c-sidebar-nav-icon"/>,
    module_name:'cms_pages',
    id:'cms_pages_sidebar_id'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Menu',
    to: '/admin/menu_management',
    icon: <FontAwesomeIcon icon={faTasks} className="c-sidebar-nav-icon"/>,
    module_name:'menu_management',
    id:'menu_management_sidebar_id'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Banner',
    to: '/admin/banner_management',
    icon: <FontAwesomeIcon icon={faFlag} className="c-sidebar-nav-icon"/>,
    module_name:'banner_management',
    id:'banner_management_sidebar_id'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Theme Setting',
    to: '/admin/theme_setting',
    icon: <FontAwesomeIcon icon={faCog} className="c-sidebar-nav-icon"/>,
    module_name:'theme_setting',
    id:'theme_setting_sidebar_id'
  }
]

export default _nav
