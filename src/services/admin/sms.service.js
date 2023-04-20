import { authHeader, authHeaderFile, frontHeader } from "../../_helpers";
import { notify, handleResponse, setLoading } from "../../_helpers/";
require("dotenv").config();

export const smsService = {
  getSmsTemplates,
  changeSmsStatus,
  createSms,
  getSmsDetails,
  updateSmsTemplates,
  deleteSmsTemplate,
};

async function getSmsTemplates(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("sms_templates", "view"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/templates/sms`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    const response = undefined;
  }
  return handleResponse(response);
}

async function changeSmsStatus(id, postData) {
  setLoading(true);
  const requestOptions = {
    method: "PUT",
    headers: authHeader("sms_templates", "edit"),
    body: JSON.stringify(postData),
  };
  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/templates/sms/${id}/change-status`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function createSms(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("sms_templates", "create"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/templates/sms/add`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    const response = undefined;
  }
  return handleResponse(response);
}

async function getSmsDetails(id) {
  setLoading(true);
  const requestOptions = {
    method: "GET",
    headers: authHeader("sms_templates", "view"),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/templates/sms/${id}`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function updateSmsTemplates(postData) {  
  setLoading(true);
  const requestOptions = {
    method: "PUT",
    headers: authHeader("sms_templates", "update"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/templates/sms/${postData.id}`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function deleteSmsTemplate(id) {
  setLoading(true);
  const requestOptions = {
    method: "DELETE",
    headers: authHeader("sms_templates", "delete"),
  };
  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/templates/sms/${id}`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}
