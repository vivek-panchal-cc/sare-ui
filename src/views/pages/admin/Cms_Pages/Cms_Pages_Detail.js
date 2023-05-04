import React from "react";
import { notify } from "../../../../_helpers";
import { pageService } from "../../../../services/admin";
import FullPage from "./Cms_Pages_FullPost";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CContainer,
  CTooltip,
  CLink,
} from "@coreui/react";
import { globalConstants } from "../../../../constants/admin/global.constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
class DetailView extends React.Component {
  /*********** Define Initial State ****************/

  state = {
    pages: [],
    id: this.props.match.params.id, // Getting Id From Url
  };

  /************ Retrieve Api very first time component render to Dom ******************/
  componentDidMount() {
    this.getDetailView();
  }

  /************ Define Function for retrieving Record for display particular post  ******************/
  getDetailView() {
    pageService.detailView(this.state.id).then((res) => {
      if (res.status === false) {
        notify.error(res.message);
      } else {
        this.setState({
          pages: [res?.data],
        });
      }
    });
  }
  /****************************** Render Data To Dom ***************************************/

  render() {
    return (
      <>
        <CContainer fluid>
          <CRow>
            <CCol sm="12">
              <CCard>
                <CCardHeader>
                  <div className="card-header-actions">
                    <CTooltip content={globalConstants.BACK_MSG}>
                      <CLink
                        className="btn btn-danger btn-sm"
                        aria-current="page"
                        to="/admin/cms_pages"
                      >
                        {" "}
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                        Back
                      </CLink>
                    </CTooltip>
                  </div>
                </CCardHeader>
                <CCardBody>
                  {this.state.pages.map((blog) => {
                    return (
                      <FullPage
                        title={blog.title}
                        key={blog._id}
                        date={blog.createdAt}
                        body={blog.content}
                        desc={blog.meta_desc}
                        meta_title={blog.meta_title}
                      />
                    );
                  })}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </>
    );
  }
}
export default DetailView;
