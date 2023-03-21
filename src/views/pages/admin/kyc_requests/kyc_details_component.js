import React, { useState } from 'react'
import './page.css'
import moment from 'moment'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CContainer, CCardFooter, CTooltip, CLink, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CFormGroup, CLabel, CInput, CFormText, CSelect, CTextarea } from '@coreui/react'
import ReactHtmlParser from 'react-html-parser';
import { capitalize } from '_helpers';
import { globalConstants } from '../../../../constants/admin/global.constants';
import { notify, history } from '../../../../_helpers/index';
import CIcon from '@coreui/icons-react';
import { kycRequestService } from '../../../../services/admin/kyc_request.service';

const KycDetailComponent = (props) => {
  const [isKycModalOpen, setKycModalOpen] = useState(false);
  const toggle = () => setKycModalOpen(!isKycModalOpen);
  // this.state = {
  //   _openPopup: false,
  // };

  const [comment, setComment] = useState('');
  const [status, setStatus] = useState(props.kycDetail.status);

  function handleSubmit() {
    kycRequestService.updateRequest(props.kycDetail.id, {
      admin_comment: comment,
      status: status
    }).then(res => {
      if (res.status) {
        notify.success(res.message);
        // window.location.reload();
        history.push('/admin/kyc_requests');
      } else {
        notify.error(res.message);
      }
    })
  }

  return (
    <>
      <CContainer fluid>
        <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                Kyc Details
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol sm="6">
                    <h6>Account Number : {props.kycDetail.account_number}</h6>
                    <h6>Name : {props.kycDetail.name}</h6>
                  </CCol>
                  <CCol sm="6">
                    <h6>Submission Date : {moment(props.kycDetail.createdAt).format('LL')}</h6>
                    <h6>Status : {capitalize(props.kycDetail.status)}</h6>
                    <CButton color="success" onClick={toggle} >
                      <CIcon name="cil-pencil" ></CIcon>
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
                Kyc Files
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
                      {props.kycDetail.kyc_files.length > 0 &&
                        props.kycDetail.kyc_files.map((file, index) => (
                          <tr key={index}>
                            <td>File name</td>
                            <td>
                              <CTooltip content={globalConstants.Download_BTN}>
                                <CLink className="btn  btn-md btn-primary" aria-current="page" to={`${file.file}`} >
                                  <CIcon name="cil-cloud-download"></CIcon>
                                </CLink>
                              </CTooltip>
                            </td>
                          </tr>
                        ))
                      }
                      {props.kycDetail.kyc_files.length === 0 && <tr><td colSpan='3'>No records found</td></tr>}
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
                Kyc Reasons
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
                      {props.kycDetail.kyc_reasons.length > 0 &&
                        props.kycDetail.kyc_reasons.map((kyc_reason, index) => (
                          <tr key={index}>
                            <td>{kyc_reason.comment}</td>
                            <td>{capitalize(kyc_reason.comment_type)}</td>
                            <td>{moment(kyc_reason.created_at).format('LL')}</td>
                          </tr>
                        ))
                      }
                      {props.kycDetail.kyc_reasons.length === 0 && <tr><td colSpan='3'>No records found</td></tr>}
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
        onClose={() => { setKycModalOpen(!isKycModalOpen) }}
      >
        <CModalHeader closeButton>
          <CModalTitle>Change Status</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormGroup row>
            <CCol md="12">
              <CFormGroup >
                <CLabel htmlFor="menu_category">Status</CLabel>
                <CSelect aria-label="Status" onChange={(e) => { setStatus(e.target.value) }} value={props.kycDetail.status}>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </CSelect>
              </CFormGroup>
              <CFormGroup >
                <CLabel htmlFor="menu_category">Comment</CLabel>
                <CTextarea type="text" id="comment" name="comment" placeholder="Enter Comment" autoComplete="comment " onChange={(e) => { setComment(e.target.value) }} />
              </CFormGroup>
            </CCol>
          </CFormGroup>
        </CModalBody>
        <CModalFooter>
          <CButton color="success" onClick={() => handleSubmit()} >Submit</CButton>
          <CButton color="secondary" onClick={() => { setKycModalOpen(!isKycModalOpen) }}>Cancel</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default KycDetailComponent
