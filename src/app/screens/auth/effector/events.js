import { createEvent } from "effector";

// AUTH
export const resetlogInEvent = createEvent();

// REGISTRATION
export const updateRegistrationStepEvent = createEvent();
export const resetUpdateRegistrationStepEvent = createEvent();
export const resetCheckLoginEffectEvent = createEvent();
export const resetConfirmActivationCodeEvent = createEvent();
export const resetFinishRegistrationEvent = createEvent();
export const resetRegistrationStoreEvent = createEvent();

// RESET-PASSWORD
export const updatePasswordStepEvent = createEvent();
export const resetUpdatePasswordStepEvent = createEvent();
export const resetPasswordInitEvent = createEvent();
export const resetPasswordCheckEvent = createEvent();
export const resetPasswordResendSmsCodeEvent = createEvent();
export const resetPasswordFinishEvent = createEvent();
export const resetResetPasswordStoreEvent = createEvent();