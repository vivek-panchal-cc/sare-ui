import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CardBody, CardTitle, Container } from "reactstrap";
import { kycService } from "../../../../services/frontend/kyc.service";
import { notify } from "../../../../_helpers/index";
import "../css/styles.css";
import kycStatus from "../img/kyc-status.svg";
import logo from "../img/logo.svg";
import KycFailure from "./KycFailure";
import KycForm from "./KycForm";
import KycSuccess from "./KycSuccess";

function KycChecking() {
  const [isLoading, setIsLoading] = useState(true);
  const [kycFormLoading, setKycFormLoading] = useState(false);
  const [isKycFailure, setIsKycFailure] = useState(false);
  const [kycReasons, setKycReasons] = useState([]);
  const [statusPendingApproval, setStatusPendingApproval] = useState(false);
  const [res, setRes] = useState({});
  const { mobile, secret_key } = useParams();

  useEffect(() => {
    window.history.pushState(null, null, window.location.href);
    window.history.replaceState({}, document.title, window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, null, window.location.href);
    };
    const timeoutId = setTimeout(() => {
      getKycDetails();
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  // notify.success message removed after Kyc Checking and redirecting to Kyc Form (Changes made by Vivek Panchal)
  // set state for KycSuccess form when status == pending_approval
  function getKycDetails() {
    setIsLoading(true);
    kycService
      .getKycDetails({
        kyc_token: mobile,
        mobile_key: secret_key,
      })
      .then((response) => {        
        let { success, message, data } = response;        
        // if (data?.kyc_files[0]?.file) {
        //   data.kyc_files[0].file = 'http://192.168.1.32/SARE/customer-onboard/storage/app/uploads/kyc-documents/1681113291_file (1).pdf';
        //   // data.kyc_files[0].file = 'http://192.168.1.32/SARE/customer-onboard/storage/app/uploads/kyc-documents/1681106148_file.jpeg';        
        // }
        if (!success) {
          notify.error(message);
        } else if (data.kyc_status === "pending") {
          setKycFormLoading(true);
        } else if (data.kyc_status === "rejected") {
          setKycReasons(data);
          setIsKycFailure(true);
          setIsLoading(false);
        } else if (data.kyc_status === "pending_approval") {          
          setIsLoading(false);
          setKycFormLoading(true);
          setStatusPendingApproval(true);
        }
        setRes(data);
      })
      .catch(() => {
        notify.error("Failed to fetch KYC details");
        setIsLoading(false);
      });
  }

  // if( isLoading && !kycFormLoading ){
  //   return (<form>
  //     <section className="main-section kyc-status-page">
  //       <div className="container">
  //         <div className="logo-part text-center">
  //           <img src={logo} alt="logo" className="mes-img" />
  //         </div>
  //         <div className="box text-center">
  //           <CardBody>
  //             <CardTitle className="sub-heading">
  //               <b>
  //                 Checking KYC <br />
  //                 Status
  //               </b>
  //             </CardTitle>
  //             <div className="loader-main">
  //               <div className="sub-loader" />
  //               <img
  //                 src={kycStatus}
  //                 alt="kycStatus"
  //                 className="status-img"
  //               />
  //             </div>
  //             <p className="light-blue">Please wait...</p>
  //           </CardBody>
  //         </div>
  //       </div>
  //     </section>
  //   </form>)
  // }

  // if (isLoading && kycFormLoading) {
  //   return (<KycForm props={{ res }} />)
  // }

  // if (!isLoading && isKycFailure) {    
  //   return (<KycFailure props={{ kycReasons }} />)
  // }

  // if (statusPendingApproval) {
  //    return (<KycSuccess />)
  // }

  return (
    <Container>
      {isLoading && !kycFormLoading ? (
        <form>
          <section className="main-section kyc-status-page">
            <div className="container">
              <div className="logo-part text-center">
                <img src={logo} alt="logo" className="mes-img" />
              </div>
              <div className="box text-center">
                <CardBody>
                  <CardTitle className="sub-heading">
                    <b>
                      Checking KYC <br />
                      Status
                    </b>
                  </CardTitle>
                  <div className="loader-main">
                    <div className="sub-loader" />
                    <img
                      src={kycStatus}
                      alt="kycStatus"
                      className="status-img"
                    />
                  </div>
                  <p className="light-blue">Please wait...</p>
                </CardBody>
              </div>
            </div>
          </section>
        </form>
      ) : isLoading && kycFormLoading ? (
        <KycForm props={{ res }} />
      ) : !isLoading && isKycFailure ? (
        <KycFailure props={{ kycReasons }} />
      ) : statusPendingApproval ? (
        <KycSuccess />
      ) : null}
    </Container>
  );
}

export default KycChecking;
