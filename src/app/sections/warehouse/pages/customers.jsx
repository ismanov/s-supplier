import React, { useEffect, useMemo, useState } from "react";
import { useStore } from "effector-react";
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
  Popconfirm,
  DatePicker,
} from "antd";

import effector from "../effector";
import userEffector from "../../user/effector";

import { FormField } from "ui/molecules/form-field";
import { ArrowSvg, SettingsSvg } from "svgIcons/svg-icons";
import { CloseModalSvg, SearchSvg, DoneSvg } from "svgIcons/svg-icons";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";
import moment from "moment";
const { stores, events, effects } = effector;
const {
  store: userStores,
  events: userEvents,
  effects: userEffects,
} = userEffector;

const columns = [
  {
    title: "№",
    dataIndex: "num",
  },
  {
    title: "ИНН",
    dataIndex: "tin",
  },
  {
    title: "Название",
    dataIndex: "name",
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
    title: "Контактное  лицо",
    dataIndex: "contactPerson",
  },
  {
    title: "Номер телефона",
    dataIndex: "phone",
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

export const Customers = (props) => {
  const $customersList = useStore(stores.$customerList);
  const $regionItems = useStore(stores.$regionItems);
  const $employeesList = useStore(stores.$employeesList);

  const $createAndUpdateCustomer = useStore(stores.$createAndUpdateCustomer);

  const { data: customersData, loading } = $customersList;
  const {
    content: customersList,
    totalElements: customersTotal,
    size: customersPageSize,
  } = customersData;

  const [visible, setVisible] = useState(false);
  const [filterItems, setFilterItems] = useState(initialFilterState);
  const [page, setPage] = useState(1);
  const [customerId, setCustomerId] = useState(null);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    effects.getCustomerListEffect({ page: page - 1 });
    effects.getRegionItemsEffect();
    effects.getEmployeesListEffect();
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      effects.getCustomerListEffect({
        page: page - 1,
        ...filterItems,
      });
    }, 400);
    return () => clearTimeout(id);
  }, [page, filterItems]);

  useEffect(() => {
    if ($createAndUpdateCustomer.success && !visible) {
      openNotificationWithIcon("success", "Клиент удален");
      events.resetCreateAndUpdateCustomerEvent();
      effects.getCustomerListEffect({
        page: page - 1,
        ...filterItems,
      });
    }
  }, [$createAndUpdateCustomer.success]);

  const onChangeFilterItems = (field) => {
    setFilterItems((prev) => ({ ...prev, ...field }));
  };

  const changePagination = (page) => {
    setPage(page);
  };

  const data = (Array.isArray(customersList) ? customersList : []).map(
    (customer, index) => {
      return {
        id: customer.id,
        key: customer.id,
        num: index + 1,
        tin: customer.tin,
        name: customer.name,
        region: customer.address?.region?.name,
        district: customer.address?.district?.name,
        address: customer.address?.street,
        contactPerson: customer.contactPerson,
        phone: customer.phone ? "+" + customer.phone : "",
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
                      setCustomer(customer);
                      setCustomerId(customer.id);
                      setVisible(true);
                    }}
                  >
                    Редактировать
                  </Button>
                </div>
                <div className="custom__popover__item">
                  <Popconfirm
                    title="Вы уверены что хотите удалить?"
                    onConfirm={() =>
                      effects.createAndUpdateCustomerEffect({
                        method: "DELETE",
                        id: customer.id,
                      })
                    }
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
    }
  );

  return (
    <>
      <ModalForm
        visible={visible}
        closeModal={() => {
          setCustomerId(null);
          setCustomer(null);
          setVisible(false);
          events.resetCreateAndUpdateCustomerEvent();
        }}
        regionItems={$regionItems}
        employeesList={$employeesList}
        customerId={customerId}
        customer={customer}
        onSuccess={() => effects.getCustomerListEffect({ page: page - 1 })}
      />
      <div className="content-h1-wr">
        <div className="content-h1-wr__left">
          <Button
            className="custom-button add-button onlyicon b-r-30 m-r-10 rotate-left"
            onClick={() => props.history.goBack()}
          >
            <ArrowSvg />
          </Button>
          <h1>Клиенты</h1>
        </div>
        <div className="content-h1-wr__right">
          <Button
            className="custom-button primary-button"
            onClick={() => {
              setCustomerId(null);
              setCustomer(null);
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
              placeholder="Поиск"
              value={filterItems.search}
              onChange={(name) =>
                onChangeFilterItems({ search: name.target.value })
              }
            />
          </div>
          <div className="filter-block__item filter-search">
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
              Всего клиентов: {customersTotal}
            </div>
            <Pagination
              disabled={loading}
              onChange={changePagination}
              current={page ? page : 1}
              total={customersTotal}
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

const initialAddItems = {
  tin: "",
  name: "",
  regionId: undefined,
  districtId: undefined,
  address: "",
  contactPerson: "",
  phone: "",
};

const ModalForm = ({
  visible,
  closeModal,
  afterClose,
  regionItems: $regionItems,
  employeesList: $employeesList,
  customerId,
  customer,
  onSuccess,
}) => {
  const $districtItems = useStore(stores.$districtItemsForModal);
  const $customerAndSupplierDetails = useStore(
    stores.$customerAndSupplierDetails
  );
  const $createAndUpdateCustomer = useStore(stores.$createAndUpdateCustomer);
  const $infoByTin = useStore(stores.$infoByTin);
  const { $companyBanks, $companyBankBranches } = useStore(userStores);

  const [addItems, setAddItems] = useState(initialAddItems);
  const [submit, setSubmit] = useState(false);
  const [type, setType] = useState("ИНН");

  useEffect(() => {
    if (visible) {
      !$companyBanks.data.length &&
        userEffects.getCompanyBanksEffect({
          orderBy: "id",
          size: 100,
        });
      return () => {
        events.resetInfoByTinEvent();
        events.resetBankInfoByTinEvent();
        userEvents.resetCompanyBanksEvent();
      };
    }
  }, [visible]);

  useEffect(() => {
    addItems.bankId &&
      userEffects.getCompanyBankBranchesEffect({
        orderBy: "id",
        parentId: addItems.bankId,
        size: 100,
      });
    return () => {
      userEvents.resetCompanyBankBranchesEvent();
    };
  }, [addItems.bankId]);

  useEffect(() => {
    if ($createAndUpdateCustomer.success && visible) {
      openNotificationWithIcon(
        "success",
        customerId ? "Клиент изменен" : "Клиент добавлен"
      );
      onSuccess && onSuccess();
      closeModal();
      setAddItems(initialAddItems);
    }
  }, [$createAndUpdateCustomer.success]);

  useEffect(() => {
    const customer = $customerAndSupplierDetails.data;
    if (customerId && Object.keys(customer).length > 0) {
      setAddItems({
        tin: customer.tin,
        name: customer.name,
        regionId: customer.address?.region?.id,
        districtId: customer.address?.district?.id,
        street: customer.address?.street,
        house: customer.address?.house,
        apartment: customer.address?.apartment,
        contactPerson: customer.contactPerson,
        contractNumber: customer.contractNumber,
        contractDate: customer.contractDate,
        phone: customer.phone,
        bankId: customer.bankDetail?.parentBank?.id,
        accountNumber: customer.bankDetail?.accountNumber,
        oked: customer.bankDetail?.oked || undefined,
        bankBranchId: customer.bankDetail?.bank?.id || undefined,
        bankDetailId: customer.bankDetail?.id,
      });
      setType(customer?.tin?.length === 9 ? "ИНН" : "ПИНФЛ");
      events.resetCustomerAndSupplierDetailsEvent();
    }
  }, [$customerAndSupplierDetails.data]);

  useEffect(() => {
    effects.getBranchesListEffect({});
    if (customerId) {
      effects.getCustomerAndSupplierDetailsEffect(customerId);
    }
  }, [customerId]);

  useEffect(() => {
    const info = $infoByTin.data;
    if (Object.keys($infoByTin?.data).length > 0 && info) {
      setAddItems({
        ...addItems,
        tin: info.tin,
        name: info.name,
        regionId: info.address?.region?.id || undefined,
        districtId: info.address?.district?.id || undefined,
        street: info.address?.street,
        bankId: info.bankDetail?.parentBank?.id,
        accountNumber: info.bankDetail?.accountNumber,
        oked: info.bankDetail?.oked || undefined,
        bankBranchId: info.bankDetail?.bank?.id || undefined,
      });
    }
  }, [$infoByTin.data]);

  useEffect(() => {
    if (addItems.regionId)
      effects.getDistrictItemsForModalEffect(addItems.regionId);
  }, [addItems.regionId]);

  const onChange = (field) => {
    setAddItems((prev) => ({ ...prev, ...field }));
  };

  const onTinChange = (e) => {
    const len = type === "ИНН" ? 9 : 14;
    const value = e.target.value.replace(/[^0-9]/g, "");

    if (value.length === len && addItems.tin !== value) {
      effects.getInfoByTinEffect(value);
    }

    onChange({ tin: value });
  };

  const onSubmit = () => {
    setSubmit(true);
    if (
      addItems.name &&
      addItems.bankId &&
      addItems.bankBranchId &&
      addItems.accountNumber &&
      addItems.oked
    ) {
      const id = {};
      if (customerId) id.id = customerId;
      effects.createAndUpdateCustomerEffect({
        data: {
          address: {
            apartment: addItems.apartment,
            districtId: addItems.districtId,
            house: addItems.house,
            regionId: addItems.regionId,
            street: addItems.street,
          },
          bank: {
            accountNumber: addItems.accountNumber,
            bankId: addItems.bankBranchId,
            main: true,
            oked: addItems.oked,
            id: addItems.bankDetailId,
          },
          name: addItems.name,
          contactPerson: addItems.contactPerson,
          tin: addItems.tin,
          phone: addItems.phone,
          ...id,
          contractDate: addItems.contractDate,
          contractNumber: addItems.contractNumber,
        },
        method: customerId ? "PUT" : "POST",
        id: customerId || "",
      });
    }
  };

  return (
    <Modal
      className="custom-modal"
      title={customerId ? "Редактировать Клиент" : "Добавить клиент"}
      visible={visible}
      afterClose={() => {}}
      onCancel={() => {
        closeModal();
        setAddItems(initialAddItems);
      }}
      afterClose={() => {
        closeModal();
        afterClose && afterClose();
        setAddItems(initialAddItems);
        events.resetCreateAndUpdateCustomerEvent();
        userEvents.resetCompanyBankBranchesEvent();
        setSubmit(false);
      }}
      footer={null}
      width={464}
      centered={true}
      closeIcon={<CloseModalSvg />}
    >
      <FormState
        loading={$createAndUpdateCustomer.loading}
        error={$createAndUpdateCustomer.error}
      />
      <Form onFinish={onSubmit}>
        <FormField
          className="mbc"
          title={
            <Radio.Group value={type} onChange={(t) => setType(t.target.value)}>
              <Radio value="ИНН">ИНН</Radio>
              <Radio value="ПИНФЛ">ПИНФЛ</Radio>
            </Radio.Group>
          }
          error={
            $infoByTin.error
              ? $infoByTin.error.title
              : submit && !addItems.tin && "Пожалуйста введите ИНН"
          }
        >
          <div className="input-with-state">
            <InputMask
              className="ant-input responsive-input"
              mask={type === "ИНН" ? "999 999 999" : "99999999999999"}
              maskChar="*"
              placeholder={`Введите ${type}`}
              value={addItems.tin || ""}
              onChange={onTinChange}
            />
            <div className="input-state">
              {$infoByTin.loading && <Spin size="small" />}
              {Object.keys($infoByTin.data).length > 0 && (
                <div className="success-icon">
                  <DoneSvg />
                </div>
              )}
            </div>
          </div>
        </FormField>
        <FormField
          className="mbc"
          title="Название"
          error={submit && !addItems.name && "Пожалуйста введите  название"}
        >
          <Input
            className="responsive-input"
            placeholder="Введите название"
            value={addItems.name}
            onChange={(name) => onChange({ name: name.target.value })}
          />
        </FormField>
        <div className="custom-modal__double-row">
          <div className="custom-modal__double-row-item">
            <FormField title="Регион" className="mbc">
              <Select
                className="responsive-input"
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
            <FormField title="Район" className="mbc">
              <Select
                className="responsive-input"
                loading={$districtItems.loading}
                placeholder="Выбрать район"
                disabled={!addItems.regionId}
                value={addItems.districtId}
                onChange={(districtId) => onChange({ districtId })}
              >
                {Array.isArray($districtItems.data) &&
                  $districtItems.data.map((item) => (
                    <Option value={item.id} key={item.id}>
                      <Tooltip placement="topLeft" title={item.name}>
                        {item.name}
                      </Tooltip>
                    </Option>
                  ))}
              </Select>
            </FormField>
          </div>
        </div>
        <FormField title="Адрес" className="mbc">
          <Input
            className="responsive-input"
            placeholder="Введите адрес"
            value={addItems.street}
            onChange={(street) => onChange({ street: street.target.value })}
          />
        </FormField>
        <div className="custom-modal__double-row">
          <div className="custom-modal__double-row-item">
            <FormField title="Контактное лицо" className="mbc">
              <Input
                placeholder="Введите контактное лицо"
                value={addItems.contactPerson}
                className="responsive-input"
                onChange={(name) =>
                  onChange({ contactPerson: name.target.value })
                }
              />
            </FormField>
          </div>
          <div className="custom-modal__double-row-item">
            <FormField title="Номер телефона" className="mbc">
              <InputMask
                className="ant-input responsive-input"
                mask="+\9\98 (99) 999 99 99"
                placeholder="+998 XX XXX XX XX"
                maskChar="*"
                value={addItems.phone || ""}
                onChange={(phone) =>
                  onChange({ phone: phone.target.value.replace(/[^0-9]/g, "") })
                }
              />
            </FormField>
          </div>
        </div>
        <FormField
          className="mbc"
          title="Банк"
          error={submit && !addItems.bankId && "Не заполнено поле"}
        >
          <Select
            className={"custom-select"}
            placeholder="Выбрать банк"
            value={addItems.bankId}
            onChange={(bankId) => onChange({ bankId, bankBranchId: "" })}
          >
            {$companyBanks.data.map((item) => (
              <Option value={item.id} key={item.id}>
                <Tooltip placement="topLeft" title={item.name}>
                  {item.name}
                </Tooltip>
              </Option>
            ))}
          </Select>
        </FormField>
        <FormField
          className="mbc"
          title="Филиал"
          error={submit && !addItems.bankBranchId && "Не заполнено поле"}
        >
          <Select
            className="responsive-input"
            placeholder="Выбрать филиал"
            disabled={!addItems.bankId}
            value={addItems.bankBranchId}
            onChange={(bankBranchId) => onChange({ bankBranchId })}
          >
            {$companyBankBranches.data.map((item) => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </FormField>
        <div className="custom-modal__double-row">
          <div style={{ flexGrow: 1, marginRight: 16 }}>
            <FormField
              className="mbc"
              title="Расчетный счет"
              error={submit && !addItems.accountNumber && "Не заполнено поле"}
            >
              <InputMask
                className={`ant-input custom-input responsive-input`}
                placeholder="XXXXX XXX X XXXXXXXX XXX"
                mask="99999 999 9 99999999 999"
                maskChar=""
                value={addItems.accountNumber || ""}
                onChange={(e) => onChange({ accountNumber: e.target.value })}
              />
            </FormField>
          </div>
          <div style={{ width: "35%" }}>
            <FormField
              className="mbc"
              title="ОКЭД"
              error={submit && !addItems.oked && "Не заполнено поле"}
            >
              <InputMask
                className={"ant-input custom-input responsive-input"}
                placeholder="XXXXX"
                mask="99999"
                maskChar=""
                value={addItems.oked || ""}
                onChange={(e) => onChange({ oked: e.target.value })}
              />
            </FormField>
          </div>
        </div>
        <div className="custom-modal__double-row">
          <div style={{ flexGrow: 1, marginRight: 16 }}>
            <FormField className="mbc" title="Договор №">
              <Input
                className="responsive-input"
                placeholder="Введите договор №"
                value={addItems.contractNumber}
                onChange={(contractNo) =>
                  onChange({ contractNumber: contractNo.target.value })
                }
              />
            </FormField>
          </div>
          <div style={{ width: "35%" }}>
            <FormField className="mbc" title="Дата договора">
              <DatePicker
                format={"DD.MM.YYYY"}
                allowClear
                value={
                  addItems.contractDate
                    ? moment(addItems.contractDate, "YYYY/MM/DD")
                    : undefined
                }
                onChange={(e) => {
                  onChange({
                    contractDate:
                      e.format("YYYY-MM-DD") +
                      "T" +
                      moment(new Date()).format("HH:mm:ss") +
                      ".000",
                  });
                }}
              />
            </FormField>
          </div>
        </div>
        <div className="custom-modal__button-row">
          <Button
            htmlType="submit"
            className="custom-button primary-button fullwidth"
          >
            {customerId ? "Сохранить" : "Добавить"}
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
