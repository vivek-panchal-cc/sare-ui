import { Container, Row, CardBody, CardTitle, Button, Form } from "reactstrap";
import logo from "../img/logo.svg";
import review from "../img/reviewe.svg";
import "../css/styles.css";

function KycRecieved() {
  const handleSubmit = () => {
    const link = process.env.REACT_APP_ANDROID_APP_URL;    
    window.open(link, "_blank");
  };

  return (
    <>
      <Container>
        <Form>
          <section className="main-section kyc-status-page">
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
                    <p className="light-blue">
                      Please come back later to check KYC status.
                    </p>                  
                  <Button
                    onClick={handleSubmit}
                    className="btn-design"
                    color="info"
                  >
                    Open
                  </Button>
                </CardBody>
              </div>
            </div>
          </section>
        </Form>
      </Container>
    </>
  );
}
export default KycRecieved;
