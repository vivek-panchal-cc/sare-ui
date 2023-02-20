import React from 'react'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { history } from '../_helpers';


const TheHeaderDropdown = (props) => {

  const _logout = () => {
    localStorage.removeItem('user');
    history.push('/admin/login');
  }

  return (
    <CDropdown
      inNav
      className="c-header-nav-items mx-2"
      direction="down"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          <CImg
            src={'/avatars/default-avatar.png'}
            className="c-avatar-img"
            alt="admin@bootstrapmaster.com"
          />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
      
          <CDropdownItem onClick={()=>{history.push('/admin/my-profile')}}>
           <CIcon name="cil-user" className="mfe-2" />My Profile
          </CDropdownItem>
      
        <CDropdownItem divider />
        <CDropdownItem onClick={_logout}>
          <CIcon name="cil-lock-locked" className="mfe-2" />
          Log out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}



export default TheHeaderDropdown;