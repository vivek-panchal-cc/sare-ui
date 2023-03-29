import { Container, Row, CardBody, CardTitle, Button } from "reactstrap";
import { useParams } from "react-router-dom";
import logo from "../img/logo.svg";
import review from "../img/reviewe.svg";
import "../css/styles.css";

function KycRecieved() {
  const { mobile, secret_key } = useParams();

  return (
    <>
      <Container>
        <form>
          <section className="main-section">
            <div className="container">
              <div className="logo-part text-center">
                <img src={logo} alt="logo" className="mes-img"></img>
              </div>
              <div className="box text-center">
                <CardBody>
                  <CardTitle className="sub-heading">
                    <b>Your KYC has been received and will be reviewed.</b>
                  </CardTitle>
                  <Row className="kyc-received-img">
                    <img src={review} alt="review" className="reviewe-img" />
                  </Row>
                  <Row>
                    <p className="light-blue">
                      Please come back later to check status of KYC. It will
                      take about XX amount of time to complete.
                    </p>
                  </Row>
                  <Button className="btn-design" color="info">
                    Open
                  </Button>
                </CardBody>
              </div>
            </div>
          </section>
        </form>
      </Container>
    </>
  );
}
export default KycRecieved;
