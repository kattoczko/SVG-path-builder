import React from "react";
import PropTypes from "prop-types";

import "../styles/SVG.module.scss";

import Grid from "./Grid.js";
import Points from "./Points";

function SVG({
  width,
  height,
  grid,
  points,
  activePointIndex,
  onPointClick,
  onMouseMove,
  addPoint,
  onAnchorClick,
  path,
  svgRef
}) {
  const styles = {
    width,
    height
  };

  return (
    <div styleName="svg-container">
      <svg
        ref={svgRef}
        style={styles}
        styleName="svg"
        onMouseMove={onMouseMove}
        onClick={addPoint}
      >
        <Grid width={width} height={height} grid={grid} />
        <path styleName="path" d={path} />
        <Points
          points={points}
          activePointIndex={activePointIndex}
          onPointClick={onPointClick}
          onAnchorClick={onAnchorClick}
        />
      </svg>
    </div>
  );
}

SVG.propTypes = {
  grid: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  points: PropTypes.array.isRequired,
  path: PropTypes.string.isRequired,
  activePointIndex: PropTypes.number.isRequired,
  onPointClick: PropTypes.func.isRequired,
  onMouseMove: PropTypes.func.isRequired,
  addPoint: PropTypes.func.isRequired,
  onAnchorClick: PropTypes.func.isRequired,
  svgRef: PropTypes.object.isRequired
};

export default SVG;
