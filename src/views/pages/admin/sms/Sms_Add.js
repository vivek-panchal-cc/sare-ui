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
  CSwitch,
  CTooltip,
} from "@coreui/react";
import SimpleReactValidator from "simple-react-validator";
import { userService } from "../../../../services/admin/user.service";
import { smsService } from "../../../../services/admin/sms.service";
import { notify, history, _canAccess } from "../../../../_helpers/index";
import { globalConstants } from "../../../../constants/admin/global.constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBan, faSave } from "@fortawesome/free-solid-svg-icons";
const UserGroups = React.lazy(() =>
  import("../../../../components/admin/UserGroups")
);

class Sms_Add extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {
        title: "",
        slug: "",
        message: "",
        status: true,
      },
    };
    if (this.props._renderAccess === false) {
      history.push("/admin/sms");
    }
    this.handleChange = this.handleChange.bind(this);
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    if (name === "status") {
      var fstatus = value === "true" ? false : true;
      this.setState({ fields: { ...this.state.fields, [name]: fstatus } });
    } else {
      this.setState({ fields: { ...this.state.fields, [name]: value } });
    }
  }

  handleSubmit() {
    if (this.validator.allValid()) {
      smsService.createSms(this.state.fields).then((res) => {
        if (res.status === false) {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          history.push("/admin/sms");
        }
      });
    } else {
      this.validator.showMessages();
    }
  }

  handleFieldChange = (inputFieldId, inputFieldValue) => {
    this.setState({
      fields: { ...this.state.fields, [inputFieldId]: inputFieldValue },
    });
  };
  componentDidMount() {
    setTimeout(
      () => _canAccess(this.props.module_name, this.props.action, "/admin/sms"),
      300
    );
  }

  render() {
    return (
      <>
        <CRow>
          <CCol xs="12">
            <CCard>
              <CCardHeader>
                <strong>Add SMS template</strong>
                <div className="card-header-actions">
                  <CTooltip content={globalConstants.BACK_MSG}>
                    <CLink
                      className="btn btn-danger btn-sm"
                      aria-current="page"
                      to="/admin/sms"
                    >
                      {" "}
                      <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
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
                  <CLabel htmlFor="nf-name">Slug</CLabel>
                  <CInput
                    type="text"
                    id="slug"
                    name="slug"
                    placeholder="Enter Slug"
                    autoComplete="slug"
                    onChange={this.handleChange}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "slug",
                      this.state.fields.slug,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-name">Message</CLabel>
                  <CInput
                    type="text"
                    id="message"
                    name="message"
                    placeholder="Enter Message"
                    autoComplete="message"
                    onChange={this.handleChange}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "message",
                      this.state.fields.message,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>
                {/* <CFormGroup>
                  <CLabel htmlFor="nf-email">Mobile</CLabel>
                  <CInput
                    type="number"
                    id="mobile_number"
                    name="mobile_number"
                    placeholder="Enter Mobile "
                    min={1}
                    autoComplete="mobile_number"
                    onChange={this.handleChange}
                    onBlur={() => this.validator.showMessageFor("mobile_number")}
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
                  <CLabel htmlFor="nf-email">User Groups</CLabel>
                  <UserGroups
                    key="user_group_id"
                    id="user_group_id"
                    value={this.state.fields.user_group_id}
                    onChange={this.handleFieldChange}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "user_group_id",
                      this.state.fields.user_group_id,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup> */}
                <CFormGroup row>
                  <CCol md="1">
                    <CLabel htmlFor="select">Status</CLabel>
                  </CCol>
                  <CCol md="11">
                    <CFormGroup variant="custom-checkbox" inline>
                      <CSwitch
                        name="status"
                        className="mr-1"
                        color="primary"
                        defaultChecked={this.state.fields.status}
                        onClick={this.handleInputChange}
                      />
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
                  to="/admin/users"
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

export default Sms_Add;
