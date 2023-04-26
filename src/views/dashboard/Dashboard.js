import {
  CButton,
  CCard,
  CCardBody,
  CCardText,
  CCardTitle,
  CCol,
  CRow,
  CWidgetStatsF,
} from "@coreui/react";
import React from "react";
import { dashboardService } from "../../services/admin/dashboard.service";
import { notify, history, _canAccess } from "../../_helpers/index";
import "./dashboard.css";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customer_total: 0,
      agent_total: 0,
      transaction_total: 0,
      pending_kyc_total: 0,
      business_customer_total: 0,
      active_agents: 0,
      active_business: 0,
      active_individuals: 0,
      inactive_agents: 0,
      inactive_business: 0,
      inactive_individuals: 0,
    };
  }

  componentDidMount() {
    if (
      this.props.location.state !== undefined &&
      this.props.location.state !== null
    ) {
      window.history.replaceState("page", "");
      setTimeout(() => {
        window.location.reload();
      }, 700);
    }

    this.getDashboardDetails();
  }

  getDashboardDetails() {
    dashboardService.getDetails().then((res) => {
      if (res.status === false) {
        notify.error(res.message);
      } else {
        this.setState({
          customer_total: res.data.total_individuals,
          agent_total: res.data.total_agents,
          transaction_total: res.data.transaction_total,
          pending_kyc_total: res.data.pending_kyc_total,
          business_customer_total: res.data.total_business,
          active_agents: res.data.active_agents,
          active_business: res.data.active_business,
          active_individuals: res.data.active_individuals,
          inactive_agents: res.data.inactive_agents,
          inactive_business: res.data.inactive_business,
          inactive_individuals: res.data.inactive_individuals,
        });
      }
    });
  }

  render() {
    return (
      <>
        <CRow>
          <CCol sm={4}>
            <CCard className="dashboard-card">
              <CCardBody>
                <CCardTitle className="dashboard-card-title">
                  Total Individual Users
                </CCardTitle>
                <CCardText>
                  <h4 className="dashboard-card-number">
                    {this.state.customer_total}
                  </h4>
                  <div className="dashboard-table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Active</th>
                          <th>Deactive</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="activeStatus">
                            {this.state.active_individuals}
                          </td>
                          <td className="inactiveStatus">
                            {this.state.inactive_individuals}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol sm={4}>
            <CCard className="dashboard-card">
              <CCardBody>
                <CCardTitle className="dashboard-card-title">
                  Total Registered Agents
                </CCardTitle>
                <CCardText>
                  <h4 className="dashboard-card-number">
                    {this.state.agent_total}
                  </h4>
                  <div className="dashboard-table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Active</th>
                          <th>Deactive</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="activeStatus">
                            {this.state.active_agents}
                          </td>
                          <td className="inactiveStatus">
                            {this.state.inactive_agents}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol sm={4}>
            <CCard className="dashboard-card">
              <CCardBody>
                <CCardTitle
                  className="dashboard-card-title"
                  style={{ fontSize: "22px" }}
                >
                  Total Customers Business
                </CCardTitle>
                <CCardText>
                  <h4 className="dashboard-card-number">
                    {this.state.business_customer_total}
                  </h4>
                  <div className="dashboard-table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Active</th>
                          <th>Deactive</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="activeStatus">
                            {this.state.active_business}
                          </td>
                          <td className="inactiveStatus">
                            {this.state.inactive_business}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CRow>
          <CCol sm={4}>
            <CCard className="dashboard-card">
              <CCardBody>
                <CCardTitle className="dashboard-card-title">
                  Last Week / Month Transaction
                </CCardTitle>
                <CCardText>
                  <h4 className="dashboard-card-number">
                    {this.state.transaction_total}
                  </h4>
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol sm={4}>
            <CCard className="dashboard-card">
              <CCardBody>
                <CCardTitle className="dashboard-card-title">
                  Pending KYC <br /> Process
                </CCardTitle>
                <CCardText>
                  <h4 className="dashboard-card-number">
                    {this.state.pending_kyc_total}
                  </h4>
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    );
  }
}

export default Dashboard;
