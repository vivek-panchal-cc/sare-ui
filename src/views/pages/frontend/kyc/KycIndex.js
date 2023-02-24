import React, { useEffect, useState } from 'react'
import { kycService } from "../../../../services/frontend/kyc.service";
import { history } from "../../../../_helpers";

import { useParams, useRouteMatch } from 'react-router-dom';
import KycSuccess from './KycSuccess';
import KycValidate from './KycValidate';

function KycIndex() {
  const [kycData, setKycData] = useState({});
  const { params } = useParams();

  const match = useRouteMatch({
    path: "/kyc/:mobile",
    strict: true,
    sensitive: true
  });

  useEffect(() => {
    // this.props.match.params.cms_slug
    const data = kycService.getKycDetails('9876543210');
    // kycService.getKycDetails('9876543210').then(res => {
    //   // if (res.status === false) {
    //   //   history.push('/');
    //   // } else {
    //   //   this.setState({ cms_pages: res.data });
    //   // }
    // });
    setKycData(data);
  }, []);

  console.log("match", match);

  return (
    <>
      {
        (kycData?.data?.kyc_status === 'approved') ?
          <KycSuccess /> : <KycValidate />
      }
      {/* {kycData?.data?.kyc_status === 'approved' ? (
                <KycSuccess />
      ) : kycData?.data?.kyc_status === 'approved' ? (
              <Component2 />
            ) : (
              <Component3 />
            )} */}
    </>
  )
}
export default KycIndex;
