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
  CTooltip, CTextarea
} from "@coreui/react";
import SimpleReactValidator from "simple-react-validator";
import { faqService } from "../../../../services/admin/faq.service";
import { notify, history, _canAccess } from "../../../../_helpers/index";
import { globalConstants } from "../../../../constants/admin/global.constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBan, faSave } from "@fortawesome/free-solid-svg-icons";

class Sms_Add extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {
        question: "",
        answer: "",
        status: 1,
      },
    };
    if (this.props._renderAccess === false) {
      history.push("/admin/faq");
    }
    this.handleChange = this.handleChange.bind(this);
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    if (name === "status") {
      let updateStatus = 0;
      if (value === true) {
        updateStatus = 0;
      }
      if (value === false) {
        updateStatus = 1;
      }
      this.setState({ fields: { ...this.state.fields, [name]: updateStatus } });
    } else {
      this.setState({ fields: { ...this.state.fields, [name]: value } });
    }
  }

  handleSubmit() {
    if (this.validator.allValid()) {
      faqService.createFaq(this.state.fields).then((res) => {
        if (res.status === false) {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          history.push("/admin/faq");
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
      () => _canAccess(this.props.module_name, this.props.action, "/admin/faq"),
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
                <strong>Add FAQ</strong>
                <div className="card-header-actions">
                  <CTooltip content={globalConstants.BACK_MSG}>
                    <CLink
                      className="btn btn-danger btn-sm"
                      aria-current="page"
                      to="/admin/faq"
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
                  <CLabel htmlFor="nf-name">Question</CLabel>
                  <CInput
                    type="text"
                    id="question"
                    name="question"
                    placeholder="Enter Question"
                    autoComplete="question"
                    onChange={this.handleChange}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "question",
                      this.state.fields.question,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-name">Answer</CLabel>
                  <CTextarea
                    type="text"
                    id="answer"
                    name="answer"
                    placeholder="Enter Answer"
                    autoComplete="answer"
                    onChange={this.handleChange}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "answer",
                      this.state.fields.answer,
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
                {/* <CFormGroup row>
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
                        onClick={this.handleChange}
                        // disabled={true}
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
                  to="/admin/faq"
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
