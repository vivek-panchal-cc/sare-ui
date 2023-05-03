import { authHeader } from "../../_helpers";
import { notify, handleResponse, setLoading } from "../../_helpers/";
require("dotenv").config();

/*************** Export Functions Defined For Services ******************************/

export const pageService = {
  getPageList,
  createPages,
  deletePage,
  getPage,
  updatePage,
  detailView,
  changePageStatus,
  deleteMultiplePages,
  changeBulkPageStatus,
};

/*********************  Get List of All Pages from Database By - vivek bisht  *****************************/

async function getPageList(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("cms_pages", "view"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/cms_pages/index`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(true);
    const response = undefined;
  }
  return handleResponse(response);
}

/**************************  For creating Page Transfer Data to backend By -Vivek Bisht *********************/

async function createPages(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("cms_pages", "create"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/cms_pages/add`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(true);
    const response = undefined;
  }
  return handleResponse(response);
}

/******************** Retrieve Delete Api From Server *************************/
async function deletePage(id) {
  setLoading(true);
  const requestOptions = {
    method: "DELETE",
    headers: authHeader("cms_pages", "view"),
  };
  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/cms_pages/${id}`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

/****************** Retrieve Single Record From Server ************************/

async function getPage(id) {
  setLoading(true);
  const requestOptions = {
    method: "GET",
    headers: authHeader("cms_pages", "view"),
  };

  let response;
    try {
        response = await fetch(
            `${process.env.REACT_APP_API_URL}api/cms_pages/${id}`,
            requestOptions
        );
    } catch (error) {
        notify.error("Something went wrong");
        setLoading(false);
        response = await Promise.reject();
    }
    return handleResponse(response);
}

/***********************  Retrive Api For Update from server  *****************************/

async function updatePage(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("cms_pages", "update"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/cms_pages/edit`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

/********************** Retrieve Api for Detail view of Post from server   *****************************/
async function detailView(id) {
  setLoading(true);
  const requestOptions = {
    method: "GET",
    headers: authHeader("cms_pages", "view"),
  };
  let response;
    try {
        response = await fetch(
            `${process.env.REACT_APP_API_URL}api/cms_pages/${id}`,
            requestOptions
        );
    } catch (error) {
        notify.error("Something went wrong");
        setLoading(false);
        response = await Promise.reject();
    }
    return handleResponse(response);
}

async function changePageStatus(id, postData) {
  setLoading(true);
  const requestOptions = {
    method: "PUT",
    headers: authHeader("cms_pages", "edit"),
    body: JSON.stringify(postData),
  };
  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/cms_pages/${id}`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function deleteMultiplePages(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("cms_pages", "delete"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/delete_multiple_pages`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function changeBulkPageStatus(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("users", "update"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/cms_pages/change_bulk_page_status`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}
