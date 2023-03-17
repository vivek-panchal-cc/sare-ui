import React from 'react'

import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CPagination, CLink, CFormGroup, CInput, CLabel, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton, CTooltip
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortDown, faSortUp, faPlus } from '@fortawesome/free-solid-svg-icons'
import { kycRequestService } from "../../../../services/admin/kyc_request.service";
import { notify, history, _canAccess, _loginUsersDetails, capitalize } from '../../../../_helpers/index';
import { globalConstants } from '../../../../constants/admin/global.constants';
const CheckBoxes = React.lazy(() => import('../../../../components/admin/Checkboxes'));
const MultiActionBar = React.lazy(() => import('../../../../components/admin/MultiActionBar'));

class KycRequest_list extends React.Component {

  constructor(props) {
    super(props);
    /************************** * Bind Method with class *******************************/
    this.handleColumnSort = this.handleColumnSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openDeletePopup = this.openDeletePopup.bind(this);
    this.deleteUser = this.deleteUser.bind(this);

    this.state = {
      fields: {
        pageNo: 1,
        sort_dir: 'asc',
        sort_field: "account_number",
        search_account_number: "",
        totalPage: 1
      },
      _openPopup: false,
      page_list: [],
      multiaction: [],
      allCheckedbox: false
    };

    if (this.props._renderAccess === false) {
      notify.error('Access Denied Contact to Super User');
      history.push('/admin');
    }
  }

  /***************** *  Get Api data when component Render very First Time *********************/
  componentDidMount() {
    this.getKycRequestList();
  }


  getKycRequestList() {
    kycRequestService.getList(this.state.fields).then(res => {
      if (res.status === false) {
        notify.error(res.message);
      } else {

        this.setState({
          totalRecords: res.totalRecords,
          fields: {
            ...this.state.fields,
            totalPage: res.totalPage
          },
          page_list: res.result
        });

        /*multi delete cms pages */
        if (res.result.length > 0) {
          let pages = res.result;
          let multiaction = [];
          for (var key in pages) {
            multiaction[pages[key]._id] = false;
          }
          this.setState({ multiaction: multiaction });
        } else if (res.result.length === 0) {
          this.setState({ multiaction: [] });
        }

      }
    });
  }


  /************************* * Define Methods For sorting and page change**************************/
  pageChange = newPage => {
    newPage = (newPage === 0) ? 1 : newPage;
    this.setState({
      fields: {
        ...this.state.fields,
        pageNo: newPage
      }
    }, () => { this.getKycRequestList() });
  }

