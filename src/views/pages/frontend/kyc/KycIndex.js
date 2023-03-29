import { useEffect, useState } from "react";
import { kycService } from "../../../../services/frontend/kyc.service";
import { notify } from "../../../../_helpers/index";
import { useParams, useHistory } from "react-router-dom";
import KycSuccess from "./KycSuccess";
import KycValidate from "./KycValidate";

function KycIndex() {
  const [showKycSuccess, setKycSuccess] = useState(false);
  const { params } = useParams();
  const [kycToken, setKycToken] = useState("");
  const history = useHistory();
  const { mobile } = useParams();

  useEffect(() => {
    kycService
      .checkStatus({
        kyc_token: mobile,
      })
      .then((res) => {
        if (res.status === false) {
          history.push("/kyc/failure");
          // notify.error(res.message);
        } else {
          if (res.data.proceed_to_otp === true && res.success) {
            notify.success(res.message);
            setKycSuccess(true);
          } else {
            setKycSuccess(false);
          }
        }
      });
  }, []);

  return <>{showKycSuccess ? <KycValidate /> : <KycSuccess />}</>;
}
export default KycIndex;
