import React from "react";
import PropTypes from "prop-types";

import "../../styles/RadioButtons.module.scss";

function RadioButtons({ name, label, options, onChange }) {
  const optionsHtml = options.map(option => {
    const styling = option.checked ? "option-active" : "option";
    return (
      <label styleName={styling} key={option.name} htmlFor={option.name}>
        <input
          styleName="input"
          id={option.name}
          type="radio"
          name={name}
          value={option.value}
          checked={option.checked}
          onChange={onChange}
        />
        {option.name}
      </label>
    );
  });

  return (
    <div>
      <label styleName="label" htmlFor={name}>
        {label}
      </label>
      <div styleName="options">{optionsHtml}</div>
    </div>
  );
}

RadioButtons.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};

export default RadioButtons;
