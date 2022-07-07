import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Spin, Select, DatePicker, Input } from "antd";
import { FormField } from "ui/molecules/form-field";
import { PrintSvg, ArrowSvg, DoneSvg } from "svgIcons/svg-icons";
import ReactToPrint from "react-to-print";
import QRCode from "qrcode.react";
import IC from "helpers/EIMZOClient";
import { useStore } from "effector-react";
import effector from "../effector";
import catalogEffector from "../../catalog/effector";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";

import moment from "moment";
import TextArea from "antd/lib/input/TextArea";
import { DATE_FORMAT } from "../../../screens/main/constants";
import { camelCaseToWords, getCoeffGap, parseVATStatus, row } from "../helpers";

const { stores, effects, events } = effector;
const { store: catalogStore, effects: catalogEffects } = catalogEffector;

const { Option } = Select;

export const OutgoingInvoice = (props) => {
  const printRef = useRef(null);
  const tableRef = useRef(null);
  const causeRef = useRef(null);

  const $outgoingInvoice = useStore(stores.$outgoingInvoice);
  const $outgoingInvoiceForToSend = useStore(stores.$outgoingInvoiceForToSend);

  const $updateInvoice = useStore(stores.$updateInvoice);
  const $cancelDraftInvoice = useStore(stores.$cancelDraftInvoice);
  const $sendAndCancelInvoice = useStore(stores.$sendAndCancelInvoice);

  const $VATStatusForSeller = useStore(stores.$VATStatusForSeller);
  const $VATStatusForBuyer = useStore(stores.$VATStatusForBuyer);

  const $CoefficientGapInVATPaymentForSeller = useStore(
    stores.$CoefficientGapInVATPaymentForSeller
  );
  const $CoefficientGapInVATPaymentForBuyer = useStore(
    stores.$CoefficientGapInVATPaymentForBuyer
  );

  const $unitItems = useStore(catalogStore.$unitItems);

  const { loading, data } = $outgoingInvoice;
  const { data: sendingFactura, error: sendingFacturaError } =
    $outgoingInvoiceForToSend;

  const { loading: VSBLoading, data: sellerVat } = $VATStatusForSeller;
  const { loading: VSSLoading, data: buyerVat } = $VATStatusForBuyer;

  const { loading: CSLoading, data: sellerGapInVat } =
    $CoefficientGapInVATPaymentForSeller;
  const { loading: CBLoading, data: buyerGapInVat } =
    $CoefficientGapInVATPaymentForBuyer;

  const [certKeys, setCertKeys] = useState([]);
  const [certKey, setCertKey] = useState();
  const [certKeysDialog, setCertKeysDialog] = useState(false);

  const [productsList, setProductsList] = useState([]);
  const [invoiceData, setInvoiceData] = useState({});

  const [cause, setCause] = useState("");
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    effects.getOutgoingInvoiceByIdEffect(props.match?.params.id);
    effects.getOutgoingInvoiceByIdForToSendEffect(props.match?.params.id);
    if (!(Array.isArray($unitItems.data) ? $unitItems.data : []).length) {
      catalogEffects.getUnitItemsEffect();
    }
  }, []);

  useEffect(() => {
    if ($sendAndCancelInvoice.success) {
      openNotificationWithIcon(
        "success",
        `Cчет-фактура ${statusCode === "DRAFT" ? "отправлено" : "отменен"}`
      );
      events.resetSendAndCancelInvoiceEvent();
      props.history.push("/invoices/outgoing");
    } else if ($sendAndCancelInvoice.error) {
      openNotificationWithIcon("error", $sendAndCancelInvoice.error?.detail);
      events.resetSendAndCancelInvoiceEvent();
    }
  }, [$sendAndCancelInvoice]);

  useEffect(() => {
    if ($cancelDraftInvoice.success) {
      openNotificationWithIcon("success", "Cчет-фактура отменен");
      events.resetCancelDraftInvoiceEvent();
      effects.getOutgoingInvoiceByIdEffect(props.match?.params.id);
    }
  }, [$cancelDraftInvoice]);

  useEffect(() => {
    if ($updateInvoice.success) {
      openNotificationWithIcon("success", "Счет-фактура обновлен");
      events.resetUpdateInvoiceEvent();
      effects.getOutgoingInvoiceByIdEffect(props.match?.params.id);
      effects.getOutgoingInvoiceByIdForToSendEffect(props.match?.params.id);
      setEdit(false);
    }
  }, [$updateInvoice.success]);

  useEffect(() => {
    if (data.id) {
      const { customer, supplier } = data;
      effects.getVATStatusForSellerEffect(supplier.tin);

      effects.getCoefficientGapInVATPaymentForSellerEffect(supplier.tin);

      effects.getVATStatusForBuyerEffect(customer.tin);

      effects.getCoefficientGapInVATPaymentForBuyerEffect(customer.tin);
    }
  }, [data.id]);

  useEffect(() => {
    if (certKeys && certKeys.length > 0) {
      if (certKeys.length !== 0) {
        if (certKeys.length === 1) {
          certKeysDialog && setCertKeysDialog(false);
          sendInvoiceWithKey(certKeys[0]);
        } else {
          setCertKeysDialog(true);
        }
      } else {
        openNotificationWithIcon("error", "Ошибка!", "Ключи не найдены");
      }
    }
  }, [certKeys]);

  useEffect(() => {
    setProductsList(data.products || []);
    setInvoiceData({
      contractDate: data.contractDate,
      contractNumber: data.contractNumber,
    });
  }, [data]);

  const onChangeProduct = (key, value, index) => {
    if (!edit) return;
    setProductsList((prev) => {
      const newProduct = [...prev];
      newProduct[index] = ((p, k, v) => {
        switch (k) {
          case "hasMark":
            return { ...p, hasMark: v };

          case "qty": {
            const qty = Number(v || 0);
            const vat = 1 + Number(p.vatRate) / 100;
            const totalPrice = Number(p.totalPrice || 0);
            const price = totalPrice / qty;
            const totalVatPrice = totalPrice - totalPrice / vat;
            const vatPrice = totalVatPrice / qty
            const totalPriceWithoutVat = totalPrice - totalVatPrice;
            const priceWithoutVat = totalPriceWithoutVat / qty;
            return {
              ...p,
              qty,
              totalPrice: totalPrice.toFixed(2),
              price: price.toFixed(2),
              totalVatPrice: totalVatPrice.toFixed(2),
              vatPrice: vatPrice.toFixed(2),
              totalPriceWithoutVat: totalPriceWithoutVat.toFixed(2),
              priceWithoutVat: priceWithoutVat.toFixed(2),
              };
          }

          case "totalPrice": {
            const qty = Number(p.qty || 0);
            const vat = 1 + Number(p.vatRate) / 100;
            const totalPrice = Number(v || 0);
            const price = totalPrice / qty;
            const totalVatPrice = totalPrice - totalPrice / vat;
            const vatPrice = totalVatPrice / qty
            const totalPriceWithoutVat = totalPrice - totalVatPrice;
            const priceWithoutVat = totalPriceWithoutVat / qty;
            return {
              ...p,
              qty,
              totalPrice: totalPrice.toFixed(2),
              price: price.toFixed(2),
              totalVatPrice: totalVatPrice.toFixed(2),
              vatPrice: vatPrice.toFixed(2),
              totalPriceWithoutVat: totalPriceWithoutVat.toFixed(2),
              priceWithoutVat: priceWithoutVat.toFixed(2),
            };
          }
          default:
            return { ...p };
        }
      })(newProduct[index], key, value);

      return newProduct;
    });
  };

  const sendInvoiceWithKey = (cert) => {
    IC.loadKey(cert.data, async (id) => {
      IC.createEImzoPkcs7(
        id,
        sendingFactura,
        (pkcs7) => {
          setCertKeysDialog(false);
          effects.sendAndCancelInvoiceEffect({
            data: {
              FacturaId: sendingFactura.FacturaId,
              Sign: pkcs7,
              Notes: cause,
            },
            status: statusCode,
          });
        },
        () => {
          openNotificationWithIcon(
            "error",
            "Ошибка!",
            "Неверный пароль или ввод пароля отменен"
          );
        }
      );
    });
  };

  const updateInvoice = () => {
    if (!data.id) return;
    let totalQty = 0;
    let totalPrice = 0;
    let totalVatPrice = 0;
    let totalPriceWithoutVat = 0;
    const newData = {
      contractDate: invoiceData.contractDate,
      contractNumber: invoiceData.contractNumber,
      customerId: data.customer?.id,
      description: data.description,
      facturaId: data.facturaId,
      id: data.id,
      invoiceDate: data.invoiceDate,
      invoiceType: data.invoiceType,
      products: productsList.map((product) => {
        totalQty += Number(product.qty)
        totalPrice += Number(product.totalPrice)
        totalVatPrice += Number(product.totalVatPrice)
        totalPriceWithoutVat += Number(product.totalPriceWithoutVat)
        return {
          id: product.id,
          invoiceProductId: product.invoiceProductId,
          totalQty: product.totalQty,
          qty: product.qty,
          totalPrice: product.totalPrice,
          price: product.price,
          totalVatPrice: product.totalVatPrice,
          vatPrice: product.vatPrice,
          priceWithoutVat: product.priceWithoutVat,
          totalPriceWithoutVat: product.totalPriceWithoutVat,
          unitId: product.unit?.id,
        }
      }),
      stockId: data.stock?.id,
      supplierId: data.supplier?.id,
      totalQty,
      totalPrice,
      totalVatPrice,
      totalPriceWithoutVat
    };
    effects.updateInvoiceEffect(newData);
  };

  const seller = data?.supplier || {};
  const buyer = data?.customer || {};

  if (loading)
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin />
      </div>
    );

  const getAddress = (fullAddress) => {
    const { district, region, street } = fullAddress;
    return district ? `${region.name}, ${district.name}, ${street}` : "";
  };

  const { status = {} } = data;
  const { code: statusCode = "" } = status;
  return (
    <>
      <Modal
        title="Выбор ключа!"
        visible={certKeysDialog}
        onOk={() => {
          setCertKeys([certKey]);
          setCertKey(undefined);
        }}
        okButtonProps={{
          disabled: !certKey,
        }}
        onCancel={() => {
          setCertKey(undefined);
          setCertKeysDialog(false);
        }}
      >
        <Select
          placeholder="Выберите ключ"
          style={{ width: "100%" }}
          value={certKey?.key || undefined}
          onChange={(certKey) =>
            setCertKey(certKeys.find((cert) => cert.key === certKey))
          }
          allowClear
        >
          {certKeys.map((item) => (
            <Option value={item.key} key={item.key}>
              {item.data
                ? `${item.data.TIN} - ${item.data.O}(${item.data.CN})`
                : "Выберите ключ"}
            </Option>
          ))}
        </Select>
      </Modal>
      <div className="content-h1-wr">
        <div className="content-h1-wr__left">
          <Button
            className="custom-button add-button onlyicon b-r-30 m-r-10 rotate-left"
            onClick={() => props.history.goBack()}
          >
            <ArrowSvg />
          </Button>
          <h1>Отправленная cчет-фактурa</h1>
        </div>
        <div className="content-h1-wr__right">
          {!edit && (statusCode === "DRAFT" || statusCode === "PENDING") && (
            <>
              {statusCode === "DRAFT" && (
                <>
                  <Button
                    onClick={() => {
                      if (tableRef.current) {
                        // tableRef.current.scrollIntoView({
                        //   behavior: "smooth",
                        // });
                      }
                      setEdit(true);
                    }}
                    style={{ marginRight: 16 }}
                  >
                    Редактировать
                  </Button>
                  {process.env.NODE_ENV === "development" && (
                    <Button
                      danger
                      style={{ marginRight: 16 }}
                      type="primary"
                      loading={$cancelDraftInvoice.loading}
                      onClick={() => {
                        if (!cause) {
                          if (causeRef.current) {
                            causeRef.current.scrollIntoView({
                              behavior: "smooth",
                            });
                            causeRef.current.style.border = "solid red 0.2px";
                            causeRef.current.style.borderRadius = "5px";
                          }
                        } else
                          data?.facturaId
                            ? effects.cancelDraftInvoiceEffect({
                                Notes: cause,
                                FacturaId: data.facturaId,
                              })
                            : "";
                      }}
                    >
                      Отменить
                    </Button>
                  )}
                </>
              )}
              <Button
                style={{ marginRight: 16 }}
                type="primary"
                danger={statusCode === "PENDING"}
                loading={$outgoingInvoiceForToSend.loading}
                // disabled={!$outgoingInvoiceForToSend.data.FacturaId}
                // disabled={}
                onClick={() => {
                  if (!sendingFactura.FacturaId) {
                    openNotificationWithIcon(
                      "error",
                      sendingFacturaError.detail ||
                        sendingFacturaError.errorMessage
                    );
                    return;
                  }
                  if (!cause && statusCode !== "DRAFT") {
                    if (causeRef.current) {
                      causeRef.current.scrollIntoView({ behavior: "smooth" });
                      causeRef.current.style.border = "solid red 0.2px";
                      causeRef.current.style.borderRadius = "5px";
                    }
                  } else
                    IC.loadEImzoApiKeys((items, firstId) => {
                      if (!items) return;
                      setCertKeys(items);
                    });
                }}
              >
                {statusCode === "DRAFT" ? "Отправить" : "Отменить"}
              </Button>
            </>
          )}
          {!edit && (
            <ReactToPrint
              trigger={() => {
                return <Button icon={<PrintSvg />} />;
              }}
              content={() => printRef.current}
            />
          )}
        </div>
      </div>
      <div className="site-content__in">
        <div className="invoice" ref={printRef}>
          <div className="invoice__header">
            <span
              style={{ fontSize: 20 }}
              className="invoice__header__bold-text"
            >
              Счет-фактура
            </span>
            <span className="invoice__header__bold-text">
              № {data.invoiceNumber}
            </span>
            <div>
              От{" "}
              <span className="invoice__header__bold-text">
                {data.invoiceDate
                  ? moment(data.invoiceDate).format(DATE_FORMAT)
                  : ""}
              </span>
            </div>
            <div>
              К договорам{" "}
              <span className="invoice__header__bold-text">
                №{" "}
                {edit ? (
                  <Input
                    disabled={!edit}
                    className={`input-for-table text-align-start`}
                    type="text"
                    style={{
                      width:
                        12.3 + 12.3 * (invoiceData.contractNumber?.length || 0),
                      maxWidth: 200,
                    }}
                    value={invoiceData.contractNumber}
                    onChange={(e) => {
                      const text = e?.target?.value;
                      (text || text === "") &&
                        setInvoiceData((prev) => ({
                          ...prev,
                          contractNumber: text,
                        }));
                    }}
                  />
                ) : (
                  invoiceData.contractNumber
                )}
              </span>
            </div>
            <div>
              От{" "}
              <span className="invoice__header__bold-text">
                {edit ? (
                  <DatePicker
                    format={"DD.MM.YYYY"}
                    allowClear={false}
                    size="small"
                    value={
                      invoiceData.contractDate
                        ? moment(invoiceData.contractDate, "YYYY/MM/DD")
                        : undefined
                    }
                    onChange={(e) => {
                      console.log();
                      setInvoiceData((prev) => ({
                        ...prev,
                        contractDate:
                          e.format("YYYY-MM-DD") +
                          "T" +
                          moment(new Date()).format("HH:mm:ss") +
                          ".000",
                      }));
                    }}
                  />
                ) : (
                  moment(invoiceData.contractDate).format("DD.MM.YYYY")
                )}
              </span>
            </div>
            <div
              style={{
                position: "absolute",
                width: 110,
                height: 110,
                padding: 10,
                right: 60,
              }}
            >
              <QRCode
                size={110}
                value={JSON.stringify({
                  FileType: 1,
                  Tin: seller?.tin,
                  Id: data?.facturaId,
                })}
                level="H"
              />
            </div>
          </div>
          <div className="invoice__seller-and-buyer-detail">
            <div className="invoice__seller-and-buyer-detail__content">
              {row("Поставщик", seller.name, 1)}
              {row("ИНН", seller.tin, 2)}
              {row("Адрес", seller.address && getAddress(seller.address), 3)}
              {row("ОКЭД", seller?.bank?.oked, 4)}
              {row("Банк", seller?.bank?.name, 5)}
              {row("Р/С", seller?.bank?.accountNumber, 6)}
              {row(
                "Код плательщика НДС",
                sellerVat.data?.vatRegCode +
                  (sellerVat?.data?.status
                    ? ` (${parseVATStatus(sellerVat.data.status)})`
                    : ""),
                9,
                VSSLoading
              )}
              {row(
                "Коэфф. разрыва при уплате НДС",
                sellerGapInVat ? getCoeffGap(sellerGapInVat) : "",
                10,
                CSLoading
              )}
            </div>
            <div className="invoice__seller-and-buyer-detail__content">
              {row("Покупатель", buyer.name, 1)}
              {row("ИНН", buyer.tin, 2)}
              {row("Адрес", buyer.address && getAddress(buyer.address), 3)}
              {row("ОКЭД", buyer?.bank?.oked, 4)}
              {row("Банк", buyer?.bank?.name, 5)}
              {row("Р/С", buyer?.bank?.accountNumber, 6)}
              {row(
                "Код плательщика НДС",
                buyerVat.data?.vatRegCode +
                  (buyerVat?.data?.status
                    ? ` (${parseVATStatus(buyerVat.data.status)})`
                    : ""),
                9,
                VSBLoading
              )}
              {row(
                "Коэфф. разрыва при уплате НДС",
                buyerGapInVat ? getCoeffGap(buyerGapInVat) : "",
                10,
                CBLoading
              )}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th style={{ width: 20 }} rowSpan={3}>
                  №п/п
                </th>
                <th colSpan={2} rowSpan={2}>
                  Наименование продукта
                </th>
                <th colSpan={2} rowSpan={2}>
                  Идентификационный код и название <br /> по Единому
                  электронному национальному <br /> каталогу товаров (услуг)
                </th>
                <th colSpan={1} rowSpan={2}>
                  Маркировка
                </th>
                <th colSpan={2} rowSpan={2}>
                  Ед. измерения
                </th>
                <th colSpan={2} rowSpan={2}>
                  Количество
                </th>
                <th colSpan={2} rowSpan={2}>
                  Цена
                </th>
                <th colSpan={2} rowSpan={2}>
                  Ст. поставки
                </th>
                <th colSpan={2}> НДС</th>
                <th colSpan={2} rowSpan={2}>
                  Ст. поставки с учетом НДС
                </th>
              </tr>
              <tr>
                <th colSpan={1}>Ставка</th>
                <th colSpan={1}>Сумма</th>
              </tr>
              <tr>
                <th colSpan={2}>1</th>
                <th colSpan={2}>2</th>
                <th colSpan={2}>3</th>
                <th colSpan={1}>4</th>
                <th colSpan={2}>5</th>
                <th colSpan={2}>6</th>
                <th colSpan={2}>7</th>
                <th colSpan={1}>8</th>
                <th colSpan={1}>9</th>
                <th colSpan={2}>10</th>
              </tr>
            </thead>
            <tbody ref={tableRef}>
              {productsList.map((product, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td colSpan={2}>{`${product.name} ${product.capacity || ""}`}</td>
                  <td colSpan={2}>
                    {`${product.vatBarcode || ""} ${
                      product.catalogName ? "- " + product.catalogName : ""
                    }` || "-"}
                  </td>
                  <td colSpan={1}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {edit && false ? (
                        <input
                          checked={product.hasMark}
                          type="checkbox"
                          disabled={!edit}
                          onChange={(e) =>
                            onChangeProduct("hasMark", e.target.checked, idx)
                          }
                        />
                      ) : product.hasMark ? (
                        <DoneSvg />
                      ) : (
                        "-"
                      )}
                    </div>
                  </td>
                  <td colSpan={2}>{product.unit?.name || "-"}</td>
                  <td colSpan={2}>
                    {edit ? (
                      <Input
                        disabled={!edit}
                        className={`input-for-table`}
                        min={0}
                        type="number"
                        value={product.qty}
                        onChange={(e) => {
                          onChangeProduct("qty", e.target.value || 0, idx);
                        }}
                      />
                    ) : (
                      product.qty.toLocaleString()
                    )}
                  </td>
                  <td colSpan={2}>{Number(product.priceWithoutVat).toLocaleString()}</td>
                  <td colSpan={2}>{Number(product.totalPriceWithoutVat).toLocaleString()}</td>
                  <td colSpan={1}>
                    {(product.vatRate ? product.vatRate + " %" : "") ||
                      "Без НДС"}
                  </td>
                  <td colSpan={1}>
                    {product.totalVatPrice ? product.totalVatPrice.toLocaleString() : "0"}
                  </td>
                  <td colSpan={2}>
                    {edit ? (
                      <Input
                        className={`input-for-table`}
                        disabled={!edit}
                        value={product.totalPrice}
                        type="number"
                        onChange={(e) => {
                          onChangeProduct("totalPrice", e.target.value, idx);
                        }}
                      />
                    ) : (
                      Number(product.totalPrice).toLocaleString()
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan={12}
                  style={{
                    textAlign: "right",
                    fontWeight: "bold",
                    paddingRight: 20,
                  }}
                >
                  Итого:
                </td>
                <td colSpan={2} style={{ fontWeight: "bold" }}>
                  {productsList
                    .reduce((acc, i) => {
                      acc = acc + Number(i.totalPriceWithoutVat);
                      return acc;
                    }, 0)
                    .toLocaleString()}
                </td>
                <td colSpan={1} />
                <td colSpan={1} style={{ fontWeight: "bold" }}>
                  <strong>
                    {productsList
                      .reduce((acc, i) => {
                        acc = acc + Number(i.totalVatPrice);
                        return acc;
                      }, 0)
                      .toLocaleString()}
                  </strong>
                </td>
                <td colSpan={2} style={{ fontWeight: "bold" }}>
                  <strong>
                    {(
                      Math.floor(
                        productsList.reduce(
                          (acc, product) =>
                            acc + Number(product.totalPrice || 0),
                          0
                        ) * 100
                      ) / 100
                    ).toLocaleString()}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
          {edit && statusCode === "DRAFT" && (
            <div className="edit-buttons-container">
              <Button
                danger
                disabled={$updateInvoice.loading}
                onClick={() => {
                  setProductsList(data?.products || []);
                  setInvoiceData({
                    contractDate: data.contractDate,
                    contractNumber: data.contractNumber,
                  });
                  setEdit(false);
                }}
                style={{ marginRight: 16 }}
              >
                Отменить
              </Button>
              <Button
                type="primary"
                loading={$updateInvoice.loading}
                onClick={updateInvoice}
                style={{ marginRight: 16 }}
              >
                Сохранить
              </Button>
            </div>
          )}
          <div className="invoice__footer">
            <div className="invoice__footer__content">
              <div className="invoice__footer__content__row">
                <span className="invoice__footer__content__row__key">
                  Руководитель:
                </span>
                <span className="invoice__footer__content__row__value">
                  {seller.Director || "-"}
                </span>
              </div>
              <div className="invoice__footer__content__row">
                <span className="invoice__footer__content__row__key">
                  Главный бухгалтер:
                </span>
                <span className="invoice__footer__content__row__value">
                  {seller.Accountant || "-"}
                </span>
              </div>
            </div>
            <div className="invoice__footer__content">
              <div className="invoice__footer__content__row">
                <span
                  style={{ textAlign: "end" }}
                  className="invoice__footer__content__row__key"
                >
                  Руководитель:
                </span>
                <span
                  style={{ textAlign: "end" }}
                  className="invoice__footer__content__row__value"
                >
                  {buyer.Director || "-"}
                </span>
              </div>
              <div className="invoice__footer__content__row">
                <span
                  style={{ textAlign: "end" }}
                  className="invoice__footer__content__row__key"
                >
                  Главный бухгалтер:
                </span>
                <span
                  style={{ textAlign: "end" }}
                  className="invoice__footer__content__row__value"
                >
                  {buyer.Accountant || "-"}
                </span>
              </div>
            </div>
          </div>
          <div className="row-for-seal">
            {statusCode !== "DRAFT" && statusCode !== "ERROR" ? (
              <div className="seal_container seal_left">
                <div className="seal_row">
                  <span>{data.sendNumber ? "№" + data.sendNumber : ""}</span>
                  <span>
                    {data
                      ? data.sendDate &&
                        moment(data.sendDate).format("DD.MM.YYYY HH:mm:ss")
                      : ""}
                  </span>
                </div>
                <span className="seal_status">{data?.status?.name}</span>
                <div className="seal_row">
                  <span>{data.sendBy}</span>
                  <span></span>
                </div>
              </div>
            ) : undefined}

            {statusCode !== "DRAFT" &&
            statusCode !== "CANCELLED" &&
            statusCode !== "PENDING" &&
            statusCode !== "ERROR" ? (
              <div
                className={`seal_container seal_${
                  statusCode === "ACCEPTED"
                    ? "accepted"
                    : statusCode === "REJECTED"
                    ? "rejected"
                    : ""
                }`}
              >
                <div className="seal_row">
                  <span>№ {data?.approvedNumber}</span>
                  <span>
                    {data
                      ? data.approvedDate
                        ? moment(data.approvedDate).format(
                            "DD.MM.YYYY HH:mm:ss"
                          )
                        : ""
                      : ""}
                  </span>
                </div>
                <span className="seal_status">
                  {statusCode === "ACCEPTED"
                    ? "Подтверждено"
                    : statusCode === "REJECTED"
                    ? "Отказано"
                    : ""}
                </span>
                <div className="seal_row">
                  <span>{data.approvedBy}</span>
                  <span></span>
                </div>
              </div>
            ) : undefined}
          </div>
        </div>
        <hr />
        <div style={{ marginTop: 20 }} />
        <div>
          <FormField title="Причина">
            <div ref={causeRef}>
              {statusCode === "DRAFT" || statusCode === "PENDING" ? (
                <TextArea
                  value={cause}
                  placeholder="Введите причину"
                  onChange={(e) => setCause(e.target.value)}
                  onKeyPress={() => window.scrollTo(0, 0)}
                />
              ) : (
                <strong>{data.notes}</strong>
              )}
            </div>
          </FormField>
        </div>
      </div>
    </>
  );
};
