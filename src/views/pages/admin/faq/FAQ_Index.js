import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CPagination,
  CLink,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
  CTooltip,
  CFormGroup,
  CLabel,
  CInput,
  CSelect,
} from "@coreui/react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import CIcon from "@coreui/icons-react";
import { faqService } from "../../../../services/admin/faq.service";
import {
  notify,
  _canAccess,
  history,
  _loginUsersDetails,
} from "../../../../_helpers/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { globalConstants } from "../../../../constants/admin/global.constants";

class FAQ_Index extends React.Component {
  constructor(props) {
    super(props);

    // this.handleColumnSort = this.handleColumnSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openDeletePopup = this.openDeletePopup.bind(this);
    this.deleteFaq = this.deleteFaq.bind(this);

    this.state = {
      fields: {
        pageNo: 1,
        sort_dir: "desc",
        sort_field: "name",
        question: "",
        answer: "",
        status: "",
        totalPage: 1,
      },
      faq_list: [],
      _openPopup: false,
      multiActions: [],
      allCheckedbox: false,
    };

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/faq");
    }
  }

  componentDidMount() {
    this.getFaqDetails();
  }

  async getFaqDetails() {
    faqService.getFaq(this.state.fields).then((res) => {
      if (res.success === false) {
        notify.error(res.message);
      } else {
        this.setState({
          totalRecords: res.data.totalRecords,
          fields: {
            ...this.state.fields,
            totalPage: res.data.totalPage,
          },
          faq_list: res.data.result,
        });

        /* Multi delete checkbox code */
        if (res?.data?.result?.length > 0) {
          let users = res.data.result;
          let multiAction = [];
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
            multiAction[users[key].id] = false;
          }

          this.setState({ multiAction: multiAction });
        } else if (res?.data?.result?.length === 0) {
          this.setState({ multiAction: [] });
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
        this.getFaqDetails();
      }
    );
  };

  // handleColumnSort(fieldName) {
  //   this.setState(
  //     {
  //       fields: {
  //         //   ...this.state.fields,
  //         sort_dir: ["desc"].includes(this.state.fields.sort_dir)
  //           ? "asc"
  //           : "desc",
  //         sort_field: fieldName,
  //       },
  //     },
  //     () => {
  //       this.getFaqDetails();
  //     }
  //   );
  // }

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
            sort_dir: "desc",
            sort_field: "name",
            question: "",
            answer: "",            
            status: "",
            totalPage: 1,
          },
        },
        () => {
          this.getFaqDetails(this.state.fields);
        }
      );
    } else {
      this.getFaqDetails(this.state.fields);
    }
  }

  openDeletePopup(id) {
    this.setState({ _openPopup: true, deleteId: id });
  }

  deleteFaq() {
    this.setState({ _openPopup: false, deleteId: undefined });
    faqService.deleteFaq(this.state.deleteId).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getFaqDetails();
      }
    });
  }

  faqStatusChangeHandler(user_id, status) {
    let currentStatus;
    if (status === 0) {
      currentStatus = 1;
    }
    if (status === 1) {
      currentStatus = 0;
    }
    faqService
      .changeFaqStatus(user_id, { status: currentStatus })
      .then((res) => {
        if (res.status === "error") {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          this.getFaqDetails();
        }
      });
  }

  handleFieldChange = (inputFieldId, inputFieldValue) => {
    this.setState({ [inputFieldId]: inputFieldValue });
  };

  handleAllChecked = (event) => {
    let multiActionss = this.state.multiActions;
    console.log(multiActionss);
    for (var key in multiActionss) {
      multiActionss[key] = event.target.checked;
    }
    this.setState({
      multiActions: multiActionss,
      allCheckedbox: event.target.checked,
    });
  };

  handleCheckFieldElement = (event) => {
    let multiActionss = this.state.multiActions;
    multiActionss[event.target.value] = event.target.checked;
    this.setState({ multiActions: multiActionss });
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
  //         this.getFaqDetails(this.state.fields);
  //       }
  //     });
  //   }

  // handleApplyAction = (actionValue = "") => {
  //   if (actionValue !== "") {
  //     let appliedActionId = [];
  //     let selectedIds = this.state.multiActions;
  //     for (var key in selectedIds) {
  //       if (selectedIds[key]) {
  //         appliedActionId.push(key);
  //       }
  //     }

  //     this.resetCheckedBox();
  //     switch (actionValue) {
  //       case "delete": {
  //         customerService
  //           .deleteMultipleCustomers({ user_ids: appliedActionId })
  //           .then((res) => {
  //             if (res.status === false) {
  //               notify.error(res.message);
  //             } else {
  //               notify.success(res.message);
  //               this.getFaqDetails(this.state.fields);
  //             }
  //           });
  //         break;
  //       }
  //       case "active": {
  //         this.bulkCustomersStatusChangeHandler({
  //           user_ids: appliedActionId,
  //           status: true,
  //         });
  //         break;
  //       }
  //       case "deactive": {
  //         this.bulkCustomersStatusChangeHandler({
  //           user_ids: appliedActionId,
  //           status: false,
  //         });
  //         break;
  //       }
  //       default:
  //         return "";
  //     }
  //   }
  // };

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
                        <CLabel htmlFor="name">Question</CLabel>
                        <CInput
                          id="question"
                          placeholder="Search Question"
                          name="question"
                          value={this.state.fields.question}
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
                  {/* <CCol xl={3}>
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
                  </CCol> */}
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
                <strong>FAQ</strong>
                <div className="card-header-actions">
                  {_canAccess("faqs", "create") && (
                    <CTooltip content={globalConstants.ADD_BTN}>
                      <CLink
                        className="btn btn-dark btn-block"
                        aria-current="page"
                        to="/admin/faq/add"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </CLink>
                    </CTooltip>
                  )}
                </div>
              </CCardHeader>
              <CCardBody>
                <div className="position-relative table-responsive">
                  {/* <multiActionsBar
                    onClick={this.handleApplyAction}
                    checkBoxData={this.state.multiActions}
                    module_name={"faqs"}
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
                        <th>Question</th>
                        <th>Answer</th>
                        {/* <th onClick={() => this.handleColumnSort("title")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">Title</span>
                            {this.state.sort_field !== "title" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.sort_dir === "asc" &&
                              this.state.sort_field === "title" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.sort_dir === "desc" &&
                              this.state.sort_field === "title" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th onClick={() => this.handleColumnSort("slug")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">Slug</span>
                            {this.state.sort_field !== "slug" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.sort_dir === "asc" &&
                              this.state.sort_field === "slug" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.sort_dir === "desc" &&
                              this.state.sort_field === "slug" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th onClick={() => this.handleColumnSort("message")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Message
                            </span>
                            {this.state.sort_field !== "message" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.sort_dir === "asc" &&
                              this.state.sort_field === "message" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.sort_dir === "desc" &&
                              this.state.sort_field === "message" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>*/}

                        {/* <th onClick={() => this.handleColumnSort("status")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Status
                            </span>
                            {this.state.sort_field !== "status" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.sort_dir === "asc" &&
                              this.state.sort_field === "status" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.sort_dir === "desc" &&
                              this.state.sort_field === "status" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>  */}
                        <th>Status</th>
                        {(_canAccess("faqs", "update") ||
                          _canAccess("faqs", "delete")) && (
                          <>
                            <th>Action</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state?.faq_list?.length > 0 &&
                        this.state.faq_list.map((u, index) => (
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
                                    this.state.multiActions[
                                      u.id
                                    ]
                                  }
                                />
                              )}{" "}
                            </td> */}
                            <td>{index + 1}</td>
                            <td>{u.question}</td>
                            <td>{u.answer}</td>
                            {/* <td>{u.title}</td>
                            <td>{u.slug}</td>
                            <td>{u.message}</td>*/}
                            <td>
                              {current_user.id !== u.id &&
                                _canAccess("faqs", "update") && (
                                  <CLink
                                    onClick={() =>
                                      this.faqStatusChangeHandler(
                                        u.id,
                                        u.status
                                      )
                                    }
                                  >
                                    {u.status === 1 ? "Active" : "Deactive"}
                                  </CLink>
                                )}
                              {current_user.id !== u.id &&
                                _canAccess("faqs", "update") === false && (
                                  <>{u.status === 1 ? "Active" : "Deactive"}</>
                                )}
                            </td>

                            {(_canAccess("faqs", "update") ||
                              _canAccess("faqs", "delete")) && (
                              <>
                                <td>
                                  {current_user.id !== u.id && (
                                    <>
                                      {_canAccess("faqs", "update") && (
                                        <CTooltip
                                          content={globalConstants.EDIT_BTN}
                                        >
                                          <CLink
                                            className="btn  btn-md btn-primary"
                                            aria-current="page"
                                            to={`/admin/faq/edit/${u.id}`}
                                          >
                                            <CIcon name="cil-pencil"></CIcon>{" "}
                                          </CLink>
                                        </CTooltip>
                                      )}
                                      &nbsp;
                                      {_canAccess("faqs", "delete") && (
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
                                    </>
                                  )}
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      {this.state?.faq_list?.length?.length === 0 && (
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
            <CModalTitle>Delete User</CModalTitle>
          </CModalHeader>
          <CModalBody>Are you sure you want to delete this record?</CModalBody>
          <CModalFooter>
            <CButton color="danger" onClick={() => this.deleteFaq()}>
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

export default FAQ_Index;
