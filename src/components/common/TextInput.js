import React from "react";
import PropTypes from "prop-types";
import CSSModules from "react-css-modules";

import styles from "../../styles/TextInput.modules.scss";

function TextInput({ name, label, onChange, placeholder, value, error }) {
  if (error && error.length > 0) {
    // add some error class
  }

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
        {error && <div styleName="">{error}</div>}
      </div>
    </div>
  );
}

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.string
};

export default CSSModules(TextInput, styles);
