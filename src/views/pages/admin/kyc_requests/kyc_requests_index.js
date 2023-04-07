import React from "react";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CPagination,
  CLink,
  CFormGroup,
  CInput,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
  CTooltip,
  CSelect,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortDown,
  faSortUp,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { kycRequestService } from "../../../../services/admin/kyc_request.service";
import {
  notify,
  history,
  _canAccess,
  _loginUsersDetails,
  capitalize,
} from "../../../../_helpers/index";
import { globalConstants } from "../../../../constants/admin/global.constants";
const UserGroups = React.lazy(() =>
  import("../../../../components/admin/UserGroups")
);
const CheckBoxes = React.lazy(() =>
  import("../../../../components/admin/Checkboxes")
);
const MultiActionBar = React.lazy(() =>
  import("../../../../components/admin/MultiActionBar")
);

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
        sort_dir: "desc",
        sort_field: "account_number",
        search_account_number: "",
        mobile_number: "",
        name: "",
        status: "",
        totalPage: 1,
      },
      _openPopup: false,
      page_list: [],
      multiaction: [],
      allCheckedbox: false,
      loading: false,
    };

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin");
    }
  }

  /***************** *  Get Api data when component Render very First Time *********************/
  componentDidMount() {
    this.getKycRequestList();
  }

  getKycRequestList() {
    this.setState({ loading: true }); // Set loading to true before the request is made

    kycRequestService
      .getList(this.state.fields)
      .then((res) => {
        // Add a short delay before resolving the promise
        return new Promise((resolve) => setTimeout(() => resolve(res), 0));
      })
      .then((res) => {
        console.log("Res", res);
        this.setState({ loading: false }); // Set loading to false after the response is received

        if (!res.success) {
          notify.error(res.message);
        } else {
          const { totalRecords, totalPage, result } = res.data;

          const multiaction =
            result.length > 0
              ? result.reduce(
                (acc, page) => ({ ...acc, [page._id]: false }),
                {}
              )
              : {};

          this.setState({
            totalRecords,
            fields: {
              ...this.state.fields,
              totalPage,
            },
            page_list: result,
            multiaction,
          });
        }
      });
  }

  /************************* * Define Methods For sorting and page change**************************/
  pageChange = (newPage) => {
    newPage = newPage === 0 ? 1 : newPage;
    this.setState(
      {
        fields: {
          ...this.state.fields,
          pageNo: newPage,
        },
      },
      () => {
        this.getKycRequestList();
      }
    );
  };

  handleColumnSort(fieldName) {
    this.setState(
      {
        fields: {
          ...this.state.fields,
          sort_dir: ["desc"].includes(this.state.fields.sort_dir)
            ? "asc"
            : "desc",
          sort_field: fieldName,
        },
      },
      () => {
        this.getKycRequestList();
      }
    );
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ fields: { ...this.state.fields, [name]: value } });
  }

  handleFieldChange = (inputFieldId, inputFieldValue) => {
    this.setState({ [inputFieldId]: inputFieldValue });
  };

  handleSearch(type) {
    if (type === "reset") {
      this.setState(
        {
          fields: {
            pageNo: 1,
            sort_dir: "desc",
            sort_field: "account_number",
            search_account_number: "",
            mobile_number: "",
            name: "",
            status: "",
            totalPage: 1,
          }
        },
        () => {
          this.getKycRequestList(this.state.fields);
        }
      );
    } else {
      this.getKycRequestList(this.state.fields);
    }
  }

  openDeletePopup(id) {
    this.setState({ _openPopup: true, deleteId: id });
  }
  deleteUser() {
    this.setState({ _openPopup: false, deleteId: undefined });
    kycRequestService.deletepage(this.state.deleteId).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getKycRequestList();
      }
    });
  }

  PageStatusChangedHandler(page_id, status) {
    kycRequestService
      .changePageStatus(page_id, { status: !status })
      .then((res) => {
        if (res.status === "error") {
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
    this.setState({
      multiaction: multiactions,
      allCheckedbox: event.target.checked,
    });
  };

  handleCheckChieldElement = (event) => {
    let multiactions = this.state.multiaction;
    multiactions[event.target.value] = event.target.checked;
    this.setState({ multiaction: multiactions });
  };

  resetCheckedBox() {
    this.setState({ allCheckedbox: false });
  }

  bulkPageStatusChangeHandler(postData) {
    kycRequestService.changeBulkPageStatus(postData).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getKycRequestList();
      }
    });
  }

  handleApplyAction = (actionValue = "") => {
    if (actionValue !== "") {
      let appliedActionId = [];
      let selectedIds = this.state.multiaction;
      for (var key in selectedIds) {
        if (selectedIds[key]) {
          appliedActionId.push(key);
        }
      }

      this.resetCheckedBox();
      switch (actionValue) {
        case "delete":
          kycRequestService
            .deleteMultiplePages({ cms_ids: appliedActionId })
            .then((res) => {
              if (res.status === false) {
                notify.error(res.message);
              } else {
                notify.success(res.message);
                this.getKycRequestList();
              }
            });
          break;
        case "active": {
          this.bulkPageStatusChangeHandler({
            cms_ids: appliedActionId,
            status: true,
          });
          break;
        }
        case "deactive": {
          this.bulkPageStatusChangeHandler({
            cms_ids: appliedActionId,
            status: false,
          });
          break;
        }
        default:
          return "";
      }
    }
  };

  /****************** * Render Data To Dom ************************/

  render() {
    const current_user = _loginUsersDetails();
    return (
      <>
        <CRow>
          <CCol xl={12}>
            <CCard>
              <CCardBody>
                <CRow>
                  <CCol xl={3}>
                    <CFormGroup row>
                      <CCol xs="12">
                        <CLabel htmlFor="name">Account Number</CLabel>
                        <CInput
                          id="name"
                          placeholder="Search Account Number"
                          name="search_account_number"
                          value={this.state.fields.search_account_number}
                          onChange={this.handleChange}
                          onKeyPress={(e) => { if (e.key === "Enter") { this.handleSearch(); }}}
                        />
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol xl={3}>
                    <CFormGroup row>
                      <CCol xs="12">
                        <CLabel htmlFor="name">Mobile Number</CLabel>
                        <CInput
                          id="name"
                          placeholder="Search Mobile Number"
                          name="mobile_number"
                          value={this.state.fields.mobile_number}
                          onChange={this.handleChange}
                          onKeyPress={(e) => { if (e.key === "Enter") { this.handleSearch(); }}}
                        />
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol xl={3}>
                    <CFormGroup row>
                      <CCol xs="12">
                        <CLabel htmlFor="name">Name</CLabel>
                        <CInput
                          id="name"
                          placeholder="Search Name"
                          name="name"
                          value={this.state.fields.name}
                          onChange={this.handleChange}
                          onKeyPress={(e) => { if (e.key === "Enter") { this.handleSearch(); }}}
                        />
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol xl={3}>
                    <CFormGroup row>
                      <CCol xs="12">
                        <CLabel htmlFor="name">Status</CLabel>
                        <CSelect
                          id="name"
                          placeholder="Search Status"
                          name="status"
                          value={this.state.fields.status}
                          onChange={this.handleChange}
                        >
                          <option value="">-- Select Status --</option>
                          <option value="pending_approval">Pending Approval</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </CSelect>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xl={12}>
                    <CFormGroup row>
                      <CCol xs="1">
                        <button
                          className="btn btn-dark btn-md"
                          onClick={() => this.handleSearch()}
                        >
                          Search
                        </button>
                      </CCol>
                      <CCol xs="2">
                        <button
                          className="btn btn-dark btn-md"
                          onClick={() => this.handleSearch("reset")}
                        >
                          Clear
                        </button>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xl={12}>
                    <CFormGroup row>
                      <CCol xs="1"></CCol>
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
              <CCardHeader>KYC Requests</CCardHeader>
              <CCardBody>
                <div className="position-relative table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th
                          onClick={() =>
                            this.handleColumnSort("account_number")
                          }
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Account Number
                            </span>
                            {this.state.fields.sort_field !==
                              "account_number" && (
                                <FontAwesomeIcon icon={faSort} />
                              )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field ===
                              "account_number" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field ===
                              "account_number" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        {/* Mobile Number added in column (Changes made by Vivek Panchal) */}
                        <th
                          onClick={() => this.handleColumnSort("mobile_number")}
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Mobile Number
                            </span>
                            {this.state.fields.sort_field !==
                              "mobile_number" && (
                                <FontAwesomeIcon icon={faSort} />
                              )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field ===
                              "mobile_number" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field ===
                              "mobile_number" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th>Name</th>
                        <th onClick={() => this.handleColumnSort("status")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Status
                            </span>
                            {this.state.fields.sort_field !== "status" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field === "status" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field === "status" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        {(_canAccess("cms_pages", "update") ||
                          _canAccess("cms_pages", "delete")) && (
                            <>
                              <th>Action</th>
                            </>
                          )}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.page_list.length > 0 &&
                        this.state.page_list.map((u, index) => (
                          <tr key={u._id}>
                            <td>{index + 1}</td>
                            {/* <td>  {_canAccess('cms_pages', 'view') && <CLink to={`/admin/cms_pages/detailview/${u._id}`}>{u.title}</CLink>}</td> */}
                            <td>{u.account_number}</td>
                            <td>{u.mobile_number}</td>
                            <td>{u.name}</td>
                            <td>{capitalize(u.status.replaceAll("_", " "))}</td>
                            {_canAccess("cms_pages", "update") && (
                              <>
                                <td>
                                  {_canAccess("cms_pages", "update") && (
                                    <CTooltip
                                      content={globalConstants.Details_BTN}
                                    >
                                      <CLink
                                        className="btn  btn-md btn-primary"
                                        aria-current="page"
                                        to={`/admin/kyc_requests/detailview/${u._id}`}
                                      >
                                        <CIcon name="cil-list"></CIcon>{" "}
                                      </CLink>
                                    </CTooltip>
                                  )}
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      {this.state.page_list.length === 0 && (
                        <tr>
                          <td colSpan="5">No records found</td>
                        </tr>
                      )}
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
          onClose={() => {
            this.setState({ _openPopup: !this.state._openPopup });
          }}
          color="danger"
        >
          <CModalHeader closeButton>
            <CModalTitle>Delete Page</CModalTitle>
          </CModalHeader>
          <CModalBody>Are you sure you want to delete this record?</CModalBody>
          <CModalFooter>
            <CButton color="danger" onClick={() => this.deleteUser()}>
              Delete
            </CButton>
            <CButton
              color="secondary"
              onClick={() => {
                this.setState({ _openPopup: !this.state._openPopup });
              }}
            >
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
      </>
    );
  }
}

export default KycRequest_list;
