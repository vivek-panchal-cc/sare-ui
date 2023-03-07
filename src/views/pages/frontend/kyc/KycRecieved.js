import React from 'react'
import { Container, Row, Col, Card, CardBody, CardTitle } from "reactstrap";

function KycRecieved() {
  return (
    <>
      <div className="section text-center">
        <Container>
          <div className="text-center">
            <Card className='col-md-6 offset-md-3 my-2'>
              <CardBody>
                <CardTitle><b>KYC Recieved successfully.</b></CardTitle>
                <CardBody>
                  <br />
                  <Row className='text-center'>
                    <Col md="6" className='offset-md-3'>
                      <p><strong>Your KYC has been received and will be reviewed. </strong></p>
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
export default KycRecieved;
