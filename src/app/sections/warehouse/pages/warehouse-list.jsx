import React, { useEffect, useMemo, useState } from "react";
import { useStore } from "effector-react";
import { Link } from "react-router-dom";
import InputMask from "react-input-mask";
import {
  Button,
  Pagination,
  Table,
  Modal,
  Form,
  Input,
  Select,
  Radio,
  Tooltip,
  Alert,
  Spin,
  Popover,
} from "antd";

import effector from "../effector";

import { FormField } from "ui/molecules/form-field";
import { ArrowSvg, SettingsSvg } from "svgIcons/svg-icons";
import { StockListFilter } from "../organisms/stock-list-filter";
import moment from "moment";
import { DATE_FORMAT } from "../../../screens/main/constants";
import { CloseModalSvg, SearchSvg } from "svgIcons/svg-icons";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";
const { stores, events, effects } = effector;

const columns = [
  {
    title: "№",
    dataIndex: "num",
  },
  {
    title: "Название склада",
    dataIndex: "warehouseName",
  },
  {
    title: "Регион",
    dataIndex: "region",
  },
  {
    title: "Район",
    dataIndex: "district",
  },
  {
    title: "Адрес",
    dataIndex: "address",
  },
  {
    title: "Ответственное лицо",
    dataIndex: "responsiblePerson",
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
const initialFilterState = {
  search: "",
  regionId: null,
  districtId: null,
  responsiblePersonId: null,
  status: null,
};

export const WarehouseList = (props) => {
  const $warehouseList = useStore(stores.$warehouseList);
  const $regionItems = useStore(stores.$regionItems);
  const $districtItems = useStore(stores.$districtItems);
  const $employeesList = useStore(stores.$employeesList);

  const { data: warehouseData, loading } = $warehouseList;
  const {
    content: warehouseList,
    totalElements: warehouseTotal,
    size: warehousePageSize,
  } = warehouseData;

  const [visible, setVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [filterItems, setFilterItems] = useState(initialFilterState);
  const [page, setPage] = useState(1);
  const [warehouseId, setWarehouseId] = useState(null);
  const [warehouse, setWarehouse] = useState(null);

  const filteredWarehouseList = useMemo(
    () =>
      warehouseList.filter(
        (warehouse) =>
          (((warehouse.name
            ?.toLowerCase()
            .includes(filterItems.search.toLowerCase()) ||
            warehouse.address?.apartment
              ?.toLowerCase()
              .includes(filterItems.search.toLowerCase())) &&
            (!filterItems.regionId ||
              warehouse.address?.region?.id === filterItems.regionId) &&
            (!filterItems.districtId ||
              warehouse.address?.district?.id === filterItems.districtId) &&
            !filterItems.responsiblePersonId) ||
            warehouse.owner?.id === filterItems.responsiblePersonId) &&
          (!filterItems.status || warehouse.status?.code === filterItems.status)
      ),
    [filterItems, warehouseList]
  );

  useEffect(() => {
    effects.getWarehouseListEffect({ page: page - 1 });
    effects.getRegionItemsEffect();
    effects.getEmployeesListEffect();
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      effects.getWarehouseListEffect({
        page: page - 1,
        ...filterItems,
      });
    }, 400);
    return () => clearTimeout(id);
  }, [page, filterItems]);

  useEffect(() => {
    filterItems.regionId &&
      effects.getDistrictItemsEffect(filterItems.regionId);
  }, [filterItems.regionId]);

  const onChangeFilterItems = (field) => {
    setFilterItems((prev) => ({ ...prev, ...field }));
  };

  const changePagination = (page) => {
    setPage(page);
  };

  const data = (Array.isArray(warehouseList) ? warehouseList : []).map(
    (warehouse, index) => {
      return {
        id: warehouse.id,
        key: warehouse.id,
        num: (page - 1) * 20 + index + 1,
        warehouseName: warehouse.name,
        region: warehouse.address?.region?.name || "",
        district: warehouse.address?.district?.name || "",
        address: `${warehouse.address?.street || ""} ${
          warehouse.address?.house || ""
        }${
          warehouse.address?.house && warehouse.address?.apartment ? "\\" : ""
        }${warehouse.address?.apartment || ""}`,
        responsiblePerson:
          (warehouse.owner?.firstName || "") +
          " " +
          (warehouse.owner?.lastName || ""),
        status: warehouse.status?.name || "",
        action: (
          <Popover
            overlayClassName="custom__popover"
            placement="bottomRight"
            trigger="click"
            content={
              <div>
                <div className="custom__popover__item">
                  <Button
                    className="custom-button primary-button"
                    onClick={() => {
                      setWarehouse(warehouse);
                      setWarehouseId(warehouse.id);
                      setVisible(true);
                    }}
                  >
                    Редактировать
                  </Button>
                </div>
                <div className="custom__popover__item">
                  <Button
                    className="custom-button primary-button"
                    onClick={() => {
                      setWarehouse(warehouse);
                      setStatusModalVisible(true);
                    }}
                  >
                    Изменить статус
                  </Button>
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
      <ModalForm
        visible={visible}
        closeModal={() => {
          setWarehouseId(null);
          setWarehouse(null);
          setVisible(false);
          events.resetCreateAndUpdateWarehouseEvent();
        }}
        regionItems={$regionItems}
        employeesList={$employeesList}
        warehouseId={warehouseId}
        warehouse={warehouse}
        onSuccess={() => effects.getWarehouseListEffect({ page: page - 1 })}
      />
      <ChangeUserBranchStatusModal
        visible={statusModalVisible}
        warehouse={warehouse}
        onSuccess={() => effects.getWarehouseListEffect({ page: page - 1 })}
        closeModal={() => {
          setStatusModalVisible(false);
          setWarehouse(null);
        }}
      />
      <div className="content-h1-wr">
        <div className="content-h1-wr__left">
          <Button
            className="custom-button add-button onlyicon b-r-30 m-r-10 rotate-left"
            onClick={() => props.history.goBack()}
          >
            <ArrowSvg />
          </Button>
          <h1>Склады</h1>
        </div>
        <div className="content-h1-wr__right">
          <Button
            className="custom-button primary-button"
            onClick={() => {
              setWarehouseId(null);
              setWarehouse(null);
              setVisible(true);
            }}
          >
            Добавить
          </Button>
        </div>
      </div>
      <div className="site-content__in">
        <div className="filter-block">
          <div className="filter-block__item filter-search">
            <div className="filter-search__icon">
              <SearchSvg />
            </div>
            <Input
              placeholder="Поиск по складам"
              value={filterItems.search}
              onChange={(name) =>
                onChangeFilterItems({ search: name.target.value })
              }
            />
          </div>
          <div className="filter-block__item">
            <Select
              className="custom-select"
              placeholder="Выберите Регион"
              value={filterItems.regionId || undefined}
              onChange={(regionId) =>
                onChangeFilterItems({ regionId, districtId: null })
              }
              allowClear
            >
              {Array.isArray($regionItems.data) &&
                $regionItems.data.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </div>
          {/* <div className="filter-block__item filter-search">
            <div className="filter-search__icon">
              <SearchSvg />
            </div>
            <Select
              className="custom-select"
              placeholder="Выберите Район"
              disabled={!filterItems.regionId}
              value={filterItems.districtId || undefined}
              onChange={(districtId) => onChangeFilterItems({ districtId })}
              allowClear
            >
              {Array.isArray($districtItems.data) &&
                $districtItems.data.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </div> */}
          {/* <div className="filter-block__item filter-search">
            <div className="filter-search__icon">
              <SearchSvg />
            </div>
            <Select
              className="custom-select"
              placeholder="Выберите Ответственное лицо"
              value={filterItems.responsiblePersonId || undefined}
              onChange={(responsiblePersonId) =>
                onChangeFilterItems({ responsiblePersonId })
              }
              allowClear
            >
              {Array.isArray($employeesList.data?.content) &&
                $employeesList.data.content.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.firstName + item.lastName}
                  </Option>
                ))}
            </Select>
          </div> */}
          <div className="filter-block__item">
            <Select
              className="custom-select"
              placeholder="Выберите Статус"
              onChange={(status) => onChangeFilterItems({ status })}
              allowClear
            >
              {[
                { name: "Активный", code: "ACTIVE" },
                { name: "Не активный", code: "IN_ACTIVE" },
              ].map((status) => (
                <Option key={status.code} value={status.code}>
                  {status.name}
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
              Всего: {warehouseTotal}
            </div>
            <Pagination
              disabled={loading}
              onChange={changePagination}
              current={page ? page : 1}
              total={warehouseTotal}
              pageSize={warehousePageSize}
              showSizeChanger={false}
              hideOnSinglePage={true}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const initialAddItems = {
  name: "",
  regionId: undefined,
  districtId: undefined,
  street: "",
  house: "",
  apartment: "",
  branches: [],
  ownerId: undefined,
  status: "ACTIVE",
};

const ModalForm = ({
  visible,
  closeModal,
  afterClose,
  regionItems: $regionItems,
  employeesList: $employeesList,
  warehouseId,
  warehouse,
  onSuccess,
}) => {
  const $districtItems = useStore(stores.$districtItemsForModal);
  const $branchesList = useStore(stores.$branchesList);
  const $createAndUpdateWarehouse = useStore(stores.$createAndUpdateWarehouse);

  const [addItems, setAddItems] = useState(initialAddItems);
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    if ($createAndUpdateWarehouse.success) {
      openNotificationWithIcon(
        "success",
        warehouseId ? "Склад изменен" : "Склад добавлен"
      );
      onSuccess && onSuccess();
      closeModal();
      setAddItems(initialAddItems);
    }
  }, [$createAndUpdateWarehouse.success]);

  useEffect(() => {
    effects.getBranchesListEffect({});
    if (warehouseId) {
      setAddItems({
        name: warehouse.name,
        regionId: warehouse.address?.region?.id,
        districtId: warehouse.address?.district?.id,
        street: warehouse.address?.street,
        house: warehouse.address?.house,
        apartment: warehouse.address?.apartment,
        branches: warehouse.branches?.map((branch) => branch.id),
        ownerId: warehouse.owner?.id,
        status: warehouse.status?.code,
      });
    }
  }, [warehouseId]);

  useEffect(() => {
    if (addItems.regionId)
      effects.getDistrictItemsForModalEffect(addItems.regionId);
  }, [addItems.regionId]);

  const onChange = (field) => {
    setAddItems((prev) => ({ ...prev, ...field }));
  };
  const onSubmit = () => {
    setSubmit(true);
    if (addItems.name) {
      effects.createAndUpdateWarehouseEffect({
        data: {
          address: {
            apartment: addItems.apartment,
            districtId: addItems.districtId,
            house: addItems.house,
            regionId: addItems.regionId,
            street: addItems.street,
          },
          branches: addItems.branches,
          status: addItems.status,
          name: addItems.name,
          ownerId: addItems.ownerId,
        },
        method: warehouseId ? "PUT" : "POST",
        id: warehouseId ? `/${warehouseId}` : "",
      });
    }
  };

  return (
    <Modal
      className="custom-modal"
      title={warehouseId ? "Редактировать склад" : "Добавить склад"}
      visible={visible}
      onCancel={() => {
        closeModal();
        setAddItems(initialAddItems);
      }}
      afterClose={() => {
        closeModal();
        afterClose && afterClose();
        setAddItems(initialAddItems);
      }}
      footer={null}
      width={464}
      centered={true}
      closeIcon={<CloseModalSvg />}
    >
      <FormState
        loading={$createAndUpdateWarehouse.loading}
        error={$createAndUpdateWarehouse.error}
      />
      <Form onFinish={onSubmit}>
        <FormField
          title="Название склада"
          error={
            submit && !addItems.name && "Пожалуйста введите  название склада"
          }
        >
          <Input
            placeholder="Введите название склада"
            value={addItems.name}
            onChange={(name) => onChange({ name: name.target.value })}
          />
        </FormField>
        <div className="custom-modal__double-row">
          <div className="custom-modal__double-row-item">
            <FormField title="Регион">
              <Select
                loading={false}
                placeholder="Выбрать регион"
                value={addItems.regionId}
                onChange={(regionId) =>
                  onChange({ regionId, districtId: null })
                }
              >
                {Array.isArray($regionItems.data) &&
                  $regionItems.data.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
              </Select>
            </FormField>
          </div>
          <div className="custom-modal__double-row-item">
            <FormField title="Район">
              <Select
                loading={$districtItems.loading}
                placeholder="Выбрать район"
                disabled={!addItems.regionId}
                value={addItems.districtId}
                onChange={(districtId) => onChange({ districtId })}
              >
                {Array.isArray($districtItems.data) &&
                  $districtItems.data.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
              </Select>
            </FormField>
          </div>
        </div>
        <FormField title="Адрес">
          <Input
            placeholder="Введите адрес"
            value={addItems.street}
            onChange={(street) => onChange({ street: street.target.value })}
          />
        </FormField>
        {/* <div className="custom-modal__double-row">
          <div className="custom-modal__double-row-item">
            <FormField title="Дом">
              <Input
                value={addItems.house}
                placeholder="Введите номер дома"
                onChange={(house) => onChange({ house: house.target.value })}
              />
            </FormField>
          </div>
          <div className="custom-modal__double-row-item">
            <FormField title="Kвартирa">
              <Input
                placeholder="Введите номер квартиры"
                value={addItems.apartment}
                onChange={(apartment) =>
                  onChange({ apartment: apartment.target.value })
                }
              />
            </FormField>
          </div>
        </div> */}
        <FormField title="Привязанные филиалы">
          <Select
            loading={$branchesList.loading}
            placeholder="Выберите филиалы"
            mode="multiple"
            value={addItems.branches}
            onChange={(branches) => onChange({ branches })}
          >
            {Array.isArray($branchesList.data?.content) &&
              $branchesList.data.content.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </FormField>
        <FormField title="Ответственное лицо">
          <Select
            className="custom-select"
            placeholder="Выберите oтветственное лицо"
            value={addItems.ownerId}
            onChange={(ownerId) => onChange({ ownerId })}
            allowClear
          >
            {Array.isArray($employeesList.data) &&
              $employeesList.data.map((item) => (
                <Option value={item.id} key={item.id}>
                  warehouse.owner?.firstName
                </Option>
              ))}
          </Select>
        </FormField>
        <div>
          <Radio.Group
            value={addItems.status}
            onChange={(status) => onChange({ status: status.target.value })}
          >
            <Radio value="ACTIVE">Активный</Radio>
            <Radio value="IN_ACTIVE">Не активный</Radio>
          </Radio.Group>
        </div>
        <div className="custom-modal__button-row">
          <Button
            htmlType="submit"
            className="custom-button primary-button fullwidth"
          >
            {warehouseId ? "Сохранить" : "Добавить"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

const FormState = ({ error, loading }) => {
  return (
    <div>
      {error && (
        <div className="m-b-20">
          <Alert message={error.detail || error.title} type="error" />
        </div>
      )}
      {loading && (
        <div className="abs-loader">
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};

export const ChangeUserBranchStatusModal = ({
  warehouse,
  closeModal,
  visible,
  onSuccess,
}) => {
  const $changeWarehouseStatus = useStore(stores.$changeWarehouseStatus);
  const [submit, setSubmit] = useState(false);
  const [status, setStatus] = useState();

  useEffect(() => {
    if (warehouse?.status?.code) setStatus(warehouse?.status?.code);
  }, [warehouse]);

  useEffect(() => {
    if ($changeWarehouseStatus.success) {
      openNotificationWithIcon("success", "Статус обновлен");
      closeModal();
      onSuccess && onSuccess();
      events.resetChangeWarehouseStatusEvent();
    }
  }, [$changeWarehouseStatus.success]);

  const onSubmit = () => {
    setSubmit(true);

    if (status) {
      effects.changeWarehouseStatusEffect({
        id: warehouse?.id,
        status,
      });
    }
  };

  return (
    <Modal
      className="custom-modal"
      title={`Статус филиала ${warehouse?.name}`}
      visible={visible}
      onCancel={() => {
        events.resetChangeWarehouseStatusEvent();
        closeModal();
      }}
      footer={null}
      width={464}
      centered={true}
      closeIcon={<CloseModalSvg />}
    >
      <FormState
        error={$changeWarehouseStatus.error}
        loading={$changeWarehouseStatus.loading}
      />
      <Form onFinish={onSubmit}>
        <FormField
          title="Статус"
          error={submit && !status && "Не заполнено поле"}
        >
          <Select
            placeholder="Выбрать статус"
            value={status}
            onChange={(status) => setStatus(status)}
          >
            <Option value="ACTIVE">Активный</Option>
            <Option value="IN_ACTIVE">Не активный</Option>
          </Select>
        </FormField>
        <div className="custom-modal__button-row">
          <Button
            htmlType="submit"
            disabled={warehouse?.status?.code === status}
            className="custom-button primary-button fullwidth"
          >
            Сохранить
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
