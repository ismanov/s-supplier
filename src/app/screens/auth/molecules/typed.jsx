import React from "react";
import Typed from "react-typed";

const AuthTyped = () => {
  return (
    <Typed
      strings={[
        ' - Современное решение для учета вашего бизнеса',
        ' - Стильный и максимально простой дизайн',
        ' - Подробные отчеты и фискальный чек'
      ]}
      typeSpeed={40}
      backSpeed={50}
      children
      loop
    >
      <span className="auth-wrapper__typed" />
    </Typed>
  )
};

export default AuthTyped;