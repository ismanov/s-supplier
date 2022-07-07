import { createStore } from "effector";
import * as effects from "./effects";
import * as events from "./events";
import Cookies from 'js-cookie';

// AUTH
export const $logIn = createStore({ loading: false, success: false, error: null })
  .on(effects.logInEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending
    };
  })
  .on(effects.logInEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        success: false,
        error: response.error.response.data
      };
    } else {
      Cookies.set('access-token', response.result.data.access_token);

      return {
        ...prevStore,
        success: true,
        error: null
      };
    }
  })
  .reset(events.resetlogInEvent);


// REGISTRATION
export const $registrationStep = createStore({ step: 1 })
  .on(events.updateRegistrationStepEvent, (prevStore, props) => {
    return {
      ...props
    }
  })
  .reset(events.resetUpdateRegistrationStepEvent)
  .reset(events.resetRegistrationStoreEvent);

export const $checkLogin = createStore({ loading: false, data: null, error: null })
  .on(effects.checkLoginEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending
    };
  })
  .on(effects.checkLoginEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        data: null,
        error: response.error.response.data
      };
    } else {
      return {
        ...prevStore,
        data: response.result.data || true,
        error: null
      };
    }
  })
  .reset(events.resetCheckLoginEffectEvent)
  .reset(events.resetRegistrationStoreEvent);

export const $confirmActivationCode = createStore({ loading: false, success: false, error: null })
  .on(effects.confirmActivationCodeEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending
    };
  })
  .on(effects.confirmActivationCodeEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        success: false,
        error: response.error.response.data
      };
    } else {
      return {
        ...prevStore,
        success: true,
        error: null
      };
    }
  })
  .reset(events.resetConfirmActivationCodeEvent)
  .reset(events.resetRegistrationStoreEvent);

export const $finishRegistration = createStore({ loading: false, success: false, error: null })
  .on(effects.finishRegistrationEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending
    };
  })
  .on(effects.finishRegistrationEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        success: false,
        error: response.error.response.data
      };
    } else {
      return {
        ...prevStore,
        success: true,
        error: null
      };
    }
  })
  .reset(events.resetFinishRegistrationEvent)
  .reset(events.resetRegistrationStoreEvent);


// RESET-PASSWORD
export const $resetPasswordStep = createStore({ step: 1 })
  .on(events.updatePasswordStepEvent, (prevStore, props) => {
    return {
      ...props
    }
  })
  .reset(events.resetUpdatePasswordStepEvent)
  .reset(events.resetResetPasswordStoreEvent);

export const $resetPasswordInit = createStore({ loading: false, success: false, error: null })
  .on(effects.resetPasswordInitEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.resetPasswordInitEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        success: false,
        error: response.error.response.data
      };
    } else {
      return {
        ...prevStore,
        success: true,
        error: null
      };
    }
  })
  .reset(events.resetPasswordInitEvent)
  .reset(events.resetResetPasswordStoreEvent);

export const $resetPasswordCheck = createStore({ loading: false, success: false, error: null })
  .on(effects.resetPasswordCheckEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.resetPasswordCheckEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        success: false,
        error: response.error.response.data
      };
    } else {
      return {
        ...prevStore,
        success: true,
        error: null
      };
    }
  })
  .reset(events.resetPasswordCheckEvent)
  .reset(events.resetResetPasswordStoreEvent);

export const $resetPasswordResendSmsCode = createStore({ loading: false, success: false, error: null })
  .on(effects.resetPasswordResendSmsCodeEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.resetPasswordResendSmsCodeEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        success: false,
        error: response.error.response.data
      };
    } else {
      return {
        ...prevStore,
        success: true,
        error: null
      };
    }
  })
  .reset(events.resetPasswordResendSmsCodeEvent)
  .reset(events.resetResetPasswordStoreEvent);

export const $resetPasswordFinish = createStore({ loading: false, success: false, error: null })
  .on(effects.resetPasswordFinishEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.resetPasswordFinishEffect.finally, (prevStore, response) => {
    if (response.error) {
      return {
        ...prevStore,
        success: false,
        error: response.error.response.data
      };
    } else {
      return {
        ...prevStore,
        success: true,
        error: null
      };
    }
  })
  .reset(events.resetPasswordFinishEvent)
  .reset(events.resetResetPasswordStoreEvent);

