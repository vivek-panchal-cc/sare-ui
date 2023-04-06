import React, { useState, useEffect } from "react";
import "./page.css";
import moment from "moment";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CContainer,
  CCardFooter,
  CTooltip,
  CLink,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormGroup,
  CLabel,
  CInput,
  CFormText,
  CSelect,
  CTextarea,
} from "@coreui/react";
import KYCDetailsPopup from "./kycDetailsPopup";
import ReactHtmlParser from "react-html-parser";
import { capitalize } from "_helpers";
import { globalConstants } from "../../../../constants/admin/global.constants";
import { notify, history } from "../../../../_helpers/index";
import CIcon from "@coreui/icons-react";
import { kycRequestService } from "../../../../services/admin/kyc_request.service";

const KycDetailComponent = (props) => {
  const [isKycModalOpen, setKycModalOpen] = useState(false);
  const toggle = () => setKycModalOpen(!isKycModalOpen);
  // this.state = {
  //   _openPopup: false,
  // };

  const [isKYCPopupOpen, setKYCPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");

  const kycDetailId = props.kycDetail.id;

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  function handleSubmit() {
    kycRequestService
      .updateRequest(kycDetailId, {
        admin_comment: comment,
        status: status,
      })
      .then((res) => {
        if (res.status) {
          notify.success(res.message);
          // window.location.reload();
          history.push("/admin/kyc_requests");
        } else {
          notify.error(res.message);
        }
      });
  }

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  return (
    <>
      {/* Changes in Label, Details and set pencil and eye Icon as required in status (By Vivek Panchal) */}
      <CContainer fluid>
        <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <h5>Kyc Details</h5>
              </CCardHeader>
              {isLoading ? (
                <CCol sm="6">
                  <b>&nbsp;Loading...</b>
                  <br />
                </CCol>
              ) : (
                <CCardBody>
                  <CRow>
                    <CCol sm="6">
                      <b>Account Number :</b> {props.kycDetail.account_number}
                      <br />
                      <b>Name :</b> {props.kycDetail.name}
                    </CCol>
                    <CCol sm="6">
                      <b>Email :</b> {props.kycDetail.email}
                      <br />
                      <b>Phone Number :</b> {props.kycDetail.mobile_number}
                    </CCol>
                    <CCol sm="6">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <b>Home Address :&nbsp;</b>{" "}
                        {props.kycDetail.house_number
                          ? props.kycDetail.house_number + ", "
                          : ""}
                        {props.kycDetail.street_name
                          ? props.kycDetail.street_name + ", "
                          : ""}
                        {props.kycDetail.landmark
                          ? props.kycDetail.landmark + ", "
                          : ""}
                        {props.kycDetail.city
                          ? props.kycDetail.city + ", "
                          : ""}
                        {props.kycDetail.pincode
                          ? props.kycDetail.pincode + ""
                          : ""}
                      </div>
                      {props.kycDetail.status === "pending_approval" && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <b>Status :&nbsp;</b>{" "}
                          {(() => {
                            switch (props.kycDetail.status) {
                              case "pending":
                                return "Pending";
                              case "inprogress":
                                return "In Progress";
                              case "rejected":
                                return "Rejected";
                              case "approved":
                                return "Approved";
                              case "pending_approval":
                                return "Pending Approval";
                              default:
                                return "";
                            }
                          })()}
                          <button
                            style={{
                              border: "none",
                              backgroundColor: "transparent",
                              padding: 0,
                              margin: "0 0 0 10px",
                              outline: "none",
                            }}
                            onClick={toggle}
                          >
                            <i className="fa fa-pencil"></i>
                          </button>
                        </div>
                      )}
                      {(props.kycDetail.status === "pending" ||
                        props.kycDetail.status === "inprogress") && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <b>Status :&nbsp;</b>{" "}
                          {(() => {
                            switch (props.kycDetail.status) {
                              case "pending":
                                return "Pending";
                              case "inprogress":
                                return "In Progress";
                              case "rejected":
                                return "Rejected";
                              case "approved":
                                return "Approved";
                              case "pending_approval":
                                return "Pending Approval";
                              default:
                                return "";
                            }
                          })()}
                        </div>
                      )}
                      {props.kycDetail.status === "approved" ||
                      props.kycDetail.status === "rejected" ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <b>Status :&nbsp;</b>{" "}
                          {(() => {
                            switch (props.kycDetail.status) {
                              case "pending":
                                return "Pending";
                              case "inprogress":
                                return "In Progress";
                              case "rejected":
                                return "Rejected";
                              case "approved":
                                return "Approved";
                              case "pending_approval":
                                return "Pending Approval";
                              default:
                                return "";
                            }
                          })()}
                          <button
                            style={{
                              border: "none",
                              backgroundColor: "transparent",
                              padding: 0,
                              margin: "0 0 0 10px",
                              outline: "none",
                            }}
                            onClick={() => setKYCPopupOpen(true)}
                          >
                            <i className="fa fa-eye"></i>
                          </button>
                        </div>
                      ) : null}
                    </CCol>
                  </CRow>
                  {isKYCPopupOpen && (
                    <KYCDetailsPopup
                      kycDetail={props.kycDetail}
                      onClose={() => setKYCPopupOpen(false)}
                    />
                  )}

                  {/* <CCol
                    sm="6"
                    className="d-flex justify-content-end align-items-center"
                  >
                    <CButton color="success" onClick={toggle}>
                      <CIcon name="cil-pencil"></CIcon>
                    </CButton>
                  </CCol> */}
                  {/* </CRow> */}
                </CCardBody>
              )}
            </CCard>
          </CCol>
        </CRow>

        <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <h5>Kyc Files</h5>
              </CCardHeader>
              {isLoading ? (
                <CCol sm="6">
                  <b>&nbsp;Loading...</b>
                  <br />
                </CCol>
              ) : (
                <CCardBody>
                  <div className="position-relative table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {props.kycDetail.kyc_files?.length > 0 &&
                          props.kycDetail.kyc_files.map((file, index) => (
                            <tr key={index}>
                              <td>File name</td>
                              <td>
                                <CTooltip
                                  content={globalConstants.Download_BTN}
                                >
                                  <CLink
                                    className="btn  btn-md btn-primary"
                                    aria-current="page"
                                    to={`${file.file}`}
                                  >
                                    <CIcon name="cil-cloud-download"></CIcon>
                                    <h6>ID Number : {file.id_number}</h6>
                                    <h6>
                                      Expiration Date :{" "}
                                      {file.id_expiration_date}
                                    </h6>
                                  </CLink>
                                </CTooltip>
                              </td>
                            </tr>
                          ))}
                        {props.kycDetail.kyc_files?.length === 0 && (
                          <tr>
                            <td colSpan="3">No records found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CCardBody>
              )}
            </CCard>
          </CCol>
        </CRow>
        <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <h5>Kyc Reasons</h5>
              </CCardHeader>
              {isLoading ? (
                <CCol sm="6">
                  <b>&nbsp;Loading...</b>
                  <br />
                </CCol>
              ) : (
                <CCardBody>
                  <div className="position-relative table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Comment</th>
                          <th>Comment By</th>
                          <th>Created Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {props.kycDetail.kyc_reasons?.length > 0 &&
                          props.kycDetail.kyc_reasons.map(
                            (kyc_reason, index) => (
                              <tr key={index}>
                                <td>{kyc_reason.comment}</td>
                                <td>{capitalize(kyc_reason.comment_type)}</td>
                                <td>
                                  {moment(kyc_reason.created_at).format("LL")}
                                </td>
                              </tr>
                            )
                          )}
                        {props.kycDetail.kyc_reasons?.length === 0 && (
                          <tr>
                            <td colSpan="3">No records found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CCardBody>
              )}
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
      <CModal
        show={isKycModalOpen}
        onClose={() => {
          setKycModalOpen(!isKycModalOpen);
        }}
      >
        <CModalHeader closeButton>
          <CModalTitle>Change Status</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormGroup row>
            <CCol md="12">
              <CFormGroup>
                <CLabel htmlFor="menu_category">Status</CLabel>
                {/* value={props.kycDetail.status} */}
                <CSelect aria-label="Status" onChange={handleStatusChange}>
                  {/* <option value="pending">Pending</option> */}
                  <option>-- Select --</option>
                  <option value="approved">Approve</option>
                  <option value="rejected">Reject</option>
                </CSelect>
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="menu_category">Comment</CLabel>
                <CTextarea
                  type="text"
                  id="comment"
                  name="comment"
                  placeholder="Enter Comment"
                  autoComplete="comment "
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                />
              </CFormGroup>
            </CCol>
          </CFormGroup>
        </CModalBody>
        <CModalFooter>
          <CButton color="success" onClick={() => handleSubmit()}>
            Submit
          </CButton>
          <CButton
            color="secondary"
            onClick={() => {
              setKycModalOpen(!isKycModalOpen);
            }}
          >
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default KycDetailComponent;
