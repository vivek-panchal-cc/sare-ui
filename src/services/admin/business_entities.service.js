import {
  authHeader,
  notify,
  handleResponse,
  setLoading,
  authHeaderFile,
} from "../../_helpers";
require("dotenv").config();

export const businessEntitiesService = {
  getBusinessEntitiesList,
  getBusinessEntitiesDetails,
  updateBusinessEntitiesDetails,
  deleteBusinessEntity,
  changeBusinessEntityStatus,
  createBusinessEntity,
  frontBusinessEntitiesList,
};

async function getBusinessEntitiesList(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("business_entities", "view"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/business-entities`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
  }
  return handleResponse(response);
}

async function getBusinessEntitiesDetails(id) {
  setLoading(true);
  const requestOptions = {
    method: "GET",
    headers: authHeader("business_entities", "view"),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/business-entities/${id}`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function updateBusinessEntitiesDetails(postData, id) {
  console.log("postData", postData);
  console.log("id", id);
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeaderFile("business_entities", "update"),
    body: postData,
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/business-entities/${id}`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function deleteBusinessEntity(id) {
  setLoading(true);
  const requestOptions = {
    method: "DELETE",
    headers: authHeader("business_entities", "delete"),
  };
  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/business-entities/${id}`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function changeBusinessEntityStatus(id, postData) {
  setLoading(true);
  const requestOptions = {
    method: "PUT",
    headers: authHeader("business_entities", "edit"),
    body: JSON.stringify(postData),
  };
  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/business-entities/${id}/change-status`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function createBusinessEntity(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeaderFile("business_entities", "create"),
    body: postData,
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/business-entities/add`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    const response = undefined;
  }
  return handleResponse(response);
}

async function frontBusinessEntitiesList(postData) {
  setLoading(true);
  const requestOptions = {
    method: "GET",
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_KYC_API}business-entities`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
  }
  return handleResponse(response);
}
