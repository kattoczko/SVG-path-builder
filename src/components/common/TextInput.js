import React from "react";
import PropTypes from "prop-types";

import "../../styles/TextInput.modules.scss";

function TextInput({ name, label, onChange, placeholder, value }) {
  return (
    <div>
      <label styleName="label" htmlFor={name}>
        {label}
      </label>
      <div>
        <input
          styleName="input"
          type="text"
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string
};

export default TextInput;
