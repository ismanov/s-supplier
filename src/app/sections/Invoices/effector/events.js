import { createEvent } from "effector";

export const resetXFileInvoicesListEvent = createEvent();
export const resetXFileInvoiceByIdEvent = createEvent();
export const resetOutgoingInvoicesListEvent = createEvent();
export const resetOutgoingInvoiceByIdEvent = createEvent();
export const resetOutgoingInvoiceByIdForToSendEvent = createEvent();
export const resetSendAndCancelInvoiceEvent = createEvent();
export const resetCancelDraftInvoiceEvent = createEvent();
export const resetUpdateInvoiceEvent = createEvent();
export const resetSyncInvoicesEvent = createEvent();
export const resetDeleteInvoiceEvent = createEvent();

export const updateOutgoingInvoiceFilterPropsEvent = createEvent();
export const resetOutgoingInvoiceFilterPropsEvent = createEvent();

export const resetVATStatusEvent = createEvent();
export const resetVATStatusForSellerEvent = createEvent();
export const resetVATStatusForBuyerEvent = createEvent();

export const resetCoeffGapInVATPaymentEvent = createEvent();
export const resetCoefficientGapInVATPaymentForSellerEvent = createEvent();
export const resetCoefficientGapInVATPaymentForBuyerEvent = createEvent();
