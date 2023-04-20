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
  CSelect,
  CSwitch,
} from "@coreui/react";
import SimpleReactValidator from "simple-react-validator";
import { agentService } from "../../../../services/admin/";
import { notify, history, _canAccess } from "../../../../_helpers/index";
import { globalConstants } from "../../../../constants/admin/global.constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CIcon from "@coreui/icons-react";
import { faArrowLeft, faBan, faSave } from "@fortawesome/free-solid-svg-icons";
import FileSaver, { saveAs } from "file-saver";

class Agent_Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        name: "",
        mobile_number: "",
        customer_type: "",
        national_id: "",
        shofco_number: "",
        profile_image: null,
        status: "0",
        account_number: this.props.match.params.id,
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      if (
        _canAccess(this.props.module_name, this.props.action, "/admin/agents")
      ) {
        // Fetching Agent details.
        agentService
          .getAgentDetails(this.state.fields.account_number)
          .then((res) => {
            console.log("Response", res);
            if (res.success === false) {
              notify.error(res.message);
            } else {
              if (res.data == null) {
                notify.error("Agent not found");
                history.push("/admin/agents");
              } else {
                this.setState({
                  ...this.state.fields,
                  fields: res.data.personal_details,
                });
              }
            }
          });
      }
    }, 300);
  }

  downloadFile(url) {
    if (url) {
      const urlArray = url.split("/");
      const fileName = urlArray[urlArray.length - 1];
      FileSaver.saveAs(url, fileName);
    }
  }

  handleChange(e) {
    const { name, value } = e.target;
    if (name === "status") {
      let newStatus = "0";
      if (value === "1") {
        newStatus = "0";
      }
      if (value === "0") {
        newStatus = "1";
      }
      this.setState({ fields: { ...this.state.fields, [name]: newStatus } });
    } else if (name === "mobile_number") {
      if (/^\d{0,9}$/.test(value)) {
        this.setState({ fields: { ...this.state.fields, [name]: value } });
      }
    } else if (name === "national_id") {
      const newValue = value.replace(/[^A-Za-z0-9]/g, "").slice(0, 9);
      this.setState({ fields: { ...this.state.fields, [name]: newValue } });
    } else if (name === "shofco_number") {
      const newValue = value.replace(/[^A-Za-z0-9]/g, "").slice(0, 50);
      this.setState({ fields: { ...this.state.fields, [name]: newValue } });
    } else {
      this.setState({ fields: { ...this.state.fields, [name]: value } });
    }
  }

  handleFieldChange = (inputFieldId, inputFieldValue) => {
    this.setState({
      fields: { ...this.state.fields, [inputFieldId]: inputFieldValue },
    });
  };

  handleSubmit() {
    if (this.validator.allValid()) {
      const formData = new FormData();
      //   formData.append('id', this.state.account_number);
      formData.append("name", this.state.fields.name);
      formData.append("new_mobile_number", this.state.fields.mobile_number);
      formData.append("national_id", this.state.fields.national_id);
      formData.append("shofco_number", this.state.fields.shofco_number);
      formData.append("status", this.state.fields.status);
      if (typeof this.state.fields.profile_image === "string") {
        formData.append("profile_image", null);
      } else {
        formData.append("profile_image", this.state.fields.profile_image);
      }
      agentService
        .updateAgentDetails(formData, this.state.account_number)
        .then((res) => {
          if (res.success === false) {
            notify.error(res.message);
          } else {
            notify.success(res.message);
            history.push("/admin/agents");
          }
        });
    } else {
      this.validator.showMessages();
    }
  }

  handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64 = reader.result;
      const ext = file.type.split("/")[1];
      const name = `image_${Date.now()}.${ext}`;
      //   formData.append("file", file, name);
      this.setState({
        fields: {
          ...this.state.fields,
          profile_image: file,
        },
        imagePreview: base64,
      });
    };
  };

  handleInputChange(e) {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const statusValue = value ? 1 : 0;
    this.setState({
      fields: {
        ...this.state.fields,
        status: statusValue,
      },
    });
  }

  render() {
    return (
      <>
        <CRow>
          <CCol xs="12">
            <CCard>
              <CCardHeader>
                <strong>Edit Agents</strong>
                <div className="card-header-actions">
                  <CTooltip content={globalConstants.BACK_MSG}>
                    <CLink
                      className="btn btn-danger btn-sm"
                      aria-current="page"
                      to="/admin/agents"
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
                  <CLabel htmlFor="nf-name">Name</CLabel>
                  <CInput
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter Name "
                    autoComplete="name"
                    value={this.state.fields.name}
                    onChange={this.handleChange}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "name",
                      this.state.fields.name,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-name">Mobile Number</CLabel>
                  <CInput
                    type="text"
                    id="mobile"
                    name="mobile_number"
                    placeholder="Enter Mobile No. "
                    autoComplete="name"
                    value={this.state.fields.mobile_number}
                    onChange={this.handleChange}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "mobile_number",
                      this.state.fields.mobile_number,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-name">National Id</CLabel>
                  <CInput
                    type="text"
                    id="national_id"
                    name="national_id"
                    placeholder="Enter National Id"
                    autoComplete="name"
                    value={this.state.fields.national_id}
                    onChange={this.handleChange}
                    minLength={9}
                    maxLength={9}
                    pattern="[A-Za-z0-9]{9}"
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "national_id",
                      this.state.fields.national_id,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-name">SHOFCO Number</CLabel>
                  <CInput
                    type="text"
                    id="shofco_number"
                    name="shofco_number"
                    placeholder="Enter SHOFCO Number"
                    autoComplete="name"
                    value={this.state.fields.shofco_number}
                    onChange={this.handleChange}
                    maxLength={50}
                    pattern="[A-Za-z0-9]{9}"
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "shofco_number",
                      this.state.fields.shofco_number,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-name">Profile Image</CLabel>
                  <div>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={this.handleImageChange}
                    />
                    {this.state.imagePreview ? (
                      <img
                        src={this.state.imagePreview}
                        alt="Profile"
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
                            src={this.state.fields.profile_image}
                            alt="Profile Image"
                            style={{
                              maxWidth: "200px",
                              maxHeight: "200px",
                              width: "auto",
                              height: "auto",
                            }}
                          />
                        </td>
                        <td>
                          {this.state.fields.profile_image && (
                            <CTooltip content={globalConstants.Download_BTN}>
                              <CLink
                                className="btn btn-md btn-primary"
                                aria-current="page"
                                onClick={() =>
                                  this.downloadFile(
                                    this.state.fields.profile_image
                                  )
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
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="1">Status</CCol>

                  <CCol sm="11">
                    <CFormGroup variant="custom-checkbox" inline>
                      {this.state.fields.status === "1" && (
                        <CSwitch
                          className="mr-1"
                          color="primary"
                          id="status"
                          name="status"
                          value={this.state.fields.status}
                          defaultChecked
                          onChange={this.handleChange}
                        />
                      )}

                      {this.state.fields.status === "0" && (
                        <CSwitch
                          className="mr-1"
                          color="primary"
                          id="status"
                          name="status"
                          value={this.state.fields.status}
                          onChange={this.handleChange}
                        />
                      )}
                    </CFormGroup>
                  </CCol>
                </CFormGroup>
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
                  to="/admin/agents"
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

export default Agent_Edit;
