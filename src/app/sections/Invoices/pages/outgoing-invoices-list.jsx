import React, { useEffect, useState } from "react";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";
import { useStore } from "effector-react";
import {
  Button,
  Pagination,
  Table,
  Input,
  Select,
  Tooltip,
  DatePicker,
  Tag,
  Popconfirm,
  Popover,
} from "antd";

import { CloseModalSvg, SearchSvg, SettingsSvg } from "svgIcons/svg-icons";
import { ArrowSvg } from "svgIcons/svg-icons";
import { debounce } from "helpers/debounce";
import { Link, NavLink } from "react-router-dom";
import moment from "moment";
import effector from "../effector";
import { DATE_FORMAT } from "../../../screens/main/constants";
import { SyncOutlined } from "@ant-design/icons";

const { stores, effects, events } = effector;
const { Option } = Select;

const columns = [
  {
    title: "№",
    dataIndex: "num",
  },
  {
    title: "Номер счет-фактуры",
    dataIndex: "numInvoice",
  },
  {
    title: "ИНН покупателя",
    dataIndex: "buyerTin",
  },
  {
    title: "Покупатель",
    dataIndex: "buyerName",
  },
  {
    title: "Сумма",
    dataIndex: "sum",
    align: "right",
  },
  {
    title: "Дата",
    dataIndex: "date",
  },
  {
    title: "Номер отгрузки",
    dataIndex: "numStock",
  },
  {
    title: "Статус",
    dataIndex: "status",
  },
  {
    title: " ",
    dataIndex: "action",
  },
];

const updateFilterSearch = debounce((action) => {
  action();
}, 400);

