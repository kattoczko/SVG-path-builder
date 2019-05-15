import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import "../styles/Points.module.scss";

function Points({
  points,
  activePointIndex,
  onPointClick,
  onQuadraticAnchorClick,
  onCubicAnchorClick
}) {
  const pts = points.map((point, i) => {
    const stylingPoint = classNames("point", {
      "point-first": i === 0,
      "point-active": i === activePointIndex
    });
    const stylingAnchor = classNames("anchor", {
      "anchor-active": i === activePointIndex
    });
    const stylingLine = classNames("line", {
      "line-active": i === activePointIndex
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
            <line
              x1={point.q.x}
              y1={point.q.y}
              x2={point.x}
              y2={point.y}
              styleName={stylingLine}
            />
            <line
              x1={point.q.x}
              y1={point.q.y}
              x2={points[i - 1].x}
              y2={points[i - 1].y}
              styleName={stylingLine}
            />
            <circle
              cx={point.q.x}
              cy={point.q.y}
              r="6"
              styleName={stylingAnchor}
              onMouseDown={() => onQuadraticAnchorClick(i)}
            />
          </g>
        )}
        {point.c && (
          <g>
            <line
              x1={point.c[1].x}
              y1={point.c[1].y}
              x2={point.x}
              y2={point.y}
              styleName={stylingLine}
            />
            <line
              x1={point.c[0].x}
              y1={point.c[0].y}
              x2={points[i - 1].x}
              y2={points[i - 1].y}
              styleName={stylingLine}
            />
            <circle
              cx={point.c[0].x}
              cy={point.c[0].y}
              r="6"
              styleName={stylingAnchor}
              onMouseDown={() => onCubicAnchorClick(i, 0)}
            />
            <circle
              cx={point.c[1].x}
              cy={point.c[1].y}
              r="6"
              styleName={stylingAnchor}
              onMouseDown={() => onCubicAnchorClick(i, 1)}
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
  onQuadraticAnchorClick: PropTypes.func.isRequired,
  onCubicAnchorClick: PropTypes.func.isRequired
};

export default Points;
