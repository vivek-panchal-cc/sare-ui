import React from 'react'
import './page.css'
import moment from 'moment'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CContainer, CCardFooter, CTooltip, CLink, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react'
import ReactHtmlParser from 'react-html-parser';
import { capitalize } from '_helpers';
import { globalConstants } from '../../../../constants/admin/global.constants';
import CIcon from '@coreui/icons-react';

const KycDetailComponent = (props) => {
  // this.state = {
  //   _openPopup: false,
  // };
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
                    <h6>Status : {capitalize(props.kycDetail.status)}</h6><CIcon name="cil-pencil"></CIcon>
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
      {/* <CModal
        show={this.state._openPopup}
        onClose={() => { this.setState({ _openPopup: !this.state._openPopup }) }}
        color="danger"
      >
        <CModalHeader closeButton>
          <CModalTitle>Delete Page</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete this record?
        </CModalBody>
        <CModalFooter> */}
          {/* <CButton color="danger" onClick={() => this.deleteUser()} >Delete</CButton>
          <CButton color="secondary" onClick={() => { this.setState({ _openPopup: !this.state._openPopup }) }}>Cancel</CButton> */}
        {/* </CModalFooter>
      </CModal> */}
    </>
  )
}

export default KycDetailComponent
