import { httpPost, httpGet } from "../init";

// AUTH
export const logIn = (data) => httpPost({
  url: '/api/cabinet/v1/account/login',
  data
});

// REGISTRATION
export const checkLogin = (data) => httpPost({
  url: '/api/cabinet/v1/account/register',
  data
});

export const confirmActivationCode = (data) => httpPost({
  url: '/api/cabinet/v1/account/activate',
  data
});

export const finishRegistration = (data) => httpPost({
  url: '/api/cabinet/v1/account/activate/finish',
  data
});

// RESET-PASSWORD
export const resetPasswordInit = (data) => httpPost({
  url: '/api/cabinet/v1/account/reset-password/init',
  data
});

export const resetPasswordCheck = (data) => httpPost({
  url: '/api/cabinet/v1/account/reset-password/check',
  data
});

export const resetPasswordResendSmsCode = (data) => httpPost({
  url: '/api/cabinet/v1/account/send-activation-key',
  data
});

export const resetPasswordFinish = (data) => httpPost({
  url: '/api/cabinet/v1/account/reset-password/finish',
  data
});
