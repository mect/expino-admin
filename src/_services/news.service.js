import config from "config";
import { authHeader } from "../_helpers/auth-header";
import { authService } from "../_services/auth.service";

const getAllNewsItems = () => {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  return fetch(`${config.apiUrl}/v1/news/items`, requestOptions).then(
    handleResponse
  );
};

const getNewsItem = (id) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
  };

  return fetch(`${config.apiUrl}/v1/news/item/${id}`, requestOptions).then(
    handleResponse
  );
};

const addNewsItems = (item) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(item, getCircularReplacer()),
  };

  return fetch(`${config.apiUrl}/v1/news/item`, requestOptions).then(
    handleResponse
  );
};

const editNewsItems = (item) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(item, getCircularReplacer()),
  };

  return fetch(`${config.apiUrl}/v1/news/item/${item.ID}`, requestOptions).then(
    handleResponse
  );
};

const deleteNewsItem = (item) => {
  const requestOptions = {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      ...authHeader(),
    },
  };

  return fetch(`${config.apiUrl}/v1/news/item/${item.ID}`, requestOptions).then(
    handleResponse
  );
};

const handleResponse = (response) => {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        authService.logout();
        location.reload(true);
      }

      const error = (data && data.error) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
};

export const newsService = {
  getAllNewsItems,
  getNewsItem,
  addNewsItems,
  deleteNewsItem,
  editNewsItems,
};

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};
