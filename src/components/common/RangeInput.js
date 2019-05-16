import React from "react";
import PropTypes from "prop-types";

import "../../styles/RangeInput.module.scss";

function RangeInput({ label, name, min, max, value, step, onChange }) {
  return (
    <div>
      <label styleName="range-label" htmlFor={name}>
        {label}
      </label>
      <div styleName="range-wrapper">
        <input
          type="range"
          name={name}
          min={min}
          max={max}
          value={value}
          step={step}
          onChange={onChange}
          styleName="range-slider"
        />
        <input
          type="text"
          value={value}
          onChange={onChange}
          onClick={e => e.target.select()}
          styleName="range-input"
        />
      </div>
    </div>
  );
}

RangeInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};

export default RangeInput;
