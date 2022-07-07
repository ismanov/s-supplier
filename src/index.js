import React from "react";
import ReactDOM from "react-dom";

import { ConfigProvider } from "antd";
import locale from "antd/es/locale/ru_RU";
import "antd/dist/antd.less";

import App from "./app/index.jsx";

const Root = () => {
  return (
    <ConfigProvider locale={locale}>
      <App />
    </ConfigProvider>
  )
};

ReactDOM.render(<Root />, document.getElementById('root'));