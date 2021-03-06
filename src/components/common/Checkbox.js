import React from "react";
import PropTypes from "prop-types";

import "../../styles/Checkbox.module.scss";

function Checkbox({ name, label, checked, onChange }) {
  return (
    <div>
      <label styleName="label" htmlFor={name}>
        {label}
      </label>
      <div styleName="switch">
        <label>
          <input
            styleName="input"
            type="checkbox"
            name={name}
            onChange={onChange}
            checked={checked}
          />
          <span styleName="slider" />
        </label>
      </div>
    </div>
  );
}

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Checkbox;
