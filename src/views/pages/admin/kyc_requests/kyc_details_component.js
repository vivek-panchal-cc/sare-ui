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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import KYCDetailsPopup from "./kycDetailsPopup";
import ReactHtmlParser from "react-html-parser";
import { capitalize } from "_helpers";
import { globalConstants } from "../../../../constants/admin/global.constants";
import { notify, history } from "../../../../_helpers/index";
import CIcon from "@coreui/icons-react";
import { kycRequestService } from "../../../../services/admin/kyc_request.service";
import FileSaver, { saveAs } from "file-saver";
import "../customer/styles.css";

const KycDetailComponent = (props) => {
  const [isKycModalOpen, setKycModalOpen] = useState(false);
  const toggle = () => setKycModalOpen(!isKycModalOpen);

  const [isKYCPopupOpen, setKYCPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");
  const kycDetailId = props.kycDetail.id;

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

  function downloadFile(url) {
    if (url) {
      const urlArray = url.split("/");
      const fileName = urlArray[urlArray.length - 1];
      FileSaver.saveAs(url, fileName);
    }
  }

  let imageFile;
  if (props.kycDetail?.kyc_files?.length > 0) {
    const kycFile = props?.kycDetail?.kyc_files?.[0];
    if (kycFile && typeof kycFile.file == "string") {
      let img = kycFile.file?.split(".");
      if (img.length > 1) {
        imageFile = img.join(".").split("/").pop();
      } else {
        console.log("File name doesn't contain a period.");
      }
    }
  }

  return (
    <>
      {/* Changes in Label, Details and set pencil and eye Icon as required in status (By Vivek Panchal) */}
      <CContainer fluid>
        <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <strong>Kyc Details</strong>
                <div className="card-header-actions">
                  <CTooltip content={globalConstants.BACK_MSG}>
                    <CLink
                      className="btn btn-danger btn-sm"
                      aria-current="page"
                      to="/admin/kyc_requests"
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
                            <b>Account Number</b>
                          </td>
                          <td>{props.kycDetail.account_number}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Name</b>
                          </td>
                          <td>{props.kycDetail.name}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Email</b>
                          </td>
                          <td>{props.kycDetail.email}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Phone Number</b>
                          </td>
                          <td>{props.kycDetail.mobile_number}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Home Address</b>
                          </td>
                          <td>
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
                              ? props.kycDetail.pincode
                              : ""}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>Status</b>
                          </td>
                          <td>
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
                            {props.kycDetail.status === "pending_approval" && (
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
                            )}
                            {(props.kycDetail.status === "approved" ||
                              props.kycDetail.status === "rejected") && (
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
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
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
            </CCard>
          </CCol>
        </CRow>

        <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <strong>Kyc Files</strong>
              </CCardHeader>
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
                            <td>{imageFile}</td>
                            <td>
                              <CTooltip content={globalConstants.Download_BTN}>
                                <CLink
                                  className="btn  btn-md btn-primary"
                                  aria-current="page"
                                  // href={`${file.file}`}
                                  onClick={() => downloadFile(file.file)}
                                >
                                  <CIcon name="cil-cloud-download"></CIcon>
                                  <h6>ID Number : {file.id_number}</h6>
                                  <h6>
                                    Expiration Date : {file.id_expiration_date}
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
            </CCard>
          </CCol>
        </CRow>
        <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <strong>Kyc Reasons</strong>
              </CCardHeader>
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
                        props.kycDetail.kyc_reasons.map((kyc_reason, index) => (
                          <tr key={index}>
                            <td>
                              {kyc_reason.comment ? kyc_reason.comment : "N/A"}
                            </td>
                            <td>{capitalize(kyc_reason.comment_type)}</td>
                            <td>{kyc_reason.created_at}</td>
                          </tr>
                        ))}
                      {props.kycDetail.kyc_reasons?.length === 0 && (
                        <tr>
                          <td colSpan="3">No records found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CCardBody>
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
