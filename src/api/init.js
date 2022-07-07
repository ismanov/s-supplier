import React from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";



const httpClient = axios.create({
  withCredentials: true,
});

httpClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    let status = (error.response && error.response.status) || 0;
    if (status === 401 && window.location.pathname !== "/sign-in") {
      window.location.href = '/sign-in';
    } else if (status === 403) {
      openNotificationWithIcon(
        'error',
        'Ошибка!',
        'У вас нет необходимого разрешения. Пожалуйста, свяжитесь с вашим администратором');
    } else if (status === 500) {
      if (error.response) {
        const content =
          <div>
            {error.response.data.title}<br />
            Статус: {status}<br />
            Детали: {error.response.data.detail}<br />
            Сообщение: {error.response.data.message}
          </div>;
        openNotificationWithIcon(
          'error',
          'Ошибка!',
          content);
      }
    }
    return Promise.reject(error)
  });


httpClient.interceptors.request.use((config) => {
  let token = Cookies.get('access-token');
  // if (token === null) {
  //   token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI5OTg5NDY5Njg4MzUiLCJhdXRoIjoiUk9MRV9PV05FUixST0xFX1VTRVIiLCJleHAiOjE2MDM2MzMzMzB9.UhJV2MwK_tSdliplDpaNjkPZbLmYDhDdkUXhRGklu0eQBLUEu0wakjNREWv5zYvGHqpUMBQqF4kyY5jM-B50JA"
  // }
  if (token) {
    config.headers = Object.assign(config.headers, { "Authorization": "Bearer " + token });
    return config;
  } else {
    return config
  }

});


export const httpGet = (params) => httpClient({
  method: 'get',
  ...params
});

export const httpPost = (params) => httpClient({
  method: 'post',
  ...params
});

export const httpPut = (params) => httpClient({
  method: 'put',
  ...params
});

export const httpPatch = (params) => httpClient({
  method: 'patch',
  ...params
});

export const httpDelete = (params) => httpClient({
  method: 'delete',
  ...params
});