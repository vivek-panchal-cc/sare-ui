import React from "react";
import { notify, history } from "../../../../_helpers";
import { agentService } from "../../../../services/admin";
import AgentComponents from "./Agent_Components";
import "../../../../scss/Draft.css";

class AgentDetails extends React.Component {
  state = {
    agentDetails: [],
    agent: [],
    page: [],
    totalPage: [],
    id: this.props.match.params.id,
  };

  componentDidMount() {
    this.getAgentDetailsView();
    this.getAgentDetails();
  }

  // Fetching transaction details of an Agent.
  getAgentDetailsView() {
    agentService.agentDetailsView(this.state.id).then((res) => {
      if (res.success === false) {
        notify.error(res.message);
        history.push("/admin/agents");
      } else {
        this.setState({
          agentDetails: res.data.result,
          page: res.data.page,
          totalPage: res.data.totalPage,
        });
      }
    });
  }

  // Fetching Agent details.
  getAgentDetails() {
    agentService.getAgentDetails(this.state.id).then((res) => {
      if (res.success === false) {
        notify.error(res.message);
      } else {
        if (res.data == null) {
          notify.error("Agent not found");
          history.push("/admin/agents");
        } else {
          this.setState({
            agent: res.data.personal_details,
          });
        }
      }
    });
  }

  render() {
    return (
      <div>
        {
          <AgentComponents
            agent={this.state.agent}
            agentDetails={this.state.agentDetails}
            page={this.state.page}
            totalPage={this.state.totalPage}
          />
        }
      </div>
    );
  }
}
export default AgentDetails;
