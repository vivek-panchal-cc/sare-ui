import { authHeader, authHeaderFile } from "../../_helpers";
import { notify, handleResponse, setLoading } from "../../_helpers";
import moment from "moment";
require("dotenv").config();

export const agentService = {
  getAgentsList,
  getAgentDetails,
  updateAgentDetails,
  deleteAgent,
  changeBulkAgentsStatus,
  deleteMultipleAgents,
  changeAgentStatus,
  agentDetailsView,
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
    method: "POST",
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
    method: "POST",
    headers: authHeader("agents", "edit"),
    body: JSON.stringify(postData),
  };
  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/agents/${id}/change-status`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function agentDetailsView(id, postData) {  
  const fromDate = moment(postData?.from).format("DD/MM/YYYY");
  const toDate = moment(postData?.to).format("DD/MM/YYYY");
  if (fromDate === 'Invalid date' || toDate === 'Invalid date') {
    postData.from = "";
    postData.to = "";
  } 
  else if (postData) {
    postData.from = fromDate;
    postData.to = toDate;
  }  
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("agents", "view"),
    body: JSON.stringify(postData),
  };
  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/agents/${id}/transactions`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}
