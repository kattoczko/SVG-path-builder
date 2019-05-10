import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import CSSModules from "react-css-modules";

import styles from "../styles/Grid.module.scss";

function Grid({ width, height, grid: gridSettings }) {
  const { size, show, snap } = gridSettings;
  let grid = [];

  for (let i = 1; i < width / size; i++) {
    grid.push(
      <line
        key={`vertical${i}`}
        x1={i * size}
        y1={0}
        x2={i * size}
        y2={height}
      />
    );
  }

  for (let i = 1; i < height / size; i++) {
    grid.push(
      <line
        key={`horizontal${i}`}
        x1={0}
        y1={i * size}
        x2={width}
        y2={i * size}
      />
    );
  }

  const classes = classNames({ grid: show, isHidden: !show });

  return <g styleName={classes}>{grid}</g>;
}

Grid.propTypes = {
  grid: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

export default CSSModules(Grid, styles);
