import { CButton, CCard, CCardBody, CCardText, CCardTitle, CCol, CRow, CWidgetStatsF } from '@coreui/react';
import React from 'react';
import { dashboardService } from "../../services/admin/dashboard.service";
import { notify, history, _canAccess } from '../../_helpers/index';




class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      customer_total: 0,
      agent_total: 0,
      transaction_total: 0,
      pending_kyc_total: 0,
    };
  }

  componentDidMount() {
    if (this.props.location.state !== undefined && this.props.location.state !== null) {
      window.history.replaceState('page', '');
      setTimeout(() => {
        window.location.reload();
      }, 700);

    }

    this.getDashboardDetails();
  }

  getDashboardDetails() {
    dashboardService.getDetails().then(res => {
      console.log("dashboard", res);
      if (res.status === false) {
        notify.error(res.message);
      } else {
        this.setState({
          customer_total: res.data.customer_total,
          agent_total: res.data.agent_total,
          transaction_total: res.data.transaction_total,
          pending_kyc_total: res.data.pending_kyc_total
        });
      }
    });
  }


  render() {
    return (
      <>
        <CRow>
          <CCol sm={3}>
            <CCard className="text-center">
              <CCardBody>
                <CCardTitle>Total Registered Customer</CCardTitle>
                <CCardText>
                  <h4>{this.state.customer_total}</h4>
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol sm={3}>
            <CCard className="text-center">
              <CCardBody>
                <CCardTitle>Total Registered Agent</CCardTitle>
                <CCardText>
                  <h4>{this.state.agent_total}</h4>
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol sm={3}>
            <CCard className="text-center">
              <CCardBody>
                <CCardTitle>Last Week / Month Transaction</CCardTitle>
                <CCardText>
                  <h4>{this.state.transaction_total}</h4>
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol sm={3}>
            <CCard className="text-center">
              <CCardBody>
                <CCardTitle>Pending KYC Process</CCardTitle>
                <CCardText>
                  <h4>{this.state.pending_kyc_total}</h4>
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    );
  }
}

export default Dashboard
