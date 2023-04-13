import { authHeader, authHeaderFile } from "../../_helpers";
import { notify, handleResponse, setLoading } from "../../_helpers";
require("dotenv").config();

export const agentService = {
  getAgentsList,
  getAgentDetails,
  updateAgentDetails,
  deleteAgent,
  changeBulkAgentsStatus,
  deleteMultipleAgents,
  changeAgentStatus,
};

async function getAgentsList(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("agents", "view"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/agents`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    const response = undefined;
  }
  return handleResponse(response);
}

async function getAgentDetails(id) {
  setLoading(true);
  const requestOptions = {
    method: "GET",
    headers: authHeader("agents", "view"),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/agents/${id}`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function updateAgentDetails(postData, custId) {
  setLoading(true);
  const requestOptions = {
    method: "PUT",
    headers: authHeaderFile("agents", "update"),
    body: postData,
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/agents/${custId}`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function deleteAgent(id) {
  setLoading(true);
  const requestOptions = {
    method: "DELETE",
    headers: authHeader("agents", "delete"),
  };
  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/agents/${id}`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function changeBulkAgentsStatus(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("agents", "update"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/agents/change_bulk_agents_status`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function deleteMultipleAgents(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("agents", "delete"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/delete_multiple_agents`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function changeAgentStatus(id, postData) {
  setLoading(true);
  const requestOptions = {
    method: "PUT",
    headers: authHeader("agents", "edit"),
    body: JSON.stringify(postData),
  };
  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/agents/${id}`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}
