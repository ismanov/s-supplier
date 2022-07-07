import moment from "moment";
export const invoiceGenerator = ({
  buyer,
  seller,
  number,
  date,
  products,
  units,
  totalInWord,
  contractDoc,
}) => {
  return `<!DOCTYPE html>
    <html>
    <head>
        <style type="text/css">
            body {
                font-family: Arial;
                font-size: 11px;
                line-height: 15px;
                margin: 0;
            }
    
            .t-a-c {
                text-align: center;
            }
    
            .t-a-r {
                text-align: right;
            }
    
            .wrapper {
                box-sizing: border-box;
                margin: 0 auto;
                padding: 20px 40px;
            }
    
            .h1 {
                text-align: center;
                font-size: 16px;
                margin: 20px 0;
            }
    
            .h1 div {
                font-size: 15px;
            }
    
            .table0 {
                display: flex;
                width: 100%;
    
                margin: 20px 0 0;
            }
            thead {
                background: rgba(238, 238, 238, 0.667);
            }
    
            .table0-50 {
                width: 50%;
            }
    
            .table0-50:first-child {
                padding: 0 20px 0 0;
            }
    
            .table0-col1 {
                float: left;
                width: 77px;
                text-align: right;
                margin: 0 5px 0 0;
            }
    
            .table0-col2 {
                overflow: hidden;
            }
    
            .table0-col2-bordered {
                border-bottom: 1px solid #000;
            }
    
            .table0-row3 {
                display: flex;
                align-items: flex-end;
                margin: 15px 0;
            }
    
            .table0-col3 {
                width: 177px;
                text-align: right;
                margin: 0 5px 0 0;
            }
    
            .table0-col4 {
                flex-grow: 1;
            }
    
            .table1 {
                width: 100%;
                border: 1px solid #000;
                border-collapse: collapse;
                margin: 20px 0 0;
                padding: 0;
            }
    
            .table1 td {
                text-align: center;
                padding: 2px 5px;
            }
    
            .table1 .propuct-row td {
                padding: 5px;
            }
    
            .table1 .t-a-l {
                text-align: left;
            }
    
            .table1 .t-a-r {
                text-align: right;
            }
    
            .table1 .nowrap {
                white-space: nowrap;
            }
    
            .total-words {
                margin: 10px 0 30px;
            }
    
            .table2 {
                width: 100%;
                border-collapse: collapse;
            }
    
            .table2 td {
                vertical-align: top;
                padding: 0;
            }
    
            .table2-left-col {
                width: 50%;
            }
    
            .table2-middle-col {
                width: 5%;
            }
    
            .table2-right-col {
                width: 45%;
            }
    
            .f-l {
                float: left;
            }
    
            .f-r {
                float: right;
            }
    
            .employee {
                display: flex;
                padding: 0 0 15px
            }
    
            .employee-boss {
                padding: 0;
            }
    
            .employee-l {
                min-width: 90px;
                max-width: 90px;
            }
    
            .employee-r {
                flex-grow: 1;
                display: flex;
            }
    
            .employee__sign {
                position: relative;
                flex-grow: 1;
                margin: 0 5px 0 0;
            }
    
            .seal {
                position: absolute;
                left: 50%;
                margin: 0 0 0 -70px;
                top: -29px;
                width: 150px;
                font-size: 0;
            }
    
            .employee__sign img {
                max-width: 100%;
            }
    
            .sign {
                position: absolute;
                left: 50%;
                margin: 0 0 0 9px;
                top: -36px;
                width: 130px;
                font-size: 0;
            }
    
            .employee__name {
            }
    
            .table2-right-col .employee-l {
                min-width: 56px;
            }
    
            .mp {
                padding: 0 0 0 25px;
            }
    
            .b-b {
                border-bottom: 1px solid #000;
            }
    
            .clear {
                clear: both;
            }
        </style>
    </head>
    
    <body>
    <div class="wrapper">
        <h1 class="h1">
            СЧЕТ-ФАКТУРА № <span>${number}</span> от <span>${date}</span>г.
            <div>к товарно-отгрузочным документам № <span>${
              contractDoc?.ContractNo
            }</span>
                от
                <span>${moment(contractDoc?.ContractDate).format(
                  "DD.MM.YYYY"
                )}</span> г.
            </div>
        </h1>
    
        <div class="table0">
            <div class="table0-50">
                <div>
                    <div class="table0-col1">Поставщик:</div>
                    <div class="table0-col2">
                        <div class="table0-col2-bordered">
                            <strong>${seller.Name}</strong>
                        </div>
                    </div>
                    <div class="clear"></div>
                </div>
                <div>
                    <div class="table0-col1">Директор:</div>
                    <div class="table0-col2">
                        <div class="table0-col2-bordered">
                            <strong>${seller.Director}</strong>
                        </div>
                    </div>
                    <div class="clear"></div>
                </div>
                <div>
                    <div class="table0-col1">Бухгалтер:</div>
                    <div class="table0-col2">
                        <div class="table0-col2-bordered">
                            <strong>${seller.Accountant}</strong>
                        </div>
                    </div>
                    <div class="clear"></div>
                </div>
                <div>
                    <div class="table0-col1">Адрес:</div>
                    <div class="table0-col2">
                        <div class="table0-col2-bordered">${
                          seller.Address
                        }</div>
                        <div class="table0-col2-bordered">&nbsp;</div>
                    </div>
                    <div class="clear"></div>
                </div>
                <div class="table0-row3">
                    <div class="table0-col3">
                        Идентификационный номер<br>налогоплательщика (ИНН)
                    </div>
                    <div class="table0-col4">
                        <div class="table0-col2-bordered">
                            ${seller.tin}
                        </div>
                    </div>
                    <div class="clear"></div>
                </div>
                <div>
                    <div class="">
                        Регистрационный код плательщика
                    </div>
                </div>
                <div>
                    <div class="table0-col1">НДС:</div>
                    <div class="table0-col2">
                        <div class="table0-col2-bordered">${
                          seller.VatRegCode
                        }</div>
                    </div>
                    <div class="clear"></div>
                </div>
    
                <div>
                    <div class="table0-col1">Р/сч:</div>
                    <div class="table0-col2">
                        <div class="table0-col2-bordered">${
                          seller.Account || "-"
                        }</div>
                    </div>
                    <div class="clear"></div>
                </div>
                <div>
                    <div class="table0-col1">в:</div>
                    <div class="table0-col2">
                        <div class="table0-col2-bordered">${
                          seller.bankName || "-"
                        }</div>
                    </div>
                    <div class="clear"></div>
                </div>
                <div>
                    <div class="table0-col1">МФО:</div>
                    <div class="table0-col2">
                        <div class="table0-col2-bordered">${
                          seller.BankId || "-"
                        }</div>
                    </div>
                    <div class="clear"></div>
                </div>
    
    
            </div>
            <div class="table0-50">
                <div>
                    <div class="table0-col1">Покупатель:</div>
                    <div class="table0-col2">
                        <div class="table0-col2-bordered">
                           <strong><span>${buyer.Name || "-"}</span></strong>
                        </div>
                    </div>
                    <div class="clear"></div>
                </div>
                <div>
                    <div class="table0-col1">Директор:</div>
                    <div class="table0-col2">
                        <div class="table0-col2-bordered">
                           <strong><span>${
                             buyer.Director || "-"
                           }</span></strong>
                        </div>
                    </div>
                    <div class="clear"></div>
                </div>
                <div>
                    <div class="table0-col1">Бухгалтер:</div>
                    <div class="table0-col2">
                        <div class="table0-col2-bordered">
                           <strong><span>${
                             buyer.Accountant || "-"
                           }</span></strong>
                        </div>
                    </div>
                    <div class="clear"></div>
                </div>
                <div>
                    <div class="table0-col1">Адрес:</div>
                    <div class="table0-col2">
                        <div class="table0-col2-bordered">
                            <span>${buyer.Address || "-"}</span>
                        </div>
                        <div class="table0-col2-bordered">&nbsp;</div>
                    </div>
                    <div class="clear"></div>
                </div>
    
                <div class="table0-row3">
                    <div class="table0-col3">
                        Идентификационный номер<br>налогоплательщика (ИНН)
                    </div>
                    <div class="table0-col4">
                        <div class="table0-col2-bordered">
                            <span>${buyer.tin || "-"}</span>
                        </div>
                    </div>
                    <div class="clear"></div>
                </div>
                <div>
                    <div class="">
                        Регистрационный код плательщика
                    </div>
                </div>
                <div>
                    <div class="table0-col1">НДС:</div>
                    <div class="table0-col2">
                        <div class="table0-col2-bordered">${
                          buyer.VatRegCode || "-"
                        }</div>
                    </div>
                    <div class="clear"></div>
                </div>
    
                <div>
                    <div class="table0-col1">Р/сч:</div>
                    <div class="table0-col2">
                        <div class="table0-col2-bordered">${
                          buyer.Account || "-"
                        }</div>
                    </div>
                    <div class="clear"></div>
                </div>
                <div>
                    <div class="table0-col1">в:</div>
                    <div class="table0-col2">
                        <div class="table0-col2-bordered">${
                          buyer.bankName || "-"
                        }</div>
                    </div>
                    <div class="clear"></div>
                </div>
                <div>
                    <div class="table0-col1">МФО:</div>
                    <div class="table0-col2">
                        <div class="table0-col2-bordered">${
                          buyer.bankId || "-"
                        }</div>
                    </div>
                    <div class="clear"></div>
                </div>
    
            </div>
        </div>
    
        <table class="table1" border="1">
        <thead>
            <tr>
                <td rowspan="3">№<br><span class="nowrap">п/п</span></td>
                <td rowspan="2">Наименование товаров (работ, услуг)</td>
                <td rowspan="2">Ед.изм.</td>
                <td rowspan="2">Коли<br>чест<br>во</td>
                <td rowspan="2">Цена</td>
                <td rowspan="2">Стоимость поставки</td>
                <td colspan="2">НДС</td>
                <td rowspan="2">Стоим. пост. c НДС</td>
            </tr>
            <tr>
                <td>Ставка</td>
                <td>Сумм</td>
            </tr>
            <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td>5</td>
                <td>6</td>
                <td>7</td>
                <td>8</td>
            </tr></thead>
            <tbody>
            ${(products || [])
              .sort((a, b) => (a.OrdNo > b.OrdNo ? 1 : -1))
              .map(
                (product) => `<tr class="propuct-row">
              <td>${product.OrdNo || "-"}</td>
              <td class="t-a-l">${product.Name || "-"}</td>
              <td>${
                units.find((unit) => unit.id === product.MeasureId)?.name || "-"
              }</td>
              <td>${product.Count || "-"}</td>
              <td>${product.Summa || "-"}</td>
              <td>${product.DeliverySum || "-"}</td>
              <!--            <td th:text="">...</td>-->
  <!--                <td>15%</td>-->
                          <td>${
                            product.VatRate ? product.VatRate + "%" : "Без"
                          }</td>
                          <td>${
                            product.VatRate ? product.VatSum || "-" : "НДС"
                          }</td>
  <!--                <td th:text="">...</td>-->
              <td>${product.DeliverySumWithVat || "-"}</td>
          </tr>`
              )}    
              <tr>
                  <td class="t-a-r" colspan="2"><strong>Итого к оплате:</strong></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td class="t-a-r"><strong>${(products || []).reduce(
                    (acc, product) => acc + (product.DeliverySum || 0),
                    0
                  )}</strong></td>
                  <td colspan="2" class="t-a-r"><strong>${(
                    products || []
                  ).reduce(
                    (acc, product) => acc + (product.VatSum || 0),
                    0
                  )}</strong></td>
                  <td class="t-a-r"><strong>${
                    Math.floor(
                      (products || []).reduce(
                        (acc, product) =>
                          acc + (product.DeliverySumWithVat || 0),
                        0
                      ) * 100
                    ) / 100
                  }</strong></td>
              </tr>
            </tbody>
        </table>
    
        <h4 class="total-words">Всего к оплате: <span>${totalInWord}</span>, Без НДС.
    <!--        <span th:text=""></span>-->
        </h4>
        <table class="table2">
            <tr>
                <td class="table2-left-col">
                    <div class="employee employee-boss">
                        <div class="employee-l">Руководитель:</div>
                        <div class="employee-r">
                            <div class="employee__sign">
                                <div class="b-b">&nbsp;</div>
                            </div>
                        </div>
                    </div>
                </td>
                <td class="table2-middle-col"></td>
                <td class="table2-right-col" >
                    <div class="employee">
                        <div class="employee-l">Получил:</div>
                        <div class="employee-r">
                            <div class="employee__sign">
                                <div class="b-b">&nbsp;</div>
                                <div>
                                    (Подпись покупателя или уполномоченного представителя)
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="table2-left-col">
                    <div class="employee">
                        <div class="employee-l">Гл. бухгалтер:</div>
                        <div class="employee-r">
                            <div class="employee__sign">
                                <div class="b-b">&nbsp;</div>
                            </div>
                        </div>
                    </div>
                </td>
                <td class="table2-middle-col"></td>
                <td class="table2-right-col" >
                    <div class="employee">
                        <div class="employee-l"></div>
                        <div class="employee-r">
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="table2-left-col">
                    <div class="employee">
                        <div class="employee-l">Товар отпустил:</div>
                        <div class="employee-r">
                            <div class="employee__sign">
                                <div class="b-b">&nbsp;</div>
                            </div>
                        </div>
                    </div>
                </td>
                <td class="table2-middle-col"></td>
                
            </tr>
        </table>
    
        <div class="mp">М.П.</div>
    
    </div>
    
    
    </body>
    </html>
    `;
};
