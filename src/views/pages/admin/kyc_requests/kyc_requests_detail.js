

import React from 'react'
import { notify } from '../../../../_helpers';
import { kycRequestService } from '../../../../services/admin'
import KycDetailComponent from './kyc_details_component';
class Kyc_Requests_Detail extends React.Component {

  /*********** Define Initial Satte ****************/

  state = {
    kycDetail: [],
    id: this.props.match.params.id  // Getting Id From Url
  };

  /************ Retrieve Api very first time component render to Dom ******************/
  componentDidMount() {

    this.getDetailview();
  }

  /************ Define Function for retrieving Record for display particular post  ******************/
  getDetailview() {
    kycRequestService.detailview(this.state.id).then(res => {
      if (res.status === false) {
        notify.error(res.message);
      } else {
        this.setState({ kycDetail: res.data });
      }
    });
  }
  /****************************** Render Data To Dom ***************************************/

  render() {
    return (
      <div>
        {
          <KycDetailComponent kycDetail={this.state.kycDetail} />
          // this.state.kycDetail.map(kycDetail => {
          //   return <KycDetailComponent kycDetail={kycDetail} />
          // })
        }
      </div>
    )
  }
}
export default Kyc_Requests_Detail;
