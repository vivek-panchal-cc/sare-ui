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
} from "@coreui/react";
import SimpleReactValidator from "simple-react-validator";
import {
  notify,
  history,
  _canAccess,
} from "../../../../_helpers/index";
import { globalConstants } from "../../../../constants/admin/global.constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBan, faSave } from "@fortawesome/free-solid-svg-icons";
import { faqService } from "../../../../services/admin/faq.service";

class Faq_Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        id: this.props.match.params.id,
        question: "",
        answer: "",
        status: 1,
      },
    };
    this.handleChange = this.handleChange.bind(this);
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      if (_canAccess(this.props.module_name, this.props.action, "/admin/faq")) {
        faqService.getFaqDetails(this.state.fields.id).then((res) => {
          console.log("res", res);
          if (res.status === false) {
            notify.error(res.message);
          } else {
            if (res.result == null) {
              notify.error("Details not found");
              history.push("/admin/faq");
            } else {
              this.setState({ ...this.state.fields, fields: res.result });
            }
          }
        });
      }
    }, 300);
  }

  handleChange(e) {
    const { name, value } = e.target;
    if (name === "status") {
      // const newStatus = !this.state.fields.status;
      const updateStatus = this.state.fields.status === 1 ? 0 : 1;      
      this.setState({ fields: { ...this.state.fields, [name]: updateStatus } });
    } else {
      this.setState({ fields: { ...this.state.fields, [name]: value } });
    }
  }

  handleSubmit() {
    if (this.validator.allValid()) {
      var postVal = {
        id: this.props.match.params.id,
        question: this.state.fields.question,
        answer: this.state.fields.answer,
        status: this.state.fields.status
      };
      faqService.updateFaq(postVal).then((res) => {
        if (res.success === false) {
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

  render() {
    return (
      <>
        <CRow>
          <CCol xs="12">
            <CCard>
              <CCardHeader>
                <strong>Edit FAQ</strong>
                <div className="card-header-actions">
                  <CTooltip content={globalConstants.BACK_MSG}>
                    <CLink
                      className="btn btn-danger btn-sm"
                      aria-current="page"
                      to="/admin/faq"
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
                  <CLabel htmlFor="nf-name">Question</CLabel>
                  <CInput
                    type="text"
                    id="question"
                    name="question"
                    placeholder="Enter Question "
                    autoComplete="question"
                    value={this.state.fields.question}
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
                  <CInput
                    type="text"
                    id="answer"
                    name="answer"
                    placeholder="Enter Answer"
                    autoComplete="answer"
                    value={this.state.fields.answer}
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
                {/* <CFormGroup row>
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
                          onChange={this.handleInputChange}
                        />
                      )}

                      {this.state.fields.status === "0" && (
                        <CSwitch
                          className="mr-1"
                          color="primary"
                          id="status"
                          name="status"
                          value={this.state.fields.status}
                          onChange={this.handleInputChange}
                        />
                      )}
                    </CFormGroup>
                  </CCol>
                </CFormGroup> */}
                <CFormGroup row>
                  <CCol md="1">Status</CCol>

                  <CCol sm="11">
                    <CFormGroup variant="custom-checkbox" inline>
                      {this.state.fields.status === 1 && (
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

                      {this.state.fields.status === 0 && (
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

export default Faq_Edit;
