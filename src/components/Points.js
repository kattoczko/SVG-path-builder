import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import "../styles/Points.module.scss";

function Points({ points, activePointIndex, onPointClick, onAnchorClick }) {
  const pts = points.map((point, i) => {
    const stylingPoint = classNames("point", {
      "point-first": i === 0,
      "point-active": i === activePointIndex
    });
    const stylingAnchor = classNames("anchor", {
      "anchor-active": i === activePointIndex
    });
    return (
      <g key={i}>
        <circle
          styleName={stylingPoint}
          cx={point.x}
          cy={point.y}
          r="8"
          onMouseDown={() => onPointClick(i)}
        />
        {point.q && (
          <g>
            <circle
              cx={point.q.x}
              cy={point.q.y}
              r="6"
              styleName={stylingAnchor}
              onMouseDown={() => onAnchorClick(i)}
            />
          </g>
        )}
      </g>
    );
  });

  return <g>{pts}</g>;
}

Points.propTypes = {
  points: PropTypes.array.isRequired,
  activePointIndex: PropTypes.number.isRequired,
  onPointClick: PropTypes.func.isRequired,
  onAnchorClick: PropTypes.func.isRequired
};

export default Points;