  handleColumnSort(fieldName) {
    this.setState({
      fields: {
        ...this.state.fields,
        sort_dir: ['desc'].includes(this.state.fields.sort_dir) ? 'asc' : 'desc',
        sort_field: fieldName
      }
    }, () => { this.getKycRequestList() });
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ fields: { ...this.state.fields, [name]: value } });
  }

  handleSearch(type) {
    if (type === 'reset') {
      this.setState({
        fields: {
          pageNo: 1,
          sort_dir: 'asc',
          sort_field: "account_number",
          search_account_number: "",
          totalPage: 1
        }
      }, () => { this.getKycRequestList() });

    } else {
      this.getKycRequestList();
    }
  }

  openDeletePopup(id) {
    this.setState({ _openPopup: true, deleteId: id });
  }
  deleteUser() {
    this.setState({ _openPopup: false, deleteId: undefined });
    kycRequestService.deletepage(this.state.deleteId).then(res => {
      if (res.status === 'error') {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getKycRequestList();
      }
    });
  }


  PageStatusChangedHandler(page_id, status) {
    kycRequestService.changePageStatus(page_id, { status: !status }).then(res => {
      if (res.status === 'error') {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getKycRequestList();
      }
    });
  }

  handleAllChecked = (event) => {
    let multiactions = this.state.multiaction;
    //console.log(multiactions);
    for (var key in multiactions) {
      multiactions[key] = event.target.checked;
    }
    this.setState({ multiaction: multiactions, allCheckedbox: event.target.checked });
  }

  handleCheckChieldElement = (event) => {
    let multiactions = this.state.multiaction;
    multiactions[event.target.value] = event.target.checked;
    this.setState({ multiaction: multiactions });
  }



  resetCheckedBox() {
    this.setState({ allCheckedbox: false });
  }

  bulkPageStatusChangeHandler(postData) {
    kycRequestService.changeBulkPageStatus(postData).then(res => {
      if (res.status === 'error') {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getKycRequestList();
      }
    });
  }

  handleApplyAction = (actionValue = '') => {
    if (actionValue !== '') {
      let appliedActionId = [];
      let selectedIds = this.state.multiaction;
      for (var key in selectedIds) {
        if (selectedIds[key]) {
          appliedActionId.push(key);
        }
      }

      this.resetCheckedBox();
      switch (actionValue) {
        case 'delete':
          kycRequestService.deleteMultiplePages({ cms_ids: appliedActionId }).then(res => {
            if (res.status === false) {
              notify.error(res.message);
            } else {
              notify.success(res.message);
              this.getKycRequestList();
            }
          });
          break;
        case 'active': {
          this.bulkPageStatusChangeHandler({ cms_ids: appliedActionId, status: true });
          break;
        } case 'deactive': {
          this.bulkPageStatusChangeHandler({ cms_ids: appliedActionId, status: false });
          break;
        }
        default:
          return '';
      }
    }
  }

  /****************** * Render Data To Dom ************************/

  render() {
    const current_user = _loginUsersDetails();
    return (<>
      <CRow>
        <CCol xl={12}>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol xl={3}>
                  <CFormGroup row>
                    <CCol xs="12">
                      <CLabel htmlFor="name">Account Number</CLabel>
                      <CInput id="name" placeholder="Search Account Number" name="search_account_number" value={this.state.fields.search_account_number} onChange={this.handleChange} />
                    </CCol>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol xl={12}>
                  <CFormGroup row>
                    <CCol xs="1">
                      <button className="btn btn-dark btn-md" onClick={() => this.handleSearch()}>Search</button>
                    </CCol>
                    <CCol xs="2">
                      <button className="btn btn-dark btn-md" onClick={() => this.handleSearch('reset')}>Clear</button>
                    </CCol>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol xl={12}>
                  <CFormGroup row>
                    <CCol xs="1">
                    </CCol>
                  </CFormGroup>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xl={12}>
          <CCard>
            <CCardHeader>
              Kyc Requests
            </CCardHeader>
            <CCardBody>
              <div className="position-relative table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th onClick={() => this.handleColumnSort("account_number")}>
                        <span className="sortCls">
                          <span className="table-header-text-mrg">
                            Account Number
                          </span>
                          {this.state.fields.sort_field !== 'account_number' && <FontAwesomeIcon icon={faSort} />}
                          {this.state.fields.sort_dir === 'asc' && this.state.fields.sort_field === 'account_number' && <FontAwesomeIcon icon={faSortUp} />}
                          {this.state.fields.sort_dir === 'desc' && this.state.fields.sort_field === 'account_number' && <FontAwesomeIcon icon={faSortDown} />}
                        </span>
                      </th>
                      <th>Name</th>
                      <th onClick={() => this.handleColumnSort("status")}>
                        <span className="sortCls">
                          <span className="table-header-text-mrg">
                            Status
                          </span>
                          {this.state.fields.sort_field !== 'status' && <FontAwesomeIcon icon={faSort} />}
                          {this.state.fields.sort_dir === 'asc' && this.state.fields.sort_field === 'status' && <FontAwesomeIcon icon={faSortUp} />}
                          {this.state.fields.sort_dir === 'desc' && this.state.fields.sort_field === 'status' && <FontAwesomeIcon icon={faSortDown} />}
                        </span>
                      </th>
                      {(_canAccess('cms_pages', 'update') || _canAccess('cms_pages', 'delete')) && <><th>Action</th></>}
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.page_list.length > 0 &&
                      this.state.page_list.map((u, index) => (
                        <tr key={u._id}>
                          <td>{index + 1}</td>
                          {/* <td>  {_canAccess('cms_pages', 'view') && <CLink to={`/admin/cms_pages/detailview/${u._id}`}>{u.title}</CLink>}</td> */}
                          <td>{u.account_number}</td>
                          <td>{u.name}</td>
                          <td>{capitalize(u.status)}</td>
                          {(_canAccess('cms_pages', 'update')) && <>
                            <td>
                              {_canAccess('cms_pages', 'update') && <CTooltip content={globalConstants.Details_BTN}>
                                <CLink className="btn  btn-md btn-primary" aria-current="page" to={`/admin/kyc_requests/detailview/${u._id}`} ><CIcon name="cil-list"></CIcon> </CLink></CTooltip>
                              }
                            </td>
                          </>}
                        </tr>
                      ))
                    }
                    {this.state.page_list.length === 0 && <tr><td colSpan='5'>No records found</td></tr>}
                  </tbody>
                </table>
                <CPagination
                  activePage={this.state.fields.pageNo}
                  onActivePageChange={this.pageChange}
                  pages={this.state.fields.totalPage}
                  doubleArrows={true}
                  align="end"
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal
        show={this.state._openPopup}
        onClose={() => { this.setState({ _openPopup: !this.state._openPopup }) }}
        color="danger"
      >
        <CModalHeader closeButton>
          <CModalTitle>Delete Page</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete this record?
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={() => this.deleteUser()} >Delete</CButton>
          <CButton color="secondary" onClick={() => { this.setState({ _openPopup: !this.state._openPopup }) }}>Cancel</CButton>
        </CModalFooter>
      </CModal>
    </>);
  }

}

export default KycRequest_list
