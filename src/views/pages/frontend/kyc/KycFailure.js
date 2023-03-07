import React from 'react'
import { Container, Row, Col, Card, CardBody, CardTitle } from "reactstrap";

function KycFailure() {
  return (
    <>
      <div className="section text-center">
        <Container>
          <div className="text-center">
            <Card className='col-md-6 offset-md-3'>
              <CardBody>
                <CardTitle>Something went wrong</CardTitle>
                <CardBody>
                  <br />
                  <Row className='text-center'>
                    <Col md="6" className='offset-md-3'>
                      <p><strong>Something went wrong, <br />Please try again later. </strong></p>
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
export default KycFailure;
