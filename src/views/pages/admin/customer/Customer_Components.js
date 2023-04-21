/* eslint-disable jsx-a11y/img-redundant-alt */
import { useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CContainer,
  CTooltip,
  CLink,
} from "@coreui/react";
import { _loginUsersDetails } from "../../../../_helpers";
import { globalConstants } from "../../../../constants/admin/global.constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const CustomerDetailsComponent = (props) => {
  const [fields, setFields] = useState({
    pageNo: 1,
    sort_dir: "desc",
    sort_field: "name",
    credit_acc: "",
    ref_id: "",
    status: "",
    from: "",
    to: "",
    totalPage: 1,
  });

  return (
    <>
      <CContainer fluid>
        <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <strong>Customer Details</strong>
                <div className="card-header-actions">
                  <CTooltip content={globalConstants.BACK_MSG}>
                    <CLink
                      className="btn btn-danger btn-sm"
                      aria-current="page"
                      to="/admin/customers"
                    >
                      {" "}
                      <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                      Back
                    </CLink>
                  </CTooltip>
                </div>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol sm="12">
                    <b>Account Number :</b> {props.customer.account_number}
                    <br />
                    <b>Name :</b> {props.customer.name}
                    <br />
                    <b>Mobile Number :</b> {props.customer.mobile_number}
                    <br />
                    <b>National Id :</b> {props.customer.national_id}
                    <br />
                    <b>SHOFCO Number :</b> {props.customer.shofco_number}
                    <br />
                    <b>Customer Type :</b>{" "}
                    {props.customer.customer_type === "individual"
                      ? "Individual"
                      : props.customer.customer_type === "business"
                      ? "Business"
                      : "Agent"}
                    <br />
                    <b>Status :</b>{" "}
                    {props.customer.status === "0" ? "Deactive" : "Active"}
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </>
  );
};

export default CustomerDetailsComponent;
