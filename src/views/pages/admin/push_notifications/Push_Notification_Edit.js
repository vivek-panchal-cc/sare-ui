/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormGroup,
  CInput,
  CLabel,
  CFormText,
  CCardFooter,
  CButton,
  CLink,
  CTooltip,
  CSwitch,
  CTextarea,
  CSelect,
} from "@coreui/react";
import SimpleReactValidator from "simple-react-validator";
import { agentService } from "../../../../services/admin";
import { pushNotificationService } from "../../../../services/admin/push_notification.service";
import { notify, history, _canAccess } from "../../../../_helpers/index";
import { globalConstants } from "../../../../constants/admin/global.constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CIcon from "@coreui/icons-react";
import { faArrowLeft, faBan, faSave } from "@fortawesome/free-solid-svg-icons";
import FileSaver from "file-saver";

class PushNotificationEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        id: this.props.match.params.id,
        title: "",
        // image: null,
        description: "",
        status: "",
        customer_type: "",
        type: "",
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      if (
        _canAccess(
          this.props.module_name,
          this.props.action,
          "/admin/notifications"
        )
      ) {
        pushNotificationService
          .getNotifications(this.state.fields.id)
          .then((res) => {
            if (res.success === false) {
              notify.error(res.message);
            } else {
              if (res.data == null) {
                notify.error("Notification not found");
                history.push("/admin/notifications");
              } else {
                this.setState({
                  ...this.state.fields,
                  fields: res.data,
                });
              }
            }
          });
      }
    }, 300);
  }

  // downloadFile(url) {
  //   if (url) {
  //     const urlArray = url.split("/");
  //     const fileName = urlArray[urlArray.length - 1];
  //     FileSaver.saveAs(url, fileName);
  //   }
  // }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ fields: { ...this.state.fields, [name]: value } });
  }

  handleSubmit() {
    if (this.validator.allValid()) {
      // const formData = new FormData();      
      // formData.append("title", this.state.fields.title);
      // formData.append("description", this.state.fields.description);
      // formData.append("type", this.state.fields.type);
      // formData.append("customer_type", this.state.fields.customer_type);
      // formData.append("status", this.state.fields.status);
      // if (typeof this.state.fields.image === "string") {
      //   formData.append("image", "");
      // } else {
      //   formData.append("image", this.state.fields.image);
      // }
      let postVal = {        
        title: this.state.fields.title,
        description: this.state.fields.description,
        type: this.state.fields.type,
        customer_type: this.state.fields.customer_type,
        status: this.state.fields.status,
      };
      pushNotificationService
        .updateNotification(postVal, this.state.fields.id)
        .then((res) => {
          if (res.success === false) {
            notify.error(res.message);
          } else {
            notify.success(res.message);
            history.push("/admin/notifications");
          }
        });
    } else {
      this.validator.showMessages();
    }
  }

  // handleImageChange = (event) => {
  //   const file = event.target.files[0];
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onloadend = () => {
  //     const base64 = reader.result;
  //     this.setState({
  //       fields: {
  //         ...this.state.fields,
  //         image: file,
  //       },
  //       imagePreview: base64,
  //     });
  //   };
  // };

  // handleInputChange(e) {
  //   const value =
  //     e.target.type === "checkbox" ? e.target.checked : e.target.value;
  //   const statusValue = value ? 1 : 0;
  //   this.setState({
  //     fields: {
  //       ...this.state.fields,
  //       status: statusValue,
  //     },
  //   });
  // }

  render() {
    return (
      <>
        <CRow>
          <CCol xs="12">
            <CCard>
              <CCardHeader>
                <strong>Edit Notification</strong>
                <div className="card-header-actions">
                  <CTooltip content={globalConstants.BACK_MSG}>
                    <CLink
                      className="btn btn-danger btn-sm"
                      aria-current="page"
                      to="/admin/notifications"
                    >
                      {" "}
                      <FontAwesomeIcon
                        icon={faArrowLeft}
                        className="mr-1"
                      />{" "}
                      Back
                    </CLink>
                  </CTooltip>
                </div>
              </CCardHeader>
              <CCardBody>
                <CFormGroup>
                  <CLabel htmlFor="nf-name">Title</CLabel>
                  <CInput
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter Title"
                    autoComplete="title"
                    value={this.state.fields.title}
                    onChange={this.handleChange}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "title",
                      this.state.fields.title,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-name">Description</CLabel>
                  <CTextarea
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Enter Description"
                    value={this.state.fields.description}
                    autoComplete="description"
                    onChange={this.handleChange}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "description",
                      this.state.fields.description,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="name">Customer Type</CLabel>
                  <CSelect
                    id="name"
                    placeholder="Customer Type"
                    name="customer_type"
                    value={this.state.fields.customer_type}
                    onChange={this.handleChange}
                    style={{ cursor: "pointer" }}
                  >
                    <option value="">-- Select Customer Type --</option>
                    <option value="individual">Individual</option>
                    <option value="business">Business</option>
                    <option value="agent">Agent</option>
                    <option value="all">All</option>
                  </CSelect>
                  <CFormText className="help-block">
                    {this.validator.message(
                      "customer_type",
                      this.state.fields.customer_type,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="name">Type</CLabel>
                  <CSelect
                    id="name"
                    placeholder="Type"
                    name="type"
                    value={this.state.fields.type}
                    onChange={this.handleChange}
                    style={{ cursor: "pointer" }}
                  >
                    <option value="">-- Select Type --</option>
                    <option value="system">System</option>
                    <option value="custom">Custom</option>
                  </CSelect>
                  <CFormText className="help-block">
                    {this.validator.message(
                      "type",
                      this.state.fields.type,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="name">Status</CLabel>
                  <CSelect
                    id="name"
                    placeholder="Status"
                    name="status"
                    value={this.state.fields.status}
                    onChange={this.handleChange}
                    style={{ cursor: "pointer" }}
                  >
                    <option value="">-- Select Status --</option>
                    <option value="send">Send</option>
                    <option value="schedule">Schedule</option>
                    <option value="inprogress">In Progress</option>
                  </CSelect>
                  <CFormText className="help-block">
                    {this.validator.message(
                      "status",
                      this.state.fields.status,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>
                {/* <CFormGroup>
                  <CLabel htmlFor="nf-name">Image</CLabel>
                  <div>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={this.handleImageChange}
                    />
                    {this.state.imagePreview ? (
                      <img
                        src={this.state.imagePreview}
                        alt="Image"
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
                          <img
                            // src="http://192.168.1.32/SARE/customer-onboard/storage/app/uploads/profile-images/1681901854_file.jpeg"
                            src={this.state.fields.image}
                            alt="Image"
                            style={{
                              maxWidth: "200px",
                              maxHeight: "200px",
                              width: "auto",
                              height: "auto",
                            }}
                          />
                        </td>
                        <td>
                          {this.state.fields.image && (
                            <CTooltip content={globalConstants.Download_BTN}>
                              <CLink
                                className="btn btn-md btn-primary"
                                aria-current="page"
                                onClick={() =>
                                  this.downloadFile(this.state.fields.image)
                                }
                              >
                                <CIcon name="cil-cloud-download"></CIcon>
                              </CLink>
                            </CTooltip>
                          )}
                        </td>
                      </span>
                    )}
                  </div>
                </CFormGroup> */}
                <CFormText className="help-block module_permission"></CFormText>
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
                  to="/admin/notifications"
                >
                  <FontAwesomeIcon icon={faBan} className="mr-1" />
                  Cancel
                </CLink>
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
      </>
    );
  }
}

export default PushNotificationEdit;
