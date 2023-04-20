import { authHeader, authHeaderFile, frontHeader } from "../../_helpers";
import { notify, handleResponse, setLoading } from "../../_helpers/";
require("dotenv").config();

export const faqService = {
  getFaq,
//   changeSmsStatus,
  createFaq,
  getFaqDetails,
  updateFaq,
  deleteFaq,
  changeFaqStatus
};

async function getFaq(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("faqs", "view"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/faq/index`,
      requestOptions
    );    
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    const response = undefined;
  }
  return handleResponse(response);
}

async function createFaq(postData) {  
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("faqs", "create"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/faq/add`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    const response = undefined;
  }
  return handleResponse(response);
}

async function getFaqDetails(id) {  
  setLoading(true);
  const requestOptions = {
    method: "GET",
    headers: authHeader("faqs", "view"),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/faq/${id}`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function updateFaq(postData) {  
  setLoading(true);
  const requestOptions = {
    method: "PUT",
    headers: authHeader("faqs", "update"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/faq/${postData.id}`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function deleteFaq(id) {
  setLoading(true);
  const requestOptions = {
    method: "DELETE",
    headers: authHeader("faqs", "delete"),
  };
  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/faq/${id}`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function changeFaqStatus(id, postData) {
  setLoading(true);
  const requestOptions = {
    method: "PUT",
    headers: authHeader("faqs", "edit"),
    body: JSON.stringify(postData),
  };
  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/faq/${id}/change-status`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}