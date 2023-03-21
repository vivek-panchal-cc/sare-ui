import React, { useEffect, useState } from 'react'
import { kycService } from "../../../../services/frontend/kyc.service";
import { notify, history, _canAccess } from '../../../../_helpers/index';

import { useParams, useRouteMatch } from 'react-router-dom';
import KycSuccess from './KycSuccess';
import KycValidate from './KycValidate';

function KycIndex() {
  const [showKycSuccess, setKycSuccess] = useState('');
  const { params } = useParams();
  const [mobile, setMobile] = useState('');

  const urlData = useRouteMatch({
    path: "/kyc/:mobile",
    strict: true,
    sensitive: true
  });

  useEffect(() => {
    setMobile(urlData.params.mobile);

    kycService.checkStatus({
      'mobile_number': urlData.params.mobile
    }).then(res => {
      if (res.status === false) {
        history.push("/kyc/failure");
        // notify.error(res.message);
      } else {
        if (res.data.proceed_to_otp) {
          notify.success(res.message);
        } else {
          setKycSuccess(true);
        }
        // history.push('/admin/banner_management');
      }
    });
  }, []);

  return (
    <>
      {
        showKycSuccess ?
          <KycSuccess /> : <KycValidate />
      }
    </>
  )
}
export default KycIndex;
