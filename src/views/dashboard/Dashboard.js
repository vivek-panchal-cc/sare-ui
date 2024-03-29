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
      total_kyc: 0,
      business_customer_total: 0,
      active_agents: 0,
      active_business: 0,
      active_individuals: 0,
      inactive_agents: 0,
      inactive_business: 0,
      inactive_individuals: 0,
      weekly_amount: 0,
      monthly_amount: 0,
      total_pending_rejected: 0,
      total_approved: 0,
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
          total_kyc: res.data.total_kyc,
          business_customer_total: res.data.total_business,
          active_agents: res.data.active_agents,
          active_business: res.data.active_business,
          active_individuals: res.data.active_individuals,
          inactive_agents: res.data.inactive_agents,
          inactive_business: res.data.inactive_business,
          inactive_individuals: res.data.inactive_individuals,
          weekly_amount: res.data.weekly_amount,
          monthly_amount: res.data.monthly_amount,
          total_pending_rejected: res.data.total_pending_rejected,
          total_approved: res.data.total_approved,
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
                  Individual Customers
                </CCardTitle>
                <CCardText>
                  <h4 className="dashboard-card-number">
                    {this.state.customer_total
                      ? this.state.customer_total
                      : "0"}
                  </h4>
                  <div className="dashboard-table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Active</th>
                          <th>Inactive</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="activeStatus">
                            {this.state.active_individuals
                              ? this.state.active_individuals
                              : "0"}
                          </td>
                          <td className="inactiveStatus">
                            {this.state.inactive_individuals
                              ? this.state.inactive_individuals
                              : "0"}
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
                <CCardTitle className="dashboard-card-title">Agents</CCardTitle>
                <CCardText>
                  <h4 className="dashboard-card-number">
                    {this.state.agent_total ? this.state.agent_total : "0"}
                  </h4>
                  <div className="dashboard-table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Active</th>
                          <th>Inactive</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="activeStatus">
                            {this.state.active_agents
                              ? this.state.active_agents
                              : "0"}
                          </td>
                          <td className="inactiveStatus">
                            {this.state.inactive_agents
                              ? this.state.inactive_agents
                              : "0"}
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
                  Business Customers
                </CCardTitle>
                <CCardText>
                  <h4 className="dashboard-card-number">
                    {this.state.business_customer_total
                      ? this.state.business_customer_total
                      : "0"}
                  </h4>
                  <div className="dashboard-table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Active</th>
                          <th>Inactive</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="activeStatus">
                            {this.state.active_business
                              ? this.state.active_business
                              : "0"}
                          </td>
                          <td className="inactiveStatus">
                            {this.state.inactive_business
                              ? this.state.inactive_business
                              : "0"}
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
                  Transactions
                </CCardTitle>
                <CCardText>
                  <h4 className="dashboard-card-number">
                    {/* {this.state.transaction_total ? this.state.transaction_total : "N/A"} */}
                  </h4>
                  <div
                    className="dashboard-table-container"
                    style={{ marginTop: "55px" }}
                  >
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Weekly Amount</th>
                          <th>Monthly Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ fontSize: "medium" }}>
                            {this.state.weekly_amount
                              ? this.state.weekly_amount
                              : "0"}
                          </td>
                          <td style={{ fontSize: "medium" }}>
                            {this.state.monthly_amount
                              ? this.state.monthly_amount
                              : "0"}
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
                  KYC Process
                </CCardTitle>
                <CCardText>
                  <h4 className="dashboard-card-number">
                    {this.state.total_kyc ? this.state.total_kyc : "0"}
                  </h4>
                  <div className="dashboard-table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Pending/Rejected</th>
                          <th>Approved</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ fontSize: "medium" }}>
                            {this.state.total_pending_rejected
                              ? this.state.total_pending_rejected
                              : "0"}
                          </td>
                          <td style={{ fontSize: "medium" }}>
                            {this.state.total_approved
                              ? this.state.total_approved
                              : "0"}
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
      </>
    );
  }
}

export default Dashboard;
