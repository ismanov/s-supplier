import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { Link, NavLink, useHistory } from "react-router-dom";
import {
  Button,
  Form,
  Modal,
  Pagination,
  Popconfirm,
  Popover,
  Select,
  Table,
} from "antd";
import Moment from "react-moment";

import effector from "../effector";

import { OrdersListFilter } from "../organisms/orders-list-filter";
import { DATE_FORMAT, ORDER_STATUSES } from "../../../screens/main/constants";
import {
  ArrowSvg,
  CloseModalSvg,
  SettingsSvg,
  TrashSvg,
} from "svgIcons/svg-icons";
import Show from "ui/molecules/show";

const { Option } = Select;

const { store, events, effects } = effector;
const columns = [
  {
    title: "№",
    dataIndex: "number",
    width: 50,
  },
  {
    title: "Номер заказа",
    dataIndex: "orderNumber",
  },
  {
    title: "Клиент",
    dataIndex: "customer",
  },
  {
    title: "Договор",
    dataIndex: "contractNumber",
  },
  {
    title: "Дата заказа",
    dataIndex: "orderDate",
  },
  {
    title: "Дата отгрузки",
    dataIndex: "shipmentDate",
  },
  {
    title: "Номер отгрузки",
    dataIndex: "shipmentNumber",
  },
  {
    title: "Статус",
    dataIndex: "status",
  },
  {
    title: "",
    dataIndex: "action",
  },
];

