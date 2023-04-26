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
import { connect } from "react-redux";
import CIcon from "@coreui/icons-react";
import { getUsersList, getAgentsList } from "../../../../actions/admin";
import { customerService } from "../../../../services/admin/customer.service";
import { agentService } from "../../../../services/admin/agent.service";
import {
  notify,
  _canAccess,
  history,
  _loginUsersDetails,
} from "../../../../_helpers/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortDown,
  faSortUp,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { globalConstants } from "../../../../constants/admin/global.constants";
class Agent_Index extends React.Component {
  constructor(props) {
    super(props);

    this.handleColumnSort = this.handleColumnSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openDeletePopup = this.openDeletePopup.bind(this);
    this.deleteAgent = this.deleteAgent.bind(this);

    this.state = {
      fields: {
        pageNo: 1,
        direction: "desc",
        sort: "account_number",
        name: "",
        mobile_number: "",
        customer_type: "",
        status: "",
        totalPage: 1,
      },
      //   user_group_id: "",
      user_list: [],
      _openPopup: false,
      multiaction: [],
      allCheckedbox: false,
    };

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/agents");
    }
  }

  componentDidMount() {
    this.getAgentsList();
  }

  getAgentsList() {
    agentService.getAgentsList(this.state.fields).then((res) => {
      if (res.success === false) {
        this.setState({
          totalRecords: res.data.totalRecords,
          fields: {
            ...this.state.fields,
          },
          user_list: res.data.result,
        });
        notify.error(res.message);
      } else {
        this.setState({
          totalRecords: res.data.totalRecords,
          fields: {
            ...this.state.fields,
            totalPage: res?.data?.totalPage,
          },
          user_list: res.data.result,
        });

        /* Multi delete checkbox code */
        if (res?.data?.result?.length > 0) {
          let users = res.data.result;
          let multiaction = [];
          const current_user = _loginUsersDetails();
          for (var key in users) {
            if (
              globalConstants.DEVELOPER_PERMISSION_USER_ID.indexOf(
                users[key].account_number
              ) > -1
            ) {
              continue;
            }
            if (
              current_user.user_group_id ===
              users[key].account_number
            ) {
              continue;
            }
            multiaction[
              users[key].account_number
            ] = false;
          }

          this.setState({ multiaction: multiaction });
        } else if (res?.data?.result?.length === 0) {
          this.setState({ multiaction: [] });
        }
      }
    });
  }

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
        this.getAgentsList();
      }
    );
  };

  handleColumnSort(fieldName) {
    this.setState(
      {
        fields: {
          ...this.state.fields,
          direction: ["desc"].includes(this.state.fields.direction)
            ? "asc"
            : "desc",
          sort: fieldName,
        },
      },
      () => {
        this.getAgentsList();
      }
    );
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ fields: { ...this.state.fields, [name]: value } });
  }

  handleSearch(type) {
    this.resetCheckedBox();
    if (type === "reset") {
      this.setState(
        {
          fields: {
            pageNo: 1,
            direction: "desc",
            sort: "account_number",
            name: "",
            mobile_number: "",
            customer_type: "",
            status: "",
            totalPage: 1,
          },
        },
        () => {
          this.getAgentsList(this.state.fields);
        }
      );
    } else {
      this.getAgentsList(this.state.fields);
    }
  }

  openDeletePopup(id) {
    this.setState({ _openPopup: true, deleteId: id });
  }

  deleteAgent() {
    this.setState({ _openPopup: false, deleteId: undefined });
    agentService.deleteAgent(this.state.deleteId).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getAgentsList();
      }
    });
  }

  handleFieldChange = (inputFieldId, inputFieldValue) => {
    this.setState({ [inputFieldId]: inputFieldValue });
  };

  handleAllChecked = (event) => {
    let multiactions = this.state.multiaction;
    console.log(multiactions);
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

  bulkAgentsStatusChangeHandler(postData) {
    agentService.changeBulkAgentsStatus(postData).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.props.getAgentsList(this.state);
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
        case "delete": {
          agentService
            .deleteMultipleAgents({ user_ids: appliedActionId })
            .then((res) => {
              if (res.status === false) {
                notify.error(res.message);
              } else {
                notify.success(res.message);
                this.props.getAgentsList(this.state);
              }
            });
          break;
        }
        case "active": {
          this.bulkAgentsStatusChangeHandler({
            user_ids: appliedActionId,
            status: true,
          });
          break;
        }
        case "deactive": {
          this.bulkAgentsStatusChangeHandler({
            user_ids: appliedActionId,
            status: false,
          });
          break;
        }
        default:
          return "";
      }
    }
  };

  agentStatusChangedHandler(user_id, status) {
    let currentStatus;
    if (status === "0") {
      currentStatus = "1";
    }
    if (status === "1") {
      currentStatus = "0";
    }
    agentService
      .changeAgentStatus(user_id, { status: currentStatus })
      .then((res) => {
        if (res.status === "error") {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          this.getAgentsList();
        }
      });
  }

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
                        <CLabel htmlFor="name">Name</CLabel>
                        <CInput
                          id="name"
                          placeholder="Search Name"
                          name="name"
                          value={this.state.fields.name}
                          onChange={this.handleChange}
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              this.handleSearch("search");
                            }
                          }}
                        />
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol xl={3}>
                    <CFormGroup row>
                      <CCol xs="12">
                        <CLabel htmlFor="name">Mobile</CLabel>
                        <CInput
                          id="name"
                          placeholder="Search Mobile Number"
                          name="mobile_number"
                          value={this.state.fields.mobile_number}
                          onChange={this.handleChange}
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              this.handleSearch("search");
                            }
                          }}
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
                          style={{ cursor: "pointer" }}
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              this.handleSearch("search");
                            }
                          }}
                        >
                          <option value="">-- Select Status --</option>
                          <option value="1">Active</option>
                          <option value="0">Deactive</option>
                        </CSelect>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol xl={6}>
                    <CFormGroup row>
                      <CCol xs="12"></CCol>
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xl={12}>
                    <CFormGroup row>
                      <CCol xs="1">
                        <button
                          className="btn btn-dark btn-md"
                          onClick={() => this.handleSearch("search")}
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
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CRow>
          <CCol xl={12}>
            <CCard>
              <CCardHeader>
                <strong>Agents Management</strong>
              </CCardHeader>
              <CCardBody>
                <div className="position-relative table-responsive">
                  {/* <MultiActionBar
                    onClick={this.handleApplyAction}
                    checkBoxData={this.state.multiaction}
                    module_name={"users"}
                  /> */}
                  <table className="table">
                    <thead>
                      <tr>
                        {/* <th>
                          <input
                            type="checkbox"
                            onClick={this.handleAllChecked}
                            value="checkedall"
                            onChange={(e) => {}}
                            checked={this.state.allCheckedbox}
                          />
                        </th> */}
                        <th>#</th>
                        <th>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Account Number
                            </span>
                          </span>
                        </th>
                        <th onClick={() => this.handleColumnSort("name")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">Name</span>
                            {this.state.fields.sort !== "name" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "name" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "name" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th
                          onClick={() => this.handleColumnSort("mobile_number")}
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Mobile
                            </span>
                            {this.state.fields.sort !== "mobile_number" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "mobile_number" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "mobile_number" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th
                          onClick={() => this.handleColumnSort("customer_type")}
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Customer Type
                            </span>
                            {this.state.fields.sort !== "customer_type" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "customer_type" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "customer_type" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        {/* <th>User Groups</th> */}
                        <th onClick={() => this.handleColumnSort("status")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Status
                            </span>
                            {this.state.fields.sort !== "status" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "status" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "status" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        {(_canAccess("users", "update") ||
                          _canAccess("users", "delete")) && (
                          <>
                            <th>Action</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state?.user_list?.length > 0 ? (
                        this.state.user_list.map((u, index) => (
                          <tr key={u.account_number}>
                            {/* <td>
                              {" "}
                              {current_user.id !==
                                u.account_number && (
                                <CheckBoxes
                                  handleCheckChieldElement={
                                    this.handleCheckChieldElement
                                  }
                                  _id={u.account_number}
                                  _isChecked={
                                    this.state.multiaction[
                                      u.account_number
                                    ]
                                  }
                                />
                              )}{" "}
                            </td> */}
                            <td>{index + 1}</td>
                            {/* <td>{u.account_number}</td> */}
                            <td>
                              <a
                                href={`/admin/agents/detailView/${u.account_number}`}
                              >
                                {u.account_number}
                              </a>
                            </td>
                            <td style={u.name ? {} : { textAlign: 'left' }}>{u.name ? u.name : '-'}</td>
                            <td>{u.mobile_number}</td>
                            <td>
                              {u.customer_type.charAt(0).toUpperCase() +
                                u.customer_type.slice(1)}
                            </td>
                            {/* <td>{u.status === "1" ? "Active" : "In-Active"}</td> */}
                            <td>
                              {current_user.id !==
                                u.account_number &&
                                _canAccess("agents", "update") && (
                                  <CLink
                                    onClick={() =>
                                      this.agentStatusChangedHandler(
                                        u.account_number,
                                        u.status
                                      )
                                    }
                                  >
                                    {u.status === "1" ? "Active" : "Deactive"}
                                  </CLink>
                                )}
                              {current_user.id !==
                                u.account_number &&
                                _canAccess("agents", "update") === false && (
                                  <>
                                    {u.status === "1" ? "Active" : "Deactive"}
                                  </>
                                )}
                            </td>
                            {(_canAccess("agents", "update") ||
                              _canAccess("agents", "delete")) && (
                              <>
                                <td>
                                  {current_user.id !==
                                    u.account_number && (
                                    <>
                                      {_canAccess("agents", "update") && (
                                        <CTooltip
                                          content={globalConstants.EDIT_BTN}
                                        >
                                          <CLink
                                            className="btn  btn-md btn-primary"
                                            aria-current="page"
                                            to={`/admin/agents/edit/${u.account_number}`}
                                          >
                                            <CIcon name="cil-pencil"></CIcon>{" "}
                                          </CLink>
                                        </CTooltip>
                                      )}
                                      &nbsp;
                                      {_canAccess("agents", "delete") && (
                                        <CTooltip
                                          content={globalConstants.DELETE_BTN}
                                        >
                                          <button
                                            className="btn  btn-md btn-danger "
                                            onClick={() =>
                                              this.openDeletePopup(
                                                u.account_number
                                              )
                                            }
                                          >
                                            <CIcon name="cil-trash"></CIcon>
                                          </button>
                                        </CTooltip>
                                      )}
                                    </>
                                  )}
                                </td>
                              </>
                            )}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5">No records found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {this.state?.user_list?.length > 0 ? (
                    <CPagination
                      activePage={this.state.fields.pageNo}
                      onActivePageChange={this.pageChange}
                      pages={this.state.fields.totalPage}
                      doubleArrows={true}
                      align="end"
                    />
                  ) : null}
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
            <CModalTitle>Delete User</CModalTitle>
          </CModalHeader>
          <CModalBody>Are you sure you want to delete this record?</CModalBody>
          <CModalFooter>
            <CButton color="danger" onClick={() => this.deleteAgent()}>
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

export default Agent_Index;
