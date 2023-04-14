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
} from "@coreui/react";
import SimpleReactValidator from "simple-react-validator";
import { bankService } from "../../../../services/admin/bank.service";
import { notify, history, _canAccess } from "../../../../_helpers/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faSave } from "@fortawesome/free-solid-svg-icons";
import { _loginUsersDetails } from "../../../../_helpers/index";

class Bank_Add extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {
        account_name: "",
        account_number: "",
      },
    };
    if (this.props._renderAccess === false) {
      history.push("/admin/bank");
    }
    this.handleChange = this.handleChange.bind(this);
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    bankService.getBankDetails().then((res) => {
      if (res.success === false) {
        notify.error(res.message);
      } else {
        const bankDetails = res.data;
        this.setState({
          fields: {
            account_name: bankDetails.account_name,
            account_number: bankDetails.account_number,
          },
        });
      }
    });
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
      bankService.updateBankDetails(this.state.fields).then((res) => {
        if (res.status === false) {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          // history.push("/admin/bank");
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

  handleCancel = () => {
    this.setState({
      fields: {
        account_name: "",
        account_number: "",
      },
    });
  };

  render() {
    return (
      <>
        <CRow>
          <CCol xs="12">
            <CCard>
              <CCardHeader>
                <strong>Add Bank Details</strong>
                <div className="card-header-actions"></div>
              </CCardHeader>
              <CCardBody>
                <CFormGroup>
                  <CLabel htmlFor="nf-name">Account Name</CLabel>
                  <CInput
                    type="text"
                    id="account_name"
                    name="account_name"
                    placeholder="Enter Account Name"
                    autoComplete="account_name"
                    onChange={this.handleChange}
                    value={this.state.fields.account_name}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "account_name",
                      this.state.fields.account_name,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-name">Account Number</CLabel>
                  <CInput
                    type="number"
                    id="account_number"
                    name="account_number"
                    placeholder="Enter Account Number"
                    autoComplete="account_number"
                    onChange={this.handleChange}
                    value={this.state.fields.account_number}
                    min={1}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "account_number",
                      this.state.fields.account_number,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText>
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
                  to={this.props.location.pathname}
                  onClick={this.handleCancel}
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

export default Bank_Add;
