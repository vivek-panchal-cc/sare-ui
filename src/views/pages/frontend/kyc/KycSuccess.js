import React from 'react'
import { Container, Row, Col, Card, CardBody, CardTitle } from "reactstrap";

function KycSuccess() {
  return (
    <>
      <div className="section text-center">
        <Container>
          <div className="text-center">
            <Card className='col-md-6 offset-md-3'>
              <CardBody>
                <CardTitle>Kyc verified</CardTitle>
                <CardBody>
                  <br />
                  <Row className='text-center'>
                    <Col md="6" className='offset-md-3'>
                      <p><strong>Your KYC process is complete, <br />Please contine with the SARE app/USSD service. </strong></p>
                    </Col>
                  </Row>
                  <br />
                </CardBody>
              </CardBody>
            </Card>
          </div>
        </Container>
      </div>
    </>
  )
}
export default KycSuccess;
