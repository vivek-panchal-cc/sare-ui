import { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { cmsPagesService } from "../../../../services/frontend/cms_pages.service";
import { useHistory, useParams } from "react-router-dom";
import { history } from "../../../../_helpers/index";
import "../css/styles.css";
import logo from "../img/logo.svg";

function TermConditions() {
    const [cmsPages, setCmsPages] = useState({});
    const history = useHistory();
    const { cms_slug } = useParams();
  
    useEffect(() => {
      cmsPagesService.getCmsPage("term-conditions").then((res) => {
        if (res.status === false) {
          history.push("/");
        } else {
          setCmsPages(res.data);
        }
      });
    }, [history]);

  return (
    <>
    {console.log("cmsPages", cmsPages)}
      <Container>
        <form>
          <section >
            <div className="container">
              <div className="logo-part text-center">
                <img src={logo} alt="logo" className="mes-img"></img>
              </div>
              <div className="terms">
              <h2 className="title">{cmsPages.title}</h2>
              <div
                className="post__content"
                dangerouslySetInnerHTML={{
                  __html: cmsPages.content,
                }}
              ></div>
              </div>
            </div>
          </section>
        </form>
      </Container>
    </>
  );
}

export default TermConditions;
