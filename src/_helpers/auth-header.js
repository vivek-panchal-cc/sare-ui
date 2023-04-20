export function authHeader(module_name = "", action = "") {
  let user = JSON.parse(localStorage.getItem("user"));
  if (user && user.accessToken) {
    return {
      "x-access-token": user.accessToken,
      "Content-Type": "application/json",
      module_name: module_name,
      action: action,
    };
  } else {
    return { "Content-Type": "application/json" };
  }
}

export function authHeaderMutlipart(module_name = "", action = "") {
  let user = JSON.parse(localStorage.getItem("user"));
  if (user && user.accessToken) {
    return {
      "x-access-token": user.accessToken,
      module_name: module_name,
      action: action,
    };
  } else {
    return { "Content-Type": "application/json" };
  }
}

export function authHeaderMutlipartFile(module_name = "", action = "") {
  let user = JSON.parse(localStorage.getItem("user"));
  if (user && user.accessToken) {
    return {
      "x-access-token": user.accessToken,
      module_name: module_name,
      action: action,
    };
  } else {
    return { "Content-Type": "multipart/form-data" };
  }
}

export function frontHeader(module_name = "", action = "") {
  return { "Content-Type": "application/json" };
}

export function authHeaderFile(module_name = "", action = "") {
  // return {'Content-Type': 'multipart/form-data'};
  let user = JSON.parse(localStorage.getItem("user"));
  if (user && user.accessToken) {
    return {
      "x-access-token": user.accessToken,
      module_name: module_name,
      action: action,
    };
  } else {
    return { "Content-Type": "multipart/form-data" };
  }
}
