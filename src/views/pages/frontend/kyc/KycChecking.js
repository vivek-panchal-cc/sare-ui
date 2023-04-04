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

function KycChecking() {
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [maxUploadFiles, setMaxUploadFiles] = useState(0);
  const [remainingUploadFiles, setRemainingUploadFiles] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [kycFormLoading, setKycFormLoading] = useState(false);
  const [kycReasons, setKycReasons] = useState([]);
  const [res, setRes] = useState({});
  const { mobile, secret_key } = useParams();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getKycDetails();
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  // notify.success message removed after Kyc Checking and redirecting to Kyc Form (Changes made by Vivek Panchal)
  function getKycDetails() {
    setIsLoading(true);
    kycService
      .getKycDetails({
        kyc_token: mobile,
        mobile_key: secret_key,
      })
      .then((response) => {
        const { success, message, data } = response;
        if (!success) {
          notify.error(message);
        } else if (data.kyc_status === "pending") {
          // notify.success(message);
          setKycFormLoading(true);
        } else if (data.kyc_status === "rejected") {
          // notify.success(message);
          setKycReasons(data);
          setIsLoading(false);
        }
        setRes(data);
      })
      .catch(() => {
        notify.error("Failed to fetch KYC details");
        setIsLoading(false);
      });
  }

  return (
    <Container>
      {isLoading && !kycFormLoading ? (
        <form>
          <section className="main-section">
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
                  <p className="light-blue" style={{ marginBottom: "-10px" }}>
                    Please wait...
                  </p>
                </CardBody>
              </div>
            </div>
          </section>
        </form>
      ) : isLoading && kycFormLoading ? (
        <KycForm props={{ res }} />
      ) : !isLoading ? (
        <KycFailure props={{ kycReasons }} />
      ) : null}
    </Container>
  );
}

export default KycChecking;
