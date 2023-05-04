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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortDown,
  faSortUp,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { pageService } from "../../../../services/admin/page.service";
import {
  notify,
  history,
  _canAccess,
  _loginUsersDetails,
} from "../../../../_helpers/index";
import { globalConstants } from "../../../../constants/admin/global.constants";

class Page_list extends React.Component {
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
        direction: "desc",
        sort: "title",
        title: "",
        totalPage: 1,
      },
      _openPopup: false,
      page_list: [],
      multiAction: [],
      allCheckedBox: false,
    };

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/cms_pages");
    }
  }

  /***************** *  Get Api data when component Render very First Time *********************/

  componentDidMount() {
    this.getCmsPageList();
  }

  getCmsPageList() {
    pageService.getPageList(this.state.fields).then((res) => {
      if (res.success === false) {
        notify.error(res.message);
      } else {
        this.setState({
          totalRecords: res?.data?.totalRecords,
          fields: {
            ...this.state.fields,
            totalPage: res?.data?.totalPage,
          },
          page_list: res?.data?.result,
        });

        /*multi delete cms pages */
        if (res?.data?.result?.length > 0) {
          let pages = res?.data?.result;
          let multiAction = [];
          for (var key in pages) {
            multiAction[pages[key].id] = false;
          }
          this.setState({ multiAction: multiAction });
        } else if (res?.result?.length === 0) {
          this.setState({ multiAction: [] });
        }
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
        this.getCmsPageList();
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
        this.getCmsPageList();
      }
    );
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ fields: { ...this.state.fields, [name]: value } });
  }

  resetCheckedBox() {
    this.setState({ allCheckedBox: false });
  }

  handleSearch(type) {
    this.resetCheckedBox();
    if (type === "reset") {
      this.setState(
        {
          fields: {
            pageNo: 1,
            direction: "desc",
            sort: "title",
            title: "",
            totalPage: 1,
          },
        },
        () => {
          this.getCmsPageList();
        }
      );
    } else {
      this.getCmsPageList();
    }
  }

  openDeletePopup(id) {
    this.setState({ _openPopup: true, deleteId: id });
  }
  deleteUser() {
    this.setState({ _openPopup: false, deleteId: undefined });
    pageService.deletePage(this.state.deleteId).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getCmsPageList();
      }
    });
  }

  PageStatusChangedHandler(pageid, status) {
    let currentStatus;
    if (status === false) {
      currentStatus = 1;
    }
    if (status === true) {
      currentStatus = 0;
    }
    pageService
      .changePageStatus(pageid, { status: currentStatus })
      .then((res) => {
        if (res.status === "error") {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          this.getCmsPageList();
        }
      });
  }

  handleAllChecked = (event) => {
    let multiActions = this.state.multiAction;
    for (var key in multiActions) {
      multiActions[key] = event.target.checked;
    }
    this.setState({
      multiAction: multiActions,
      allCheckedBox: event.target.checked,
    });
  };

  handleCheckFieldElement = (event) => {
    let multiActions = this.state.multiAction;
    multiActions[event.target.value] = event.target.checked;
    this.setState({ multiAction: multiActions });
  };

  resetCheckedBox = () => {
    this.setState({ allCheckedBox: false });
  };

  bulkPageStatusChangeHandler(postData) {
    pageService.changeBulkPageStatus(postData).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getCmsPageList();
      }
    });
  }

  handleApplyAction = (actionValue = "") => {
    if (actionValue !== "") {
      let appliedActionId = [];
      let selectedIds = this.state.multiAction;
      for (var key in selectedIds) {
        if (selectedIds[key]) {
          appliedActionId.push(key);
        }
      }

      this.resetCheckedBox();
      switch (actionValue) {
        case "delete":
          pageService
            .deleteMultiplePages({ cmsids: appliedActionId })
            .then((res) => {
              if (res.status === false) {
                notify.error(res.message);
              } else {
                notify.success(res.message);
                this.getCmsPageList();
              }
            });
          break;
        case "active": {
          this.bulkPageStatusChangeHandler({
            cmsids: appliedActionId,
            status: true,
          });
          break;
        }
        case "deactive": {
          this.bulkPageStatusChangeHandler({
            cmsids: appliedActionId,
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
                          id="name"
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
              <CCardHeader>
                <strong>Pages</strong>
                <div className="card-header-actions">
                  {_canAccess("cms_pages", "create") && (
                    <CTooltip content={globalConstants.ADD_BTN}>
                      <CLink
                        className="btn btn-dark btn-block"
                        aria-current="page"
                        to="/admin/cms_pages/add"
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
                    checkBoxData={this.state.multiAction}
                    module_name={"cms_pages"}
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
                            checked={this.state.allCheckedBox}
                          />
                        </th> */}
                        <th>#</th>
                        <th
                          onClick={() =>
                            this.handleColumnSort("title")
                          }
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">Title</span>
                            {this.state.fields.sort !==
                              "title" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort ===
                                "title" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort ===
                                "title" && (
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
                        {(_canAccess("cms_pages", "update") ||
                          _canAccess("cms_pages", "delete")) && (
                          <>
                            <th style={{ width: "20%" }}>Action</th>
                          </>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {this.state?.page_list?.length > 0 &&
                        this.state.page_list.map((u, index) => (
                          <tr key={u.id}>
                            {/* <td>
                              <CheckBoxes
                                handleCheckChieldElement={
                                  this.handleCheckFieldElement
                                }
                                _id={u.id}
                                _isChecked={this.state.multiAction[u.id]}
                              />
                            </td> */}

                            <td>{index + 1}</td>
                            <td>
                              {" "}
                              {_canAccess("cms_pages", "view") && (
                                <CLink
                                  to={`/admin/cms_pages/detailview/${u.id}`}
                                >
                                  {u.title}
                                </CLink>
                              )}
                            </td>
                            <td>
                              {
                                /*current_user.id !== u.id &&*/
                                _canAccess("cms_pages", "update") && (
                                  <CLink
                                    onClick={() =>
                                      this.PageStatusChangedHandler(
                                        u.id,
                                        u.status
                                      )
                                    }
                                  >
                                    {u.status ? "Active" : "Deactive"}
                                  </CLink>
                                )
                              }
                              {
                                /*current_user.id !== u.id && */
                                _canAccess("cms_pages", "update") === false && (
                                  <>{u.status ? "Active" : "Deactive"}</>
                                )
                              }
                            </td>
                            {(_canAccess("cms_pages", "update") ||
                              _canAccess("cms_pages", "delete")) && (
                              <>
                                <td>
                                  {_canAccess("cms_pages", "update") && (
                                    <CTooltip
                                      content={globalConstants.EDIT_BTN}
                                    >
                                      <CLink
                                        className="btn  btn-md btn-primary"
                                        aria-current="page"
                                        to={`/admin/cms_pages/edit/${u.id}`}
                                      >
                                        <CIcon name="cil-pencil"></CIcon>{" "}
                                      </CLink>
                                    </CTooltip>
                                  )}
                                  &nbsp;
                                  {_canAccess("cms_pages", "delete") && (
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
                        ))}
                      {this.state?.page_list?.length === 0 && (
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

export default Page_list;
