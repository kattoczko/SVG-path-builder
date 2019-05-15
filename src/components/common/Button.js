import React from "react";
import PropTypes from "prop-types";

import "../../styles/Button.module.scss";

function Button({ onClick, type, text }) {
  return (
    <button styleName="button" type={type} onClick={onClick}>
      {text}
    </button>
  );
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default Button;