export const OutgoingInvoicesList = (props) => {
  const $outgoingInvoicesList = useStore(stores.$outgoingInvoicesList);
  const $statusList = useStore(stores.$statusList);
  const $syncInvoices = useStore(stores.$syncInvoices);
  const $deleteInvoice = useStore(stores.$deleteInvoice);
  const $outgoingInvoiceFilterProps = useStore(stores.$outgoingInvoiceFilterProps);
  const [searchValue, setSearchValue] = useState($outgoingInvoiceFilterProps.search);

  const { data: invoicesData, loading } = $outgoingInvoicesList;
  const { content: invoicesList, totalElements: invoicesTotal } = invoicesData;

  const [page, setPage] = useState(1);

  useEffect(() => {
    effects.getOutgoingInvoicesListEffect({ page: page - 1 });
    !$statusList.data?.length && effects.getStatusListEffect();
  }, []);

  useEffect(() => {
    if ($syncInvoices.success) {
      openNotificationWithIcon("success", "Статусы счет-фактур обновлены");
      events.resetSyncInvoicesEvent();
      effects.getOutgoingInvoicesListEffect({
        page: page - 1,
        ...$outgoingInvoiceFilterProps,
      });
    }
  }, [$syncInvoices.success]);

  useEffect(() => {
    if ($deleteInvoice.success) {
      openNotificationWithIcon("success", "Cчет-фактура удален");
      events.resetDeleteInvoiceEvent();
      effects.getOutgoingInvoicesListEffect({
        page: page - 1,
        ...$outgoingInvoiceFilterProps,
      });
    }
  }, [$deleteInvoice.success]);

  useEffect(() => {
    effects.getOutgoingInvoicesListEffect({
      page: page - 1,
      ...$outgoingInvoiceFilterProps,
    });
  }, [page, $outgoingInvoiceFilterProps]);

  const onChangeFilterItems = (field) => {
    updateFilterSearch(() => events.updateOutgoingInvoiceFilterPropsEvent({
      ...$outgoingInvoiceFilterProps,
      ...field
    }));
  };
  const onChangeRange = (values) => {
    const from = moment(values[0]).format();
    const to = moment(values[1]).format();

    events.updateOutgoingInvoiceFilterPropsEvent({
      page: page - 1,
      from,
      to
    });
  };
  const onFilterSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    updateFilterSearch(() => {
      events.updateOutgoingInvoiceFilterPropsEvent({
        page: page - 1,
        search: value
      });
    });
  };

  const changePagination = (page) => {
    setPage(page);
  };

  const data = (Array.isArray(invoicesList) ? invoicesList : []).map(
    (invoice, index) => {
      return {
        id: invoice.id,
        key: invoice.id,
        num: (page - 1) * 20 + index + 1,
        numInvoice: (
          <Link to={`${props.match.path}/${invoice.id}`}>
            {invoice.invoiceNumber}
          </Link>
        ),
        type: invoice.name,
        buyerName: invoice.customer.name,
        buyerTin: invoice.customer.tin || "-",
        sum: (
          <span
            style={{ width: "100%", textAlign: "right", whiteSpace: "nowrap" }}
          >
            {(invoice.totalPrice || 0).toLocaleString()}
          </span>
        ),
        date: moment(invoice.invoiceDate).format(DATE_FORMAT),
        numStock: invoice.stock && (
          <NavLink
            to={{
              pathname: `/warehouse/shipment/${invoice.stock.id}`,
            }}
            exact
          >
            {invoice.stock.name}
          </NavLink>
        ),
        status: (
          <Tag color={getStatusColor(invoice.status.code)}>
            {invoice.status?.name}
          </Tag>
        ),
        action:
          invoice.status.code === "DRAFT" ? (
            <Popover
              placement="bottomRight"
              trigger="click"
              content={
                <div>
                  <div className="custom__popover__item">
                    <Popconfirm
                      title="Вы уверены что хотите удалить?"
                      onConfirm={() => effects.deleteInvoiceEffect(invoice.id)}
                      okText="Да"
                      cancelText="Нет"
                      danger={true}
                      type="link"
                    >
                      <Button
                        loading={$deleteInvoice.loading}
                        style={{ color: "red", cursor: "pointer" }}
                      >
                        Удалить
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              }
            >
              <Button className="custom-button onlyicon b-r-30">
                <SettingsSvg />
              </Button>
            </Popover>
          ) : undefined,
      };
    }
  );

  const fromDateValue = $outgoingInvoiceFilterProps.from ? moment($outgoingInvoiceFilterProps.from) : null;
  const toDateValue = $outgoingInvoiceFilterProps.to ? moment($outgoingInvoiceFilterProps.to) : null;
  const onResetFilter = () => {
    setSearchValue("");
    events.resetOutgoingInvoiceFilterPropsEvent();
  };
  return (
    <>
      <div className="content-h1-wr">
        <div className="content-h1-wr__left">
          <Button
            className="custom-button add-button onlyicon b-r-30 m-r-10 rotate-left"
            onClick={() => props.history.goBack()}
          >
            <ArrowSvg />
          </Button>
          <h1>Отправленные cчет-фактуры</h1>
        </div>
        <div className="content-h1-wr__right">
          <div
            onClick={() => effects.syncInvoicesEffect()}
            style={{ cursor: "pointer", marginRight: 15, marginTop: 5 }}
          >
            <SyncOutlined
              spin={$syncInvoices.loading}
              style={{ color: "#009f3c", fontSize: "1.5em" }}
            />
          </div>
        </div>
      </div>
      <div className="site-content__in">
        <div className="filter-block">
          <div className="filter-block__item filter-search">
            <div className="filter-search__icon">
              <SearchSvg />
            </div>
            <Input
              placeholder="Поиск"
              value={searchValue}
              onChange={onFilterSearchChange}
            />
          </div>
          <div className="filter-block__item filter-search">
            <DatePicker.RangePicker
              {...($outgoingInvoiceFilterProps ? {value: [fromDateValue, toDateValue]} : {})}
              onChange={onChangeRange}
              format={DATE_FORMAT}
            />
          </div>
          <div className="filter-block__item">
            <Select
              className="custom-select"
              placeholder="Выберите cтатус"
              value={$outgoingInvoiceFilterProps.status || undefined}
              onChange={(status) =>
                onChangeFilterItems({ status, districtId: null })
              }
              allowClear
            >
              {($statusList.data || []).map((item) => (
                <Option value={item.code} key={item.code}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="filter-block__item">
            <Tooltip placement="topRight" title="Сбросить">
              <Button
                className="custom-button onlyicon success-button"
                onClick={onResetFilter}
              >
                <CloseModalSvg />
              </Button>
            </Tooltip>
          </div>
        </div>
        <div className="site-content__in__table">
          <Table
            loading={loading}
            dataSource={data}
            columns={columns}
            pagination={false}
          />
          <div className="site-content__in__table-pagination">
            <div className="site-content__in__table-total">
              Итого счет-фактур: {invoicesTotal}
            </div>
            <Pagination
              disabled={loading}
              onChange={changePagination}
              current={page ? page : 1}
              total={invoicesTotal}
              pageSize={20}
              showSizeChanger={false}
              hideOnSinglePage={true}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const getStatusName = ({ code }, list) =>
  list.find((s) => s.code === code)?.name;

const getStatusColor = (key) => {
  switch (key) {
    case "PENDING":
      return "processing";
    case "ACCEPTED":
      return "success";
    case "REJECTED":
      return "error";
    case "REVOKED":
      return "warning";
    default:
      return "default";
  }
};
