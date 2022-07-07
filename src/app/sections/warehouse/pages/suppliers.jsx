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
  Checkbox,
  Popconfirm,
  DatePicker,
} from "antd";

import effector from "../effector";
import userEffector from "../../user/effector";

import { FormField } from "ui/molecules/form-field";
import { ArrowSvg, SettingsSvg } from "svgIcons/svg-icons";
import { CloseModalSvg, SearchSvg, DoneSvg } from "svgIcons/svg-icons";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";
const { stores, events, effects } = effector;
const {
  store: userStores,
  events: userEvents,
  effects: userEffects,
} = userEffector;
import moment from "moment";

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

export const Suppliers = (props) => {
  const $suppliersList = useStore(stores.$suppliersList);
  const $regionItems = useStore(stores.$regionItems);
  const $employeesList = useStore(stores.$employeesList);
  const $createAndUpdateSupplier = useStore(stores.$createAndUpdateSupplier);

  const { data: suppliersData, loading } = $suppliersList;
  const {
    content: suppliersList,
    totalElements: suppliersTotal,
    size: suppliersPageSize,
  } = suppliersData;

  const [visible, setVisible] = useState(false);
  const [filterItems, setFilterItems] = useState(initialFilterState);
  const [page, setPage] = useState(1);
  const [supplierId, setSupplierId] = useState(null);
  const [supplier, setSupplier] = useState(null);

  useEffect(() => {
    effects.getSuppliersListEffect({ page: page - 1 });
    effects.getRegionItemsEffect();
    effects.getEmployeesListEffect();
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      effects.getSuppliersListEffect({
        page: page - 1,
        ...filterItems,
      });
    }, 400);
    return () => clearTimeout(id);
  }, [page, filterItems]);

  useEffect(() => {
    if ($createAndUpdateSupplier.success && !visible) {
      openNotificationWithIcon("success", "Поставщик удален");
      events.resetCreateAndUpdateSupplierEvent();
      effects.getSuppliersListEffect({ page: page - 1 });
    }
  }, [$createAndUpdateSupplier.success]);

  const onChangeFilterItems = (field) => {
    setFilterItems((prev) => ({ ...prev, ...field }));
  };

  const changePagination = (page) => {
    setPage(page);
  };

  const data = suppliersList.map((supplier, index) => {
    return {
      id: supplier.id,
      key: supplier.id,
      num: (page - 1) * 20 + index + 1,
      tin: supplier.tin,
      name: supplier.name,
      region: supplier.address?.region?.name,
      district: supplier.address?.district?.name,
      address: supplier.address?.street,
      contactPerson: supplier.contactPerson,
      phone: supplier.phone ? "+" + supplier.phone : "",
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
                    setSupplier(supplier);
                    setSupplierId(supplier.id);
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
                    effects.createAndUpdateSupplierEffect({
                      method: "DELETE",
                      id: supplier.id,
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
  });

  return (
    <>
      <ModalForm
        visible={visible}
        closeModal={() => {
          setSupplierId(null);
          setSupplier(null);
          setVisible(false);
          events.resetCreateAndUpdateSupplierEvent();
        }}
        regionItems={$regionItems}
        employeesList={$employeesList}
        supplierId={supplierId}
        supplier={supplier}
        onSuccess={() => effects.getSuppliersListEffect({ page: page - 1 })}
      />
      <div className="content-h1-wr">
        <div className="content-h1-wr__left">
          <Button
            className="custom-button add-button onlyicon b-r-30 m-r-10 rotate-left"
            onClick={() => props.history.goBack()}
          >
            <ArrowSvg />
          </Button>
          <h1>Поставщики</h1>
        </div>
        <div className="content-h1-wr__right">
          <Button
            className="custom-button primary-button"
            onClick={() => {
              setSupplierId(null);
              setSupplier(null);
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
          <div className="filter-block__item">
            <Select
              className="custom-select"
              placeholder="Выберите Регион"
              value={filterItems.regionId || undefined}
              onChange={(regionId) =>
                onChangeFilterItems({ regionId, districtId: null })
              }
              allowClear
              dropdownMatchSelectWidth={false}
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
              Всего поставщиков: {suppliersTotal}
            </div>
            <Pagination
              disabled={loading}
              onChange={changePagination}
              current={page ? page : 1}
              total={suppliersTotal}
              pageSize={suppliersPageSize || 20}
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
  supplierId,
  onSuccess,
}) => {
  const $districtItems = useStore(stores.$districtItemsForModal);
  const $customerAndSupplierDetails = useStore(
    stores.$customerAndSupplierDetails
  );
  const $infoByTin = useStore(stores.$infoByTin);
  const { $companyBanks, $companyBankBranches } = useStore(userStores);
  const $createAndUpdateSupplier = useStore(stores.$createAndUpdateSupplier);

  const [addItems, setAddItems] = useState(initialAddItems);
  const [submit, setSubmit] = useState(false);
  const [type, setType] = useState("ИНН");

  useEffect(() => {
    if ($createAndUpdateSupplier.success && visible) {
      openNotificationWithIcon(
        "success",
        supplierId ? "Поставщик изменен" : "Поставщик добавлен"
      );
      onSuccess && onSuccess();
      closeModal();
      setAddItems(initialAddItems);
    }
  }, [$createAndUpdateSupplier.success]);

  useEffect(() => {
    if (visible) {
      !$companyBanks.data.length &&
        userEffects.getCompanyBanksEffect({
          orderBy: "id",
          size: 100,
        });
      return () => {
        events.resetBankInfoByTinEvent();
        events.resetInfoByTinEvent();
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
    const supplier = $customerAndSupplierDetails.data;
    if (supplierId && Object.keys(supplier).length > 0) {
      setAddItems({
        tin: supplier.tin,
        name: supplier.name,
        regionId: supplier.address?.region?.id,
        districtId: supplier.address?.district?.id,
        street: supplier.address?.street,
        house: supplier.address?.house,
        apartment: supplier.address?.apartment,
        contactPerson: supplier.contactPerson,
        phone: supplier.phone,
        bankId: supplier.bankDetail?.parentBank?.id,
        accountNumber: supplier.bankDetail?.accountNumber,
        oked: supplier.bankDetail?.oked || undefined,
        bankBranchId: supplier.bankDetail?.bank?.id || undefined,
        bankDetailId: supplier.bankDetail?.id,
        contractNumber: supplier.contractNumber,
        contractDate: supplier.contractDate,
      });
      setType(supplier?.tin?.length === 9 ? "ИНН" : "ПИНФЛ");
      events.resetCustomerAndSupplierDetailsEvent();
    }
  }, [$customerAndSupplierDetails.data]);

  useEffect(() => {
    effects.getBranchesListEffect({});
    if (supplierId) {
      effects.getCustomerAndSupplierDetailsEffect(supplierId);
    }
  }, [supplierId]);

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
      events.resetInfoByTinEvent();
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
      effects.getInfoByTinEffect(value, true);
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
      effects.createAndUpdateSupplierEffect({
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
          contractDate: addItems.contractDate,
          contractNumber: addItems.contractNumber,
          id: supplierId,
        },
        method: supplierId ? "PUT" : "POST",
        id: supplierId || "",
      });
    }
  };

  return (
    <Modal
      className="custom-modal"
      title={supplierId ? "Редактировать поставщика" : "Добавить поставщика"}
      visible={visible}
      onCancel={() => {
        closeModal();
        setAddItems({});
      }}
      afterClose={() => {
        closeModal();
        afterClose && afterClose();
        setAddItems(initialAddItems);
        setSubmit(false);
        events.resetInfoByTinEvent();
        userEvents.resetCompanyBankBranchesEvent();
      }}
      footer={null}
      width={464}
      centered={true}
      closeIcon={<CloseModalSvg />}
    >
      <FormState
        loading={$createAndUpdateSupplier.loading}
        error={$createAndUpdateSupplier.error}
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
                value={
                  Array.isArray($regionItems.data) &&
                  $regionItems.data.find((r) => r.id === addItems.regionId)
                    ? addItems.regionId
                    : undefined
                }
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
                value={
                  Array.isArray($districtItems.data) &&
                  $districtItems.data.find((r) => r.id === addItems.districtId)
                    ? addItems.districtId
                    : undefined
                }
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
                value={addItems.phone}
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
            value={
              Array.isArray($companyBanks.data) &&
              $companyBanks.data.find((r) => r.id === addItems.bankId)
                ? addItems.bankId
                : undefined
            }
            onChange={(bankId) => onChange({ bankId })}
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
            value={
              Array.isArray($companyBankBranches.data) &&
              $companyBankBranches.data.find(
                (r) => r.id === addItems.bankBranchId
              )
                ? addItems.bankBranchId
                : undefined
            }
            onChange={(bankBranchId) => onChange({ bankBranchId })}
          >
            {$companyBankBranches.data.map((item) => (
              <Option value={item.id} key={item.id}>
                <Tooltip placement="topLeft" title={item.name}>
                  {item.name}
                </Tooltip>
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
            {supplierId ? "Сохранить" : "Добавить"}
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