export const OrdersList = ({ match }) => {
  const [form] = Form.useForm();
  const history = useHistory();
  const { $ordersList, $ordersFilterProps, $orderStatusItems } =
    useStore(store);
  const [statusModal, setStatusModal] = useState(false);

  const { data: ordersData, loading } = $ordersList;
  const {
    content: orders,
    totalElements: ordersTotal,
    size: ordersPageSize,
    number: ordersPageNumber,
  } = ordersData;

  useEffect(() => {
    effects.getOrdersListEffect({
      ...$ordersFilterProps,
      sortOrder: "desc",
      orderBy: "id",
    });
  }, [$ordersFilterProps]);

  const changePagination = (page) => {
    events.updateOrdersFilterPropsEvent({
      page: page - 1,
    });
  };

  const onChangeStatus = (values) => {
    effects.updateOrderStatusEffect(values).then((response) => {
      if (response.status === 200) {
        setStatusModal(false);
        form.resetFields();
        effects.getOrdersListEffect({
          ...$ordersFilterProps,
          sortOrder: "desc",
          orderBy: "id",
        });
      }
    });
  };

  const onDeleteOrder = (id) => {
    effects.deleteOrderItemEffect(id).then((response) => {
      if (response.status === 200) {
        effects.getOrdersListEffect({
          ...$ordersFilterProps,
          sortOrder: "desc",
          orderBy: "id",
        });
      }
    });
  };

  const data = (orders || []).map((order, index) => {
    const canShip =
      (!order.stock && order.status.code === ORDER_STATUSES.NEW) ||
      order.status.code === ORDER_STATUSES.APPROVED;
    return {
      id: order.id,
      key: order.id,
      number: (
        <div className="w-s-n">
          {ordersPageSize * ordersPageNumber + index + 1}
        </div>
      ),
      orderNumber: (
        <Link to={`${match.path}/view/${order.id}`}>{order.orderNumber}</Link>
      ),
      customer: order.customer.name,
      contractNumber: order.contractNumber,
      orderDate: <Moment format={DATE_FORMAT} date={order.orderDate} />,
      shipmentDate: <Moment format={DATE_FORMAT} date={order.shipmentDate} />,
      shipmentNumber: order.stock?.id ? (
        <Link to={`/warehouse/shipment/${order.stock?.id}`}>
          {order.stock?.name}
        </Link>
      ) : (
        "-"
      ),
      status: (
        <span className={`orders-main__status-${order.status.code}`}>
          {order.status.name}
        </span>
      ),
      action: (
        <Popover
          overlayClassName="custom__popover"
          placement="bottomRight"
          trigger="click"
          content={
            <div>
              <ActionButton
                hidden={!["DRAFT", "NEW"].includes(String(order.status?.code))}
                onClick={() =>
                  history.push({ pathname: "orders/add", state: order.id })
                }
              >
                Редактировать
              </ActionButton>
              <ActionButton hidden={!canShip}>
                <NavLink
                  to={{
                    pathname: "/warehouse/shipment/add",
                    state: {
                      orderId: order.id,
                    },
                  }}
                  exact
                >
                  <span style={{ color: "black" }}>Отгрузить</span>
                </NavLink>
              </ActionButton>
              <ActionButton
                hidden={order.status?.code !== "NEW"}
                onClick={() =>
                  onChangeStatus({ status: "APPROVED", id: order.id })
                }
              >
                Одобрить
              </ActionButton>
              <ActionButton
                hidden={order.status?.code !== "NEW"}
                danger
                onClick={() =>
                  onChangeStatus({ status: "REJECTED", id: order.id })
                }
              >
                Отклонить
              </ActionButton>
              <ActionButton
                hidden={order.status?.code !== "APPROVED"}
                onClick={() =>
                  onChangeStatus({ status: "IN_PROGRESS", id: order.id })
                }
              >
                В процессе
              </ActionButton>
              <div className="custom__popover__item">
                <Popconfirm
                  title="Вы уверены что хотите удалить заказ?"
                  onConfirm={() => onDeleteOrder(order.id)}
                  okText="Да"
                  cancelText="Нет"
                >
                  <Button className="custom-button primary-button">
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
      ),
    };
  });

  const statusOptions = ($orderStatusItems.data || []).map((item) => (
    <Option value={item.code} key={item.code}>
      {item.name}
    </Option>
  ));

  return (
    <>
      <Modal
        className="custom-modal"
        title="Изменить статус"
        visible={statusModal}
        onCancel={() => setStatusModal(false)}
        footer={null}
        width={464}
        centered={true}
        closeIcon={<CloseModalSvg />}
      >
        <Form onFinish={onChangeStatus} form={form}>
          <Form.Item
            name="status"
            labelAlign="left"
            label="Выберите статус"
            labelCol={{ sm: { span: 24 } }}
            rules={[{ required: true, message: "Выберите статус" }]}
          >
            <Select className="custom-select" placeholder="Выберите статус">
              {statusOptions}
            </Select>
          </Form.Item>
          <Form.Item name="id" />
          <div className="custom-modal__button-row">
            <Button
              htmlType="submit"
              className="custom-button primary-button fullwidth"
            >
              Сохранить
            </Button>
          </div>
        </Form>
      </Modal>
      <div className="content-h1-wr">
        <div className="content-h1-wr__left">
          <Button
            className="custom-button add-button onlyicon b-r-30 m-r-10 rotate-left"
            onClick={() => history.goBack()}
          >
            <ArrowSvg />
          </Button>
          <h1>Заказы</h1>
        </div>
        <div className="content-h1-wr__right">
          <Button
            className="custom-button primary-button"
            onClick={() => history.push("orders/add")}
          >
            Добавить
          </Button>
        </div>
      </div>
      <div className="orders-main site-content__in">
        <OrdersListFilter />
        <div className="site-content__in__table">
          <Table
            loading={loading}
            dataSource={data}
            columns={columns}
            pagination={false}
          />
          <div className="site-content__in__table-pagination">
            <div className="site-content__in__table-total">
              Всего заказов: {ordersTotal}
            </div>
            <Pagination
              disabled={loading}
              onChange={changePagination}
              current={
                $ordersFilterProps.page ? $ordersFilterProps.page + 1 : 1
              }
              total={ordersTotal}
              pageSize={ordersPageSize}
              showSizeChanger={false}
              hideOnSinglePage={true}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const ActionButton = (props) => {
  return (
    <Show if={!props.hidden}>
      <div className="custom__popover__item">
        <Button className="custom-button primary-button" {...props}>
          <span style={{ color: props.danger ? "red" : "black" }}>
            {props.children}
          </span>
        </Button>
      </div>
    </Show>
  );
};
