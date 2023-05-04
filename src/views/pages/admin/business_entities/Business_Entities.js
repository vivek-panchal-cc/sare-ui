/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { createRef } from "react";
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
  CFormText,
  CSwitch,
  CCardFooter,
} from "@coreui/react";
import {
  faSort,
  faSortDown,
  faSortUp,
  faBan,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import CIcon from "@coreui/icons-react";
import { businessEntitiesService } from "../../../../services/admin/business_entities.service";
import {
  notify,
  _canAccess,
  history,
  _loginUsersDetails,
} from "../../../../_helpers/index";
import SimpleReactValidator from "simple-react-validator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { globalConstants } from "../../../../constants/admin/global.constants";

class BusinessEntitiesIndex extends React.Component {
  constructor(props) {
    super(props);
    this.addEntityRef = createRef();
    this.editBusinessEntity = this.editBusinessEntity.bind(this);
    this.handleColumnSort = this.handleColumnSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.openDeletePopup = this.openDeletePopup.bind(this);
    this.deleteBusinessEntity = this.deleteBusinessEntity.bind(this);
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      fields: {
        pageNo: 1,
        direction: "desc",
        sort: "entity",
        entity: "",
        status: "",
        totalPage: 1,
      },
      id: 0,
      entity: "",
      icon: null,
      updateStatus: "1",
      toggleStatus: true,
      business_entity_list: [],
      _openPopup: false,
      multiActions: [],
      allCheckedbox: false,
    };

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/business_entities");
    }
  }

  componentDidMount() {
    this.getBusinessEntities();
  }

  getBusinessEntities() {
    businessEntitiesService
      .getBusinessEntitiesList(this.state.fields)
      .then((res) => {
        if (res.success === false) {
          notify.error(res.message);
        } else {
          this.setState({
            totalRecords: res?.data?.totalRecords,
            fields: {
              ...this.state.fields,
              totalPage: res?.data?.totalPage,
            },
            business_entity_list: res?.data?.result,
          });

          /* Multi delete checkbox code */
          if (res?.data?.result?.length > 0) {
            let users = res?.data?.result;
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
        this.getBusinessEntities();
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
        this.getBusinessEntities();
      }
    );
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ fields: { ...this.state.fields, [name]: value } });
  }

  handleInputChange(e) {
    const { name, value, checked } = e.target;
    if (name === "updateStatus") {
      let value = checked ? "1" : "0";
      this.setState({ ...this.state, [name]: value });
    } else {
      this.setState({ ...this.state, [name]: value });
    }
  }

  handleSearch(type) {
    if (type === "reset") {
      this.setState(
        {
          fields: {
            pageNo: 1,
            direction: "desc",
            sort: "entity",
            entity: "",
            status: "",
            totalPage: 1,
          },
        },
        () => {
          this.getBusinessEntities(this.state.fields);
        }
      );
    } else {
      this.getBusinessEntities(this.state.fields);
    }
  }

  openDeletePopup(id) {
    this.setState({ _openPopup: true, deleteId: id });
  }

  deleteBusinessEntity() {
    this.setState({ _openPopup: false, deleteId: undefined });
    businessEntitiesService
      .deleteBusinessEntity(this.state.deleteId)
      .then((res) => {
        if (res.status === "error") {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          this.getBusinessEntities();
        }
      });
  }

  businessEntityStatusChangeHandler(user_id, status) {
    let currentStatus;
    if (status === "0") {
      currentStatus = "1";
    }
    if (status === "1") {
      currentStatus = "0";
    }
    businessEntitiesService
      .changeBusinessEntityStatus(user_id, { status: currentStatus })
      .then((res) => {
        if (res.status === "error") {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          this.getBusinessEntities();
        }
      });
  }

  handleSubmit() {
    if (this.validator.allValid() && this.state.id === 0) {
      const formData = new FormData();
      formData.append("entity", this.state.entity);
      formData.append("status", this.state.updateStatus);
      if (typeof this.state.icon === "string") {
        formData.append("icon", null);
      } else {
        formData.append("icon", this.state.icon);
      }
      businessEntitiesService.createBusinessEntity(formData).then((res) => {
        if (res.status === false) {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          history.push("/admin/business_entities");
          this.handleClick();
        }
      });
    } else if (this.validator.allValid() && this.state.id > 0) {
      this.updateEntity();
    } else {
      this.validator.showMessages();
    }
  }

  updateEntity() {
    const formData = new FormData();
    formData.append("entity", this.state.entity);
    formData.append("status", this.state.updateStatus);
    console.log("this.state.icon", this.state.icon);
    if (typeof this.state.icon === "string") {
      formData.append("icon", null);
    } else {
      formData.append("icon", this.state.icon);
    }
    businessEntitiesService
      .updateBusinessEntitiesDetails(formData, this.state.id)
      .then((res) => {
        if (res.success === false) {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          history.push("/admin/business_entities");
          this.handleClick();
        }
      });
  }

  handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64 = reader.result;
      this.setState({
        ...this.state,
        icon: file,
        imagePreview: base64,
      });
    };
  };

  editBusinessEntity(id) {
    businessEntitiesService.getBusinessEntitiesDetails(id).then((res) => {      
      if (res.status === false) {
        notify.error(res.message);
      } else {
        if (res.data == null) {
          notify.error("Details not found");
          history.push("/admin/business_entities");
        } else {
          this.setState({
            ...this.state,
            id: res.data.id,
            entity: res.data.entity,
            icon: res.data.icon,
            updateStatus: res.data.status,
          });
        }
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
    });
  }

  handleClick = () => {
    window.location.reload();
  };

  render() {
    return (
      <>
        <CRow id="add-entity" ref={this.addEntityRef}>
          <CCol xs="12">
            <CCard>
              <CCardHeader>
                <strong>Add an Entity</strong>
              </CCardHeader>
              <CCardBody>
                <CFormGroup>
                  <CLabel htmlFor="nf-name">Entity</CLabel>
                  {this.state.entity === "" ? (
                    <CInput
                      type="text"
                      id="entity"
                      name="entity"
                      placeholder="Enter Entity"
                      autoComplete="entity"
                      onChange={this.handleInputChange}
                    />
                  ) : (
                    <CInput
                      type="text"
                      id="entity"
                      name="entity"
                      value={this.state.entity}
                      placeholder="Enter Entity"
                      autoComplete="entity"
                      onChange={this.handleInputChange}
                    />
                  )}
                  <CFormText className="help-block">
                    {this.validator.message(
                      "entity",
                      this.state.entity,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-name">Icon</CLabel>
                  <div>
                    <input
                      type="file"
                      accept=".svg,.jpg,.jpeg,.png"
                      onChange={this.handleImageChange}
                    />
                    {this.state.imagePreview ? (
                      <img
                        src={this.state.imagePreview}
                        alt="Icon"
                        style={{
                          maxWidth: "200px",
                          maxHeight: "200px",
                          width: "auto",
                          height: "auto",
                        }}
                      />
                    ) : (
                      <span>
                        <td>
                          {this.state.icon ? (
                            <img                              
                              src={this.state.icon}
                              alt="Icon"
                              style={{
                                maxWidth: "200px",
                                maxHeight: "200px",
                                width: "auto",
                                height: "auto",
                              }}
                            />
                          ) : null}
                        </td>
                      </span>
                    )}
                  </div>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="1">
                    <CLabel htmlFor="select">Status</CLabel>
                  </CCol>
                  <CCol md="11">
                    <CFormGroup variant="custom-checkbox" inline>
                      {this.state.updateStatus === "1" && (
                        <CSwitch
                          name="updateStatus"
                          className="mr-1"
                          color="primary"
                          value={this.state.updateStatus}
                          defaultChecked
                          onClick={this.handleInputChange}
                        />
                      )}

                      {this.state.updateStatus === "0" && (
                        <CSwitch
                          name="updateStatus"
                          className="mr-1"
                          color="primary"
                          value={this.state.updateStatus}
                          onClick={this.handleInputChange}
                        />
                      )}
                    </CFormGroup>
                  </CCol>
                </CFormGroup>
              </CCardBody>
              <CCardFooter>
                <CButton
                  type="button"
                  size="sm"
                  color="primary"
                  onClick={this.handleSubmit}
                >
                  <FontAwesomeIcon icon={faSave} className="mr-1" /> Submit
                </CButton>
                &nbsp;
                <CLink
                  className="btn btn-danger btn-sm"
                  aria-current="page"
                  onClick={this.handleClick}
                  to="/admin/business_entities"
                >
                  <FontAwesomeIcon icon={faBan} className="mr-1" />
                  Cancel
                </CLink>
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
        <CRow>
          <CCol xl={12}>
            <CCard>
              <CCardBody>
                <CRow>
                  <CCol xl={3}>
                    <CFormGroup row>
                      <CCol xs="12">
                        <CLabel htmlFor="name">Entity</CLabel>
                        <CInput
                          id="entity"
                          placeholder="Search Entity"
                          name="entity"
                          value={this.state.fields.entity}
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
                <strong>Business Entities</strong>
              </CCardHeader>
              <CCardBody>
                <div className="position-relative table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th onClick={() => this.handleColumnSort("entity")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Entity
                            </span>
                            {this.state.fields.sort !== "entity" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "entity" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "entity" && (
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
                        {(_canAccess("business_entities", "update") ||
                          _canAccess("business_entities", "delete")) && (
                          <>
                            <th style={{ width: "20%" }}>Action</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state?.business_entity_list?.length > 0 ? (
                        this.state.business_entity_list.map((u, index) => (
                          <tr key={u.id}>
                            <td>{index + 1}</td>
                            <td>{u.entity}</td>

                            <td>
                              {_canAccess("business_entities", "update") && (
                                <CLink
                                  onClick={() =>
                                    this.businessEntityStatusChangeHandler(
                                      u.id,
                                      u.status
                                    )
                                  }
                                >
                                  {u.status === "1" ? "Active" : "Deactive"}
                                </CLink>
                              )}
                              {_canAccess("business_entities", "update") ===
                                false && (
                                <>{u.status === "1" ? "Active" : "Deactive"}</>
                              )}
                            </td>

                            {(_canAccess("business_entities", "update") ||
                              _canAccess("business_entities", "delete")) && (
                              <>
                                <td>
                                  {/* {current_user.id !== u.id && (
                                    <> */}
                                  {_canAccess(
                                    "business_entities",
                                    "update"
                                  ) && (
                                    <CTooltip
                                      content={globalConstants.EDIT_BTN}
                                    >
                                      <CLink
                                        className="btn  btn-md btn-primary"
                                        aria-current="page"
                                        onClick={() =>
                                          this.editBusinessEntity(u.id)
                                        }
                                        // to={`/admin/faq/edit/${u.id}`}
                                      >
                                        <CIcon name="cil-pencil"></CIcon>{" "}
                                      </CLink>
                                    </CTooltip>
                                  )}
                                  &nbsp;
                                  {_canAccess(
                                    "business_entities",
                                    "delete"
                                  ) && (
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
                                  {/* </>
                                  )} */}
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
                  {this.state?.business_entity_list?.length > 0 ? (
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
            <CButton color="danger" onClick={() => this.deleteBusinessEntity()}>
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

export default BusinessEntitiesIndex;
