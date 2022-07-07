import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Spin, Select } from "antd";
import { FormField } from "ui/molecules/form-field";
import { PrintSvg, ArrowSvg, DoneSvg } from "svgIcons/svg-icons";
import ReactToPrint from "react-to-print";
import QRCode from "qrcode.react";
import { printIframe } from "helpers/print";
import IC from "helpers/EIMZOClient";
import { invoiceGenerator } from "../../../helpers/invoiceGenerator";
import { useStore } from "effector-react";
import effector from "../effector";
import catalogEffector from "../../catalog/effector";
import moment from "moment";
import { NavLink } from "react-router-dom";
import TextArea from "antd/lib/input/TextArea";
import { camelCaseToWords, getCoeffGap, parseVATStatus, row } from "../helpers";

const { stores, events, effects } = effector;
const { store: catalogStore, effects: catalogEffects } = catalogEffector;
const { Option } = Select;

export const Invoice = (props) => {
  const $xFileInvoice = useStore(stores.$xFileInvoice);
  const $unitItems = useStore(catalogStore.$unitItems);
  const { loading, data, error } = $xFileInvoice;
  const printRef = useRef(null);
  const causeRef = useRef(null);

  const [certKeys, setCertKeys] = useState([]);
  const [certKeysDialog, setCertKeysDialog] = useState(false);

  const [cause, setCause] = useState("");

  useEffect(() => {
    effects.getXFileInvoiceByIdEffect(props.match?.params.id);
    if (!(Array.isArray($unitItems.data) ? $unitItems.data : []).length) {
      catalogEffects.getUnitItemsEffect();
    }
    return () => {
      events.resetCoeffGapInVATPaymentEvent();
      events.resetVATStatusEvent();
    };
  }, []);

  useEffect(() => {
    if (certKeys && certKeys.length > 0) {
      if (certKeys.length !== 0) {
        if (certKeys.length === 1) {
          //acceptWithKey(certKeys[0], invoice);
          setCertKeysDialog(true);
        } else {
          setCertKeysDialog(true);
        }
      } else {
        //setErrorDialog(true);
      }
    }
  }, [certKeys]);

  useEffect(() => {
    if (data.facturaDTO?.SellerTin) {
      effects.getCoefficientGapInVATPaymentEffect(data.facturaDTO?.SellerTin);
      effects.getVATStatusEffect(data.facturaDTO?.SellerTin);
    }
  }, [data.facturaDTO?.SellerTin]);

  const seller = data.facturaDTO?.Seller || {};
  const buyer = data.facturaDTO?.Buyer || {};

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

  return (
    <>
      <Modal
        title="Выбор ключа!"
        visible={certKeysDialog}
        onOk={() => {}}
        onCancel={() => setCertKeysDialog(false)}
      >
        <Select
          placeholder="Выберите ключ"
          style={{ width: "100%" }}
          allowClear
        >
          {certKeys.map((item) => (
            <Option key={item.key}>
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
          <h1>Полученная cчет-фактурa</h1>
        </div>
        <div className="content-h1-wr__right">
          <Button
            className="custom-button primary-button"
            style={{ marginRight: 16 }}
            onClick={() => {
              if (!cause) {
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
            Отменить
          </Button>
          <Button
            className="custom-button primary-button"
            style={{ marginRight: 16 }}
            onClick={() => {
              if (!cause)
                causeRef.current?.scrollIntoView({ behavior: "smooth" });
              else
                IC.loadEImzoApiKeys((items, firstId) => {
                  if (!items) return;
                  setCertKeys(items);
                });
            }}
          >
            Принять
          </Button>
          <NavLink
            to={{
              pathname: "/warehouse/stock/add",
              state: {
                invoiceId: props.match?.params.id,
              },
            }}
            exact
          >
            <Button
              className="custom-button primary-button"
              style={{ marginRight: 16 }}
            >
              Оприходовать
            </Button>
          </NavLink>
          <ReactToPrint
            trigger={() => {
              return <Button icon={<PrintSvg />} />;
            }}
            content={() => printRef.current}
          />
        </div>
      </div>
      <div className="site-content__in">
        <div className="invoice" ref={printRef}>
          <div className="invoice__header">
            <span className="invoice__header__bold-text">Счет-фактура</span>
            <span className="invoice__header__bold-text">№ {data.number}</span>
            <div>
              От{" "}
              <span className="invoice__header__bold-text">
                {data.sendDate
                  ? moment(data.sendDate).format("DD.MM.YYYY")
                  : ""}
              </span>
            </div>
            <div>
              К договорам{" "}
              <span className="invoice__header__bold-text">
                № {data.facturaDTO?.ContractDoc?.ContractNo}
              </span>
            </div>
            <div>
              От{" "}
              <span className="invoice__header__bold-text">
                {data.facturaDTO?.ContractDoc?.ContractDate
                  ? moment(data.facturaDTO?.ContractDoc?.ContractDate).format(
                      "DD.MM.YYYY"
                    )
                  : ""}
              </span>
            </div>
            <div
              style={{
                position: "absolute",
                width: 120,
                height: 120,
                padding: 10,
                right: 60,
              }}
            >
              <QRCode
                value={JSON.stringify({
                  FileType: 1,
                  Tin: data.facturaDTO?.SellerTin,
                  Id: data.facturaDTO?.FacturaId,
                })}
                level="H"
              />
            </div>
          </div>
          <div className="invoice__seller-and-buyer-detail">
            <div className="invoice__seller-and-buyer-detail__content">
              {row("Поставщик", seller.Name, 1)}
              {row("ИНН", data.facturaDTO?.SellerTin, 2)}
              {row("Адрес", seller.Address, 3)}
              {row("ОКЭД", seller.Oked, 4)}
              {row("Банк", seller.BankId, 5)}
              {row("Р/С", seller.Account, 6)}
              {row("Директор", camelCaseToWords(seller.Director), 7)}
              {row("Бухгалтер", camelCaseToWords(seller.Accountant), 8)}
              {row("Код плательщика НДС", seller.VatRegCode, 9)}
              {row(
                "НДС статус",
                seller?.VatRegStatus
                  ? parseVATStatus(seller.VatRegStatus)
                  : "Неизвестно",
                10
              )}
              {row(
                "Коэфф. разрыва при уплате НДС",
                seller?.TaxGap ? getCoeffGap(seller.TaxGap) : "Неизвестно",
                11
              )}
            </div>

            <div className="invoice__seller-and-buyer-detail__content">
              {!data?.facturaDTO?.SingleSidedType ? (
                <>
                  {row("Покупатель", buyer.Name, 1)}
                  {row("ИНН", data.facturaDTO?.BuyerTin, 2)}
                  {row("Адрес", buyer.Address, 3)}
                  {row("ОКЭД", buyer.Oked, 4)}
                  {row("Банк", buyer.BankId, 5)}
                  {row("Р/С", buyer.Account, 6)}
                  {row("Директор", camelCaseToWords(buyer.Director), 7)}
                  {row("Бухгалтер", camelCaseToWords(buyer.Accountant), 8)}
                  {row("Код плательщика НДС", buyer.VatRegCode, 9)}
                  {row(
                    "НДС статус",
                    buyer && buyer.VatRegStatus
                      ? parseVATStatus(buyer)
                      : "Неизвестно",
                    10
                  )}
                  {row(
                    "Коэфф. разрыва при уплате НДС",
                    buyer?.TaxGap ? getCoeffGap(buyer.TaxGap) : "Неизвестно",
                    11
                  )}
                </>
              ) : (
                <div style={{ width: "100%", textAlign: "center" }}>
                  <strong>Односторонний счет-фактура</strong>
                </div>
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
                  Идентификационный код и название по Единому электронному
                  национальному каталогу товаров (услуг)
                </th>
                <th colSpan={2} rowSpan={2}>
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
                <th colSpan={2}>4</th>
                <th colSpan={2}>5</th>
                <th colSpan={2}>6</th>
                <th colSpan={2}>7</th>
                <th colSpan={1}>8</th>
                <th colSpan={1}>9</th>
                <th colSpan={2}>10</th>
              </tr>
            </thead>
            <tbody>
              {(data?.facturaDTO?.ProductList?.Products || [])
                .sort((a, b) => (Number(a.OrdNo) > Number(b.OrdNo) ? 1 : -1))
                .map((product, idx) => (
                  <tr key={idx}>
                    <td>{product.OrdNo}</td>
                    <td colSpan={2}>{product.Name}</td>
                    <td colSpan={2}>{`${product?.CatalogCode} - ${product?.CatalogName}`}</td>
                    <td colSpan={2}>{data?.facturaDTO?.HasMarking ? <DoneSvg /> : "-"}</td>
                    <td colSpan={2}>
                      {(Array.isArray($unitItems.data)
                        ? $unitItems.data
                        : []
                      ).find((unit) => unit.measureId === product.MeasureId)?.name ||
                        "-"}
                    </td>
                    <td colSpan={2}>{product.Count.toLocaleString()}</td>
                    <td colSpan={2}>{product.Summa.toLocaleString()}</td>
                    <td colSpan={2}>{product.DeliverySum.toLocaleString()}</td>
                    <td colSpan={1}>
                      {product.VatRate.toLocaleString() || "Без НДС"}
                    </td>
                    <td colSpan={1}>{product.VatSum.toLocaleString()}</td>
                    <td colSpan={2}>
                      {product.DeliverySumWithVat.toLocaleString()}
                    </td>
                  </tr>
                ))}
              <tr>
                <td
                  colSpan={13}
                  style={{
                    textAlign: "right",
                    fontWeight: "bold",
                    paddingRight: 20,
                  }}
                >
                  Итого:
                </td>
                <td colSpan={2} style={{ fontWeight: "bold" }}>
                  {data?.facturaDTO?.ProductList?.Products.reduce((acc, i) => {
                    acc = acc + Number(i.DeliverySum);
                    return acc;
                  }, 0).toLocaleString()}
                </td>
                <td colSpan={1} />
                <td colSpan={1} style={{ fontWeight: "bold" }}>
                  <strong>
                    {data?.facturaDTO?.ProductList?.Products?.reduce(
                      (acc, i) => {
                        acc = acc + Number(i.VatSum);
                        return acc;
                      },
                      0
                    ).toLocaleString()}
                  </strong>
                </td>
                <td colSpan={2} style={{ fontWeight: "bold" }}>
                  <strong>
                    {(
                      Math.floor(
                        (data?.facturaDTO?.ProductList?.Products || []).reduce(
                          (acc, product) =>
                            acc + (product.DeliverySumWithVat || 0),
                          0
                        ) * 100
                      ) / 100
                    ).toLocaleString()}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="invoice__footer">
            <div className="invoice__footer__content">
              <div className="invoice__footer__content__row">
                <span className="invoice__footer__content__row__key">
                  Руководитель:
                </span>
                <span className="invoice__footer__content__row__value">
                  {camelCaseToWords(seller.Director) || "-"}
                </span>
              </div>
              <div className="invoice__footer__content__row">
                <span className="invoice__footer__content__row__key">
                  Главный бухгалтер:
                </span>
                <span className="invoice__footer__content__row__value">
                  {camelCaseToWords(seller.Accountant) || "-"}
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
                  {camelCaseToWords(buyer.Director) || "-"}
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
                  {camelCaseToWords(buyer.Accountant) || "-"}
                </span>
              </div>
            </div>
          </div>
          <div className="row-for-seal">
            {data.status !== "DRAFT" && data.status !== "ERROR" ? (
              <div className="seal_container seal_left">
                <div className="seal_row">
                  <span>№ {data.sendNumber}</span>
                  <span>
                    {data
                      ? moment(data.sendDate).format("DD.MM.YYYY HH:mm:ss")
                      : ""}
                  </span>
                </div>
                <span className="seal_status">Отправлено</span>
                <div className="seal_row">
                  <span>{data.sendBy}</span>
                  <span></span>
                </div>
              </div>
            ) : undefined}

            {data.status !== "DRAFT" &&
            data.status !== "PENDING" &&
            data.status !== "ERROR" ? (
              <div
                className={`seal_container seal_${
                  data.status === "ACCEPTED"
                    ? "accepted"
                    : data.status === "REJECTED"
                    ? "rejected"
                    : ""
                }`}
              >
                <div className="seal_row">
                  <span>№ {data?.approvedNumber}</span>
                  <span>
                    {data
                      ? moment(data.approvedDate).format("DD.MM.YYYY HH:mm:ss")
                      : ""}
                  </span>
                </div>
                <span className="seal_status">
                  {data.status === "ACCEPTED"
                    ? "Подтверждено"
                    : data.status === "REJECTED"
                    ? "Отказано"
                    : data.status === "CANCELLED"
                    ? "Отмененные"
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
              <TextArea
                value={cause}
                placeholder="Введите причину"
                onChange={(e) => setCause(e.target.value)}
                onKeyPress={() => window.scrollTo(0, 0)}
              />
            </div>
          </FormField>
        </div>
      </div>
    </>
  );
};
