import * as effects from "./effects";
import * as events from "./events";
import {
  dataStoreCreator,
  infoStoreCreator,
} from "../../../helpers/effectorStoreCreator";
import { createStore } from "effector";
import moment from "moment";

// INVOICE  ========================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export const $xFileInvoicesList = dataStoreCreator(
  effects,
  "getXFileInvoicesListEffect"
).reset(events.resetXFileInvoicesListEvent);

export const $outgoingInvoicesList = dataStoreCreator(
  effects,
  "getOutgoingInvoicesListEffect"
).reset(events.resetOutgoingInvoicesListEvent);

export const $outgoingInvoiceFilterProps = createStore({
  search: "",
  date: null,
  type: null,
  status: null,
})
  .on(events.updateOutgoingInvoiceFilterPropsEvent, (prevStore, props) => {
    return {
      ...prevStore,
      ...props,
    };
  })
  .reset(events.resetOutgoingInvoiceFilterPropsEvent);

export const $statusList = dataStoreCreator(effects, "getStatusListEffect", []);

export const $xFileInvoice = dataStoreCreator(
  effects,
  "getXFileInvoiceByIdEffect"
).reset(events.resetXFileInvoiceByIdEvent);

export const $outgoingInvoice = dataStoreCreator(
  effects,
  "getOutgoingInvoiceByIdEffect"
).reset(events.resetOutgoingInvoiceByIdEvent);

export const $outgoingInvoiceForToSend = dataStoreCreator(
  effects,
  "getOutgoingInvoiceByIdForToSendEffect"
).reset(events.resetOutgoingInvoiceByIdForToSendEvent);

export const $sendAndCancelInvoice = infoStoreCreator(
  effects,
  "sendAndCancelInvoiceEffect"
).reset(events.resetSendAndCancelInvoiceEvent);

export const $cancelDraftInvoice = infoStoreCreator(
  effects,
  "cancelDraftInvoiceEffect"
).reset(events.resetCancelDraftInvoiceEvent);

export const $updateInvoice = infoStoreCreator(
  effects,
  "updateInvoiceEffect"
).reset(events.resetUpdateInvoiceEvent);

export const $syncInvoices = infoStoreCreator(
  effects,
  "syncInvoicesEffect"
).reset(events.resetSyncInvoicesEvent);

export const $deleteInvoice = infoStoreCreator(
  effects,
  "deleteInvoiceEffect"
).reset(events.resetDeleteInvoiceEvent);

// <<<<<<<<<<<<<<<<<<<<<<<<<<<======================================================================

// stores for  "НДС статус" and "Коэфф. разрыва при уплате НДС"  ====================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export const $VATStatus = dataStoreCreator(effects, "getVATStatusEffect").reset(
  events.resetVATStatusEvent
);

export const $CoeffGapInVATPayment = dataStoreCreator(
  effects,
  "getCoefficientGapInVATPaymentEffect"
).reset(events.resetCoeffGapInVATPaymentEvent);

// for seller
export const $VATStatusForSeller = dataStoreCreator(
  effects,
  "getVATStatusForSellerEffect"
).reset(events.resetVATStatusForSellerEvent);

export const $CoefficientGapInVATPaymentForSeller = dataStoreCreator(
  effects,
  "getCoefficientGapInVATPaymentForSellerEffect",
  ""
).reset(events.resetCoefficientGapInVATPaymentForSellerEvent);

// for buyer
export const $VATStatusForBuyer = dataStoreCreator(
  effects,
  "getVATStatusForBuyerEffect"
).reset(events.resetVATStatusForBuyerEvent);

export const $CoefficientGapInVATPaymentForBuyer = dataStoreCreator(
  effects,
  "getCoefficientGapInVATPaymentForBuyerEffect",
  ""
).reset(events.resetCoefficientGapInVATPaymentForBuyerEvent);

// <<<<<<<<<<<<==================================
