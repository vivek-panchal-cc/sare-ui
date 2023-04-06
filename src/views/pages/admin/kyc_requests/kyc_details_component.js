import React, { useState } from "react";
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

  return (
    <>
      <CContainer fluid>
        <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <h5>Kyc Details</h5>
              </CCardHeader>
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
                    <b>Phone Number :</b> {props.kycDetail.phone_number}
                  </CCol>
                  <CCol sm="6">
                    <b>Home Address :</b>{" "}
                    {props.kycDetail.house_number
                      ? props.kycDetail.house_number + ", "
                      : ""}
                    {props.kycDetail.street_name
                      ? props.kycDetail.street_name + ", "
                      : ""}
                    {props.kycDetail.landmark
                      ? props.kycDetail.landmark + ", "
                      : ""}
                    {props.kycDetail.city ? props.kycDetail.city + ", " : ""}
                    {props.kycDetail.pincode
                      ? props.kycDetail.pincode + ""
                      : ""}<br/>
                    <b>Submission Date :</b>{" "}
                    {moment(props.kycDetail.createdAt).format("LL")}
                    <br />
                    <b>Status:</b>{" "}
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
                  </CCol>
                  {/* <CCol sm="6">
                    <b>Phone Number :</b> {props.kycDetail.phone_number}
                  </CCol> */}
                  {/* <CCol sm="6">
                    <b>Submission Date :</b>{" "}
                    {moment(props.kycDetail.createdAt).format("LL")}<br/>
                    <b>Status:</b>{" "}
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
                  </CCol> */}
                  <CCol sm="6">
                    <CButton color="success" onClick={toggle}>
                      <CIcon name="cil-pencil"></CIcon>
                    </CButton>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <h5>Kyc Files</h5>
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
                            <td>File name</td>
                            <td>
                              <CTooltip content={globalConstants.Download_BTN}>
                                <CLink
                                  className="btn  btn-md btn-primary"
                                  aria-current="page"
                                  to={`${file.file}`}
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
                <h5>Kyc Reasons</h5>
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
                            <td>{kyc_reason.comment}</td>
                            <td>{capitalize(kyc_reason.comment_type)}</td>
                            <td>
                              {moment(kyc_reason.created_at).format("LL")}
                            </td>
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
