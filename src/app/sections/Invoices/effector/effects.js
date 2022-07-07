import { createEffect } from "effector";
import { api } from "api";

// INVOICE  ====================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export const getXFileInvoicesListEffect = createEffect({
  handler: api.invoices.getXFileInvoicesList,
});

export const getStatusListEffect = createEffect({
  handler: api.invoices.getXFileStatusList,
});

export const getXFileInvoiceByIdEffect = createEffect({
  handler: api.invoices.getXFileInvoiceById,
});

export const getOutgoingInvoicesListEffect = createEffect({
  handler: api.invoices.getOutGoingInvoices,
});

export const getOutgoingInvoiceByIdEffect = createEffect({
  handler: api.invoices.getOutgoingInvoiceById,
});

export const getOutgoingInvoiceByIdForToSendEffect = createEffect({
  handler: api.invoices.getOutgoingInvoiceByIdForToSend,
});

export const sendAndCancelInvoiceEffect = createEffect({
  handler: api.invoices.sendAndCancelInvoice,
});

export const cancelDraftInvoiceEffect = createEffect({
  handler: api.invoices.cancelDraftInvoice,
});

export const updateInvoiceEffect = createEffect({
  handler: api.invoices.updateInvoice,
});

export const syncInvoicesEffect = createEffect({
  handler: api.invoices.syncInvoices,
});

export const deleteInvoiceEffect = createEffect({
  handler: api.invoices.deleteInvoice,
});

//<<<<<<<<<<<<<<<<<<<<<<<<< ==============================

// effects for  "НДС статус" and "Коэфф. разрыва при уплате НДС"  ====================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export const getVATStatusEffect = createEffect({
  handler: api.invoices.getVATStatus,
});

export const getCoefficientGapInVATPaymentEffect = createEffect({
  handler: api.invoices.getCoefficientGapInVATPayment,
});
// for seller
export const getVATStatusForSellerEffect = createEffect({
  handler: api.invoices.getVATStatus,
});

export const getCoefficientGapInVATPaymentForSellerEffect = createEffect({
  handler: api.invoices.getCoefficientGapInVATPayment,
});
// for buyer
export const getVATStatusForBuyerEffect = createEffect({
  handler: api.invoices.getVATStatus,
});

export const getCoefficientGapInVATPaymentForBuyerEffect = createEffect({
  handler: api.invoices.getCoefficientGapInVATPayment,
});

// <<<<<<<<<<<<<<<<<<<<<<< =============================
