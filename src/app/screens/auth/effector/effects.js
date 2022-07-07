import { createEffect } from "effector";
import { api } from "api";

// AUTH
export const logInEffect = createEffect({
  handler: api.auth.logIn
});

// REGISTRATION
export const checkLoginEffect = createEffect({
  handler: api.auth.checkLogin
});

export const confirmActivationCodeEffect = createEffect({
  handler: api.auth.confirmActivationCode
});

export const finishRegistrationEffect = createEffect({
  handler: api.auth.finishRegistration
});

// RESET-PASSWORD
export const resetPasswordInitEffect = createEffect({
  handler: api.auth.resetPasswordInit
});

export const resetPasswordCheckEffect = createEffect({
  handler: api.auth.resetPasswordCheck
});

export const resetPasswordResendSmsCodeEffect = createEffect({
  handler: api.auth.resetPasswordResendSmsCode
});

export const resetPasswordFinishEffect = createEffect({
  handler: api.auth.resetPasswordFinish
});