import React from 'react';

import s from './button.module.scss';

const Button = (props) => {
  return (
    <>
      <button className={s.btn} onClick={props.onClick}>{props.name}</button>
    </>
  );
};

export default Button;
