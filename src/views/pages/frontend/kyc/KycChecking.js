import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CardBody, CardTitle, Container } from "reactstrap";
import { kycService } from "../../../../services/frontend/kyc.service";
import { history, notify, setLoading } from "../../../../_helpers/index";
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
  const { mobile, secret_key } = useParams();
  const [kycFormLoading, setKycFormLoading] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getKycDetails();
      setKycFormLoading(true);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  function getKycDetails() {
    setIsLoading(true);
    kycService
      .getKycDetails({
        kyc_token: mobile,
        mobile_key: secret_key,
      })
      .then((res) => {
        if (res.status === false) {
          notify.error(res.message);
          history.push("/kyc/failure");
        } else {
        }
        // setIsLoading(false);
      });
  }

  return (
    <>
      <Container>
        {isLoading && !kycFormLoading ? (
          // Render loader if isLoading is true
          <form>
            <section className="main-section">
              <div className="container">
                <div className="logo-part text-center">
                  <img src={logo} alt="logo" className="mes-img"></img>
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
                      <div className="sub-loader"></div>
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
        ) : !isLoading && kycFormLoading ? (
          <>
            <KycForm />
          </>
        ) : (
          <>
            <KycFailure />
          </>
        )}
      </Container>
    </>
  );
}

export default KycChecking;
