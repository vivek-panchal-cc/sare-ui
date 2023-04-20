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
  CSwitch,
  CTextarea,
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
import { smsService } from "../../../../services/admin/sms.service";

class Sms_Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        id: this.props.match.params.id,
        title: "",
        slug: "",
        message: "",
        status: "0",
      },
    };
    this.handleChange = this.handleChange.bind(this);
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      if (_canAccess(this.props.module_name, this.props.action, "/admin/sms")) {
        smsService.getSmsDetails(this.state.fields.id).then((res) => {
          if (res.success === false) {
            notify.error(res.message);
          } else {
            if (res.data == null) {
              notify.error("Details not found");
              history.push("/admin/sms");
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
      let newStatus = "0";
      if (value === "1") {
        newStatus = "0";
      }
      if (value === "0") {
        newStatus = "1";
      }
      this.setState({ fields: { ...this.state.fields, [name]: newStatus } });
    } else {
      this.setState({ fields: { ...this.state.fields, [name]: value } });
    }
  }

  handleSubmit() {
    if (this.validator.allValid()) {
      var postVal = {
        id: this.props.match.params.id,
        title: this.state.fields.title,
        slug: this.state.fields.slug,
        message: this.state.fields.message,
        status: this.state.fields.status,
      };
      smsService.updateSmsTemplates(postVal).then((res) => {
        if (res.success === false) {
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

  render() {
    return (
      <>
        <CRow>
          <CCol xs="12">
            <CCard>
              <CCardHeader>
                <strong>Edit Template</strong>
                <div className="card-header-actions">
                  <CTooltip content={globalConstants.BACK_MSG}>
                    <CLink
                      className="btn btn-danger btn-sm"
                      aria-current="page"
                      to="/admin/sms"
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
                    placeholder="Enter Title "
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
                  <CLabel htmlFor="nf-name">Slug</CLabel>
                  <CInput
                    type="text"
                    id="slug"
                    name="slug"
                    placeholder="Enter Slug"
                    autoComplete="slug"
                    value={this.state.fields.slug}
                    onChange={this.handleChange}
                    disabled={true}
                  />
                  {/* <CFormText className="help-block">
                    {this.validator.message(
                      "slug",
                      this.state.fields.slug,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText> */}
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-name">Message</CLabel>
                  <CTextarea
                    type="text"
                    id="message"
                    name="message"
                    placeholder="Enter Message"
                    autoComplete="message"
                    value={this.state.fields.message}
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
                  to="/admin/sms"
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

export default Sms_Edit;
