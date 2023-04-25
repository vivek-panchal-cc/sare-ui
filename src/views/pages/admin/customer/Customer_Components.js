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
import { globalConstants } from "../../../../constants/admin/global.constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import './styles.css'

const CustomerDetailsComponent = (props) => {
  const { customer } = props;
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
                    <table className="customTable">
                      <tbody>
                        <tr>
                          <td>
                            <b>Account Number :</b>
                          </td>
                          <td>
                            {customer.account_number
                              ? customer.account_number
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>Name :</b>
                          </td>
                          <td>
                            {customer.name ? customer.name : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>Mobile Number :</b>
                          </td>
                          <td>
                            {customer.mobile_number
                              ? customer.mobile_number
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>National Id :</b>
                          </td>
                          <td>
                            {customer.national_id
                              ? customer.national_id
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>SHOFCO Number :</b>
                          </td>
                          <td>
                            {customer.shofco_number
                              ? customer.shofco_number
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>Customer Type :</b>
                          </td>
                          <td>
                            {customer.customer_type
                              ? customer.customer_type === "individual"
                                ? "Individual"
                                : customer.customer_type === "business"
                                ? "Business"
                                : "Agent"
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>Status :</b>
                          </td>
                          <td>
                            {customer.status
                              ? customer.status === "0"
                                ? "Deactive"
                                : "Active"
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>Kyc :</b>
                          </td>
                          <td>
                            {customer.kycId ? (
                              <a
                                href={`/admin/kyc_requests/detailview/${customer.kycId}`}
                              >
                                {customer.kyc_token}
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>Kyc Status :</b>
                          </td>
                          <td>
                            {customer.kyc_status
                              ? (() => {
                                  switch (customer.kyc_status) {
                                    case "pending_approval":
                                      return "Pending Approval";
                                    case "pending":
                                      return "Pending";
                                    case "approved":
                                      return "Approved";
                                    case "rejected":
                                      return "Rejected";
                                    default:
                                      return "N/A";
                                  }
                                })()
                              : "N/A"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
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
