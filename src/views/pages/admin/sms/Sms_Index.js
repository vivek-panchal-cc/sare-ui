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
import { customerService } from "../../../../services/admin/customer.service";
import { smsService } from "../../../../services/admin/sms.service";
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
import MessagePopup from "./MyComponent";
import { globalConstants } from "../../../../constants/admin/global.constants";

class Sms_Index extends React.Component {
  constructor(props) {
    super(props);

    this.handleColumnSort = this.handleColumnSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openDeletePopup = this.openDeletePopup.bind(this);
    this.deleteSmsTemplate = this.deleteSmsTemplate.bind(this);

    this.state = {
      fields: {
        pageNo: 1,
        direction: "desc",
        sort: "id",
        title: "",
        slug: "",
        message: "",
        status: "",
        totalPage: 1,
      },
      sms_list: [],
      _openPopup: false,
      multiaction: [],
      allCheckedbox: false,
    };

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/sms");
    }
  }

  componentDidMount() {
    this.getSmsTemplates();
  }

  getSmsTemplates() {
    smsService.getSmsTemplates(this.state.fields).then((res) => {
      if (res.success === false) {
        notify.error(res.message);
      } else {
        this.setState({
          totalRecords: res.data.totalRecords,
          fields: {
            ...this.state.fields,
            totalPage: res.data.totalPage,
          },
          sms_list: res.data.result,
        });

        /* Multi delete checkbox code */
        if (res?.data?.result?.length > 0) {
          let users = res.data.result;
          let multiaction = [];
          const current_user = _loginUsersDetails();
          for (var key in users) {
            if (
              globalConstants.DEVELOPER_PERMISSION_USER_ID.indexOf(
                users[key].id
              ) > -1
            ) {
              continue;
            }
            if (current_user.user_group_id === users[key].id) {
              continue;
            }
            multiaction[users[key].id] = false;
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
        this.getSmsTemplates();
      }
    );
  };

  handleColumnSort(fieldName) {
    this.setState(
      {
        fields: {
          //   ...this.state.fields,
          direction: ["desc"].includes(this.state.fields.direction)
            ? "asc"
            : "desc",
          sort: fieldName,
        },
      },
      () => {
        this.getSmsTemplates();
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
            sort: "id",
            title: "",
            slug: "",
            message: "",
            status: "",
            totalPage: 1,
          },
        },
        () => {
          this.getSmsTemplates(this.state.fields);
        }
      );
    } else {
      this.getSmsTemplates(this.state.fields);
    }
  }

  openDeletePopup(id) {
    this.setState({ _openPopup: true, deleteId: id });
  }

  deleteSmsTemplate() {
    this.setState({ _openPopup: false, deleteId: undefined });
    smsService.deleteSmsTemplate(this.state.deleteId).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getSmsTemplates();
      }
    });
  }

  // To change the status of sms
  smsStatusChangeHandler(user_id, status) {
    let currentStatus;
    if (status === "0") {
      currentStatus = "1";
    }
    if (status === "1") {
      currentStatus = "0";
    }
    smsService
      .changeSmsStatus(user_id, { status: currentStatus })
      .then((res) => {
        if (res.status === "error") {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          this.getSmsTemplates();
        }
      });
  }

  truncateMessage = (message) => {
    const words = message.split(" ");
    if (words.length > 5) {
      return words.slice(0, 5).join(" ") + "...";
    } else {
      return message;
    }
  };

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

  handleCheckFieldElement = (event) => {
    let multiactions = this.state.multiaction;
    multiactions[event.target.value] = event.target.checked;
    this.setState({ multiaction: multiactions });
  };

  resetCheckedBox() {
    this.setState({ allCheckedbox: false });
  }

  //   bulkCustomersStatusChangeHandler(postData) {
  //     customerService.changeBulkCustomersStatus(postData).then((res) => {
  //       if (res.status === "error") {
  //         notify.error(res.message);
  //       } else {
  //         notify.success(res.message);
  //         this.getSmsTemplates(this.state.fields);
  //       }
  //     });
  //   }

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
          customerService
            .deleteMultipleCustomers({ user_ids: appliedActionId })
            .then((res) => {
              if (res.status === false) {
                notify.error(res.message);
              } else {
                notify.success(res.message);
                this.getSmsTemplates(this.state.fields);
              }
            });
          break;
        }
        case "active": {
          this.bulkCustomersStatusChangeHandler({
            user_ids: appliedActionId,
            status: true,
          });
          break;
        }
        case "deactive": {
          this.bulkCustomersStatusChangeHandler({
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
                        <CLabel htmlFor="name">Title</CLabel>
                        <CInput
                          id="title"
                          placeholder="Search Title"
                          name="title"
                          value={this.state.fields.title}
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
                        <CLabel htmlFor="name">Slug</CLabel>
                        <CInput
                          id="name"
                          placeholder="Search Slug"
                          name="slug"
                          value={this.state.fields.slug}
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
                <strong>SMS Templates</strong>
                <div className="card-header-actions">
                  {_canAccess("sms_templates", "create") && (
                    <CTooltip content={globalConstants.ADD_BTN}>
                      <CLink
                        className="btn btn-dark btn-block"
                        aria-current="page"
                        to="/admin/sms/add"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </CLink>
                    </CTooltip>
                  )}
                </div>
              </CCardHeader>
              <CCardBody>
                <div className="position-relative table-responsive">
                  {/* <MultiActionBar
                    onClick={this.handleApplyAction}
                    checkBoxData={this.state.multiaction}
                    module_name={"sms_templates"}
                  /> */}
                  <table className="table">
                    <thead>
                      <tr>
                        {/* <th>
                          <input
                            type="checkbox"
                            onClick={this.handleAllChecked}
                            value="checkedall"
                            onChange={() => {}}
                            checked={this.state.allCheckedbox}
                          />
                        </th> */}
                        <th>#</th>
                        <th onClick={() => this.handleColumnSort("title")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">Title</span>
                            {this.state.fields.sort !== "title" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "title" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "title" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th onClick={() => this.handleColumnSort("slug")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">Slug</span>
                            {this.state.fields.sort !== "slug" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "slug" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "slug" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th onClick={() => this.handleColumnSort("message")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Message
                            </span>
                            {this.state.fields.sort !== "message" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "message" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "message" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

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
                        {(_canAccess("sms_templates", "update") ||
                          _canAccess("sms_templates", "delete")) && (
                          <>
                            <th>Action</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state?.sms_list?.length > 0 ? (
                        this.state.sms_list.map((u, index) => (
                          <tr key={u.id}>
                            {/* <td>
                              {" "}
                              {current_user.id !==
                                u.id && (
                                <CheckBoxes
                                  handleCheckFieldElement={
                                    this.handleCheckFieldElement
                                  }
                                  _id={u.id}
                                  _isChecked={
                                    this.state.multiaction[
                                      u.id
                                    ]
                                  }
                                />
                              )}{" "}
                            </td> */}
                            <td>{index + 1}</td>
                            <td>{u.title}</td>
                            <td>{u.slug}</td>
                            <td>
                              <MessagePopup message={u.message} />
                            </td>
                            <td>
                              {_canAccess("sms_templates", "update") && (
                                <CLink
                                  onClick={() =>
                                    this.smsStatusChangeHandler(u.id, u.status)
                                  }
                                >
                                  {u.status === "1" ? "Active" : "Deactive"}
                                </CLink>
                              )}
                              {_canAccess("sms_templates", "update") ===
                                false && (
                                <>{u.status === "1" ? "Active" : "Deactive"}</>
                              )}
                            </td>

                            {(_canAccess("sms_templates", "update") ||
                              _canAccess("sms_templates", "delete")) && (
                              <>
                                <td>
                                  {_canAccess("sms_templates", "update") && (
                                    <CTooltip
                                      content={globalConstants.EDIT_BTN}
                                    >
                                      <CLink
                                        className="btn  btn-md btn-primary"
                                        aria-current="page"
                                        to={`/admin/sms/edit/${u.id}`}
                                      >
                                        <CIcon name="cil-pencil"></CIcon>{" "}
                                      </CLink>
                                    </CTooltip>
                                  )}
                                  &nbsp;
                                  {_canAccess("sms_templates", "delete") && (
                                    <CTooltip
                                      content={globalConstants.DELETE_BTN}
                                    >
                                      <button
                                        className="btn  btn-md btn-danger "
                                        onClick={() =>
                                          this.openDeletePopup(u.id)
                                        }
                                      >
                                        <CIcon name="cil-trash"></CIcon>
                                      </button>
                                    </CTooltip>
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
                  {this.state?.sms_list?.length > 0 ? (
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
            <CButton color="danger" onClick={() => this.deleteSmsTemplate()}>
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

export default Sms_Index;
