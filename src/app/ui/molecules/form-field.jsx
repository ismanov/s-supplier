import React from "react";

import "../styles/form-field.scss";

export const FormField = (props) => {
  const { title, children, note, error, className } = props;

  return (
    <div className={`form-field ${className ? className : 'm-b-20'} ${error ? 'ant-form-item-has-error' : ''}`}>
      {title && <div className="form-field__title">{title}</div>}
      {children}
      {note && <div className="form-field__note">{note}</div>}
      {error && <div className="form-field__error">{error}</div>}
    </div>
  );
};