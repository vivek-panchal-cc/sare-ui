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
  CInputCheckbox,
  CTooltip,
  CSelect,
} from "@coreui/react";
import SimpleReactValidator from "simple-react-validator";
import { customerService } from "../../../../services/admin/";
import {
  notify,
  history,
  capitalize,
  _canAccess,
} from "../../../../_helpers/index";
import $ from "jquery";
import { globalConstants } from "../../../../constants/admin/global.constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBan, faSave } from "@fortawesome/free-solid-svg-icons";

class Customer_Edit extends React.Component {
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
        status: 1,
        account_number: this.props.match.params.id,
      },
    };
    this.handleChange = this.handleChange.bind(this);
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.permssionChange = this.permssionChange.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      if (
        _canAccess(
          this.props.module_name,
          this.props.action,
          "/admin/customers"
        )
      ) {
        customerService
          .getCustomerDetails(this.state.fields.account_number)
          .then((res) => {
            console.log("Response", res);
            if (res.success === false) {
              notify.error(res.message);
            } else {
              if (res.data == null) {
                notify.error("Customer not found");
                history.push("/admin/customers");
              } else {
                this.setState({ ...this.state.fields, fields: res.data });
              }
            }
          });
      }
    }, 300);
  }

  handleChange(e) {
    const { name, value } = e.target;
    if (name === "status") {
      var fstatus = value === "true" ? false : true;
      this.setState({ fields: { ...this.state.fields, [name]: fstatus } });
    } else if (name === "mobile_number") {
      if (/^\d{0,9}$/.test(value)) {
        this.setState({ fields: { ...this.state.fields, [name]: value } });
      }
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
      formData.append("customer_status", this.state.fields.status);
      formData.append("profile_image", this.state.fields.profile_image);
      
      customerService
        .updateCustomerDetails(formData, this.state.account_number)
        .then((res) => {          
          if (res.success === false) {
            notify.error(res.message);
          } else {
            notify.success(res.message);
            history.push("/admin/customers");
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

  render() {
    return (
      <>
        <CRow>
          <CCol xs="12">
            <CCard>
              <CCardHeader>
                <strong>Edit Customers</strong>
                <div className="card-header-actions">
                  <CTooltip content={globalConstants.BACK_MSG}>
                    <CLink
                      className="btn btn-danger btn-sm"
                      aria-current="page"
                      to="/admin/customers"
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
                    type="number"
                    id="national_id"
                    name="national_id"
                    placeholder="Enter National Id"
                    autoComplete="name"
                    value={this.state.fields.national_id}
                    onChange={this.handleChange}
                    min={1}
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
                  <CLabel htmlFor="nf-name">ShofCo Number</CLabel>
                  <CInput
                    type="number"
                    id="shofco_number"
                    name="shofco_number"
                    placeholder="Enter ShofCo Number"
                    autoComplete="name"
                    value={this.state.fields.shofco_number}
                    onChange={this.handleChange}
                    min={1}
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
                    {this.state.imagePreview && (
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
                    )}
                  </div>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-email">Status</CLabel>
                  <CSelect
                    key="status"
                    id="status"
                    placeholder="Status"
                    value={this.state.fields.status}
                    style={{ cursor: "pointer" }}
                    onChange={(event) =>
                      this.handleFieldChange("status", event.target.value)
                    }
                  >
                    <option value="">-- Select Status --</option>
                    <option value="1">Active</option>
                    <option value="0">In-Active</option>
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
                  to="/admin/customers"
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

export default Customer_Edit;
