import React from "react";
import { notify, history } from "../../../../_helpers";
import { customerService } from "../../../../services/admin";
import CustomerComponent from "./Customer_Components";
import "../../../../scss/Draft.css";

class CustomerDetails extends React.Component {
  state = {    
    customer: [],
    id: this.props.match.params.id,
  };

  componentDidMount() {   
    this.getCustomerDetails();
  }  
  
  getCustomerDetails() {
    customerService.getCustomerDetails(this.state.id).then((res) => {      
      if (res.success === false) {
        notify.error(res.message);
      } else {
        if (res.data == null) {
          notify.error("Customer not found");
          history.push("/admin/customers");
        } else {
          this.setState({
            customer: res.data,
          });
        }
      }
    });
  }

  render() {
    return (
      <div>
        {
          <CustomerComponent
          customer={this.state.customer}            
          />
        }
      </div>
    );
  }
}
export default CustomerDetails;
