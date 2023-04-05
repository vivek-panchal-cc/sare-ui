import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, CardBody, Form, CardTitle } from "reactstrap";
import logo from "../img/logo.svg";
import kycfail from "../img/kycfail.svg";
import "../css/styles.css";

const Error404 = () => {
  return (
    <>
      <Container>
        <form>
          <section className="main-section">
            <div className="container">
              <div className="logo-part text-center">
                <img src={logo} alt="logo" className="mes-img" />
              </div>
              <div className="box text-center">
                <CardBody>
                  <CardTitle className="sub-heading">
                    <p className="error-heading">
                      <b>404 Error</b>
                    </p>
                  </CardTitle>
                  <div className="complete-part" style={{ marginTop: "50px" }}>
                    <img src={kycfail} alt="kycfail" className="complete-img" />
                  </div>
                  <p
                    className="sub-heading"
                    style={{ marginTop: "50px", color: "red" }}
                  >
                    Oops!
                    <br />
                    The page you're looking for doesn't exist.
                  </p>
                </CardBody>
              </div>
            </div>
          </section>
        </form>
      </Container>
    </>
  );
};

export default Error404;
