import React, { useEffect, useMemo, useState } from "react";
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
  Popover,
} from "antd";

import { CloseModalSvg, SearchSvg, DoneSvg } from "svgIcons/svg-icons";
import { ArrowSvg, SettingsSvg } from "svgIcons/svg-icons";
import { debounce } from "helpers/debounce";
import { Link, NavLink } from "react-router-dom";
import moment from "moment";
import effector from "../effector";
import { DATE_FORMAT } from "../../../screens/main/constants";

const { stores, events, effects } = effector;
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
    title: "ИНН Поставщика",
    dataIndex: "sellerTin",
  },
  {
    title: "Поставщик",
    dataIndex: "sellerName",
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

const initialFilterState = {
  search: "",
  date: null,
  type: null,
  status: null,
};

export const Invoices = (props) => {
  const $xFileInvoicesList = useStore(stores.$xFileInvoicesList);
  const $statusList = useStore(stores.$statusList);

  const { data: invoicesData, loading } = $xFileInvoicesList;
  const { items: invoicesList, total: invoicesTotal } = invoicesData;

  const [filterItems, setFilterItems] = useState(initialFilterState);
  const [page, setPage] = useState(1);

  useEffect(() => {
    effects.getXFileInvoicesListEffect({ page: page - 1 });
    !$statusList.data?.length && effects.getStatusListEffect();
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      effects.getXFileInvoicesListEffect({
        page: page - 1,
        ...filterItems,
        from: filterItems.from ? moment(filterItems.from).format() : undefined,
        to: filterItems.to ? moment(filterItems.to).format() : undefined,
      });
    }, 400);
    return () => clearTimeout(id);
  }, [page, filterItems]);

  const onChangeFilterItems = (field) => {
    setFilterItems((prev) => ({ ...prev, ...field }));
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
          <Link to={`${props.match.path}/${invoice.id}`}>{invoice.number}</Link>
        ),
        type: invoice.name,
        sellerTin: invoice.sellerTin,
        sellerName: invoice.sellerName,
        sum: (
          <span
            style={{ width: "100%", textAlign: "right", whiteSpace: "nowrap" }}
          >
            {(invoice.total || 0).toLocaleString()}
          </span>
        ),
        date: moment(invoice.sendDate || invoice.createdDate).format(
          DATE_FORMAT
        ),
        status: (
          <Tag color={getStatusColor(invoice.status)}>
            {getStatusName(invoice.status, $statusList.data)}
          </Tag>
        ),
        action: (
          <Popover
            overlayClassName="custom__popover"
            placement="bottomRight"
            trigger="click"
            content={
              <div>
                <div className="custom__popover__item">
                  <NavLink
                    to={{
                      pathname: "/warehouse/stock/add",
                      state: {
                        invoiceId: invoice.id,
                      },
                    }}
                    exact
                  >
                    <Button
                      className="custom-button primary-button"
                      onClick={() => {}}
                    >
                      Оприходовать
                    </Button>
                  </NavLink>
                </div>
              </div>
            }
          >
            <Button className="custom-button onlyicon b-r-30">
              <SettingsSvg />
            </Button>
          </Popover>
        ),
      };
    }
  );

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
          <h1>Полученные cчет-фактуры</h1>
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
              value={filterItems.search}
              onChange={(name) =>
                onChangeFilterItems({ search: name.target.value })
              }
            />
          </div>
          <div className="filter-block__item filter-search">
            <DatePicker.RangePicker
              onChange={(date, arr) => {
                let from;
                let to;
                if (date && date.length === 2) {
                  from = `${arr[0]}`;
                  to = `${arr[1]}`;
                }

                onChangeFilterItems({
                  from: date ? moment(from).format("YYYY-MM-DDTHH:mm") : null,
                  to: date
                    ? moment(to).endOf("day").format("YYYY-MM-DDTHH:mm")
                    : null,
                });
              }}
              format={"YYYY-MM-DD"}
            />
          </div>
          <div className="filter-block__item filter-search">
            <Select
              className="custom-select"
              placeholder="Выберите cтатус"
              value={filterItems.status || undefined}
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
                onClick={() => onChangeFilterItems(initialFilterState)}
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

const getStatusName = (code, list) => list.find((s) => s.code === code)?.name;

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
