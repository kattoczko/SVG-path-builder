import React, { useEffect, useState, useRef } from "react";

import "../styles/App.module.scss";
import initialSettings from "./initialSettings";
// import CSSModules from "react-css-modules";

import ControlPanel from "./ControlPanel";
import SVG from "./SVG";

function App() {
  const svgRef = useRef(null);
  const [width, setWidth] = useState(initialSettings.width);
  const [height, setHeight] = useState(initialSettings.height);
  const [grid, setGrid] = useState(initialSettings.grid);
  const [closePath, setClosePath] = useState(initialSettings.closePath);
  const [points, setPoints] = useState(initialSettings.points);
  const [activePointIndex, setActivePointIndex] = useState(
    initialSettings.activePointIndex
  );
  const [activeCtrlKey, setActiveCtrlKey] = useState(false);
  const [pointIsDragged, setPointIsDragged] = useState(false);
  const [anchorIsDragged, setAnchorIsDragged] = useState(false);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, false);
    document.addEventListener("keyup", handleKeyUp, false);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, false);
      document.removeEventListener("keyup", handleKeyUp, false);
    };
  });

  function handleKeyDown(e) {
    if (e.ctrlKey) {
      setActiveCtrlKey(true);
    }
  }

  function handleKeyUp() {
    setActiveCtrlKey(false);
  }

  function handleAddPoint(e) {
    if (activeCtrlKey) {
      const event = e;
      const coordinates = getCoordinates(event);
      points.push(coordinates);
      setActivePointIndex(points.length - 1);
    }
  }

  function handleAnchorClick(i) {
    setActivePointIndex(i);
    setAnchorIsDragged(true);
  }

  function getCoordinates(e) {
    const event = e;
    const clientRect = svgRef.current.getBoundingClientRect();

    let x = Math.round(event.pageX - window.scrollX - clientRect.left);
    let y = Math.round(event.pageY - window.scrollY - clientRect.top);

    if (grid.snap) {
      x = grid.size * Math.round(x / grid.size);
      y = grid.size * Math.round(y / grid.size);
    }

    return { x, y };
  }

  function handleMouseMove(e) {
    const event = e;
    if (pointIsDragged) {
      const { x, y } = getCoordinates(event);
      const updatedPoints = points.map((point, i) => {
        if (i === activePointIndex) {
          return { ...point, x, y };
        } else {
          return point;
        }
      });

      setPoints(updatedPoints);
    } else if (anchorIsDragged) {
      const { x, y } = getCoordinates(event);
      const updatedPoints = points.map((point, i) => {
        if (i === activePointIndex) {
          return { ...point, q: { x, y } };
        } else {
          return point;
        }
      });

      setPoints(updatedPoints);
    }
  }

  function cancelDragging() {
    setPointIsDragged(false);
    setAnchorIsDragged(false);
  }

  function handleWidthChange(e) {
    let width = positiveNumber(e.target.value);
    const min = 1;

    if (width < min) width = min;

    setWidth(width);
  }

  function handleHeightChange(e) {
    let height = positiveNumber(e.target.value);
    const min = 1;

    if (height < min) height = min;

    setHeight(height);
  }

  function handleGridChange(e) {
    const target = e.target;
    const { name, value } = target;

    switch (name) {
      case "size":
        handleSizeChange(value);
        break;
      case "snap":
        setGrid(prevState => ({ ...prevState, [name]: target.checked }));
        break;
      case "show":
        setGrid(prevState => ({ ...prevState, [name]: target.checked }));
        break;
    }
  }

  function handleSizeChange(value) {
    let size = positiveNumber(value);
    let min = 1;
    let max = Math.min(width, height);

    if (size < min) size = min;
    if (size >= max) size = max / 2;

    setGrid({ ...grid, size });
  }

  function handleClosePathChange(e) {
    setClosePath(e.target.checked);
  }

  function handleOnPointClick(index) {
    setActivePointIndex(index);
    setPointIsDragged(true);
  }

  // finish point types
  function handlePointTypeChange(e) {
    const value = e.target.value;
    const activePoint = points[activePointIndex];
    let coordinates;

    function handleSetPoints() {
      setPoints(
        points.map((point, i) => {
          if (i === activePointIndex) {
            return coordinates;
          } else {
            return point;
          }
        })
      );
    }

    switch (value) {
      case "l":
        coordinates = {
          x: activePoint.x,
          y: activePoint.y
        };
        handleSetPoints();
        break;
      case "q":
        coordinates = {
          x: activePoint.x,
          y: activePoint.y,
          q: {
            x: (activePoint.x + points[activePointIndex - 1].x) / 2,
            y: (activePoint.y + points[activePointIndex - 1].y) / 2
          }
        };
        handleSetPoints();
        break;
      case "c":
        coordinates = {
          x: activePoint.x,
          y: activePoint.y,
          c: [
            {
              x: (activePoint.x + points[activePointIndex - 1].x - 50) / 2,
              y: (activePoint.y + points[activePointIndex - 1].y) / 2
            },
            {
              x: (activePoint.x + points[activePointIndex - 1].x + 50) / 2,
              y: (activePoint.y + points[activePointIndex - 1].y) / 2
            }
          ]
        };
        handleSetPoints();
        break;
      case "a":
        coordinates = {
          x: activePoint.x,
          y: activePoint.y,
          a: { rx: 1, ry: 1, rot: 0, laf: 1, sf: 1 }
        };
        handleSetPoints();

        break;
    }
  }

  function positiveNumber(n) {
    n = parseInt(n);
    if (Number.isNaN(n) || n < 0) n = 0;

    return n;
  }

  function generatePath() {
    let d = "";

    points.forEach((p, i) => {
      if (i === 0) {
        // first point
        d += "M ";
      } else if (p.q) {
        // quadratic
        d += `Q ${p.q.x} ${p.q.y} `;
      } else if (p.c) {
        // cubic
        d += `C ${p.c[0].x} ${p.c[0].y} ${p.c[1].x} ${p.c[1].y} `;
      } else if (p.a) {
        // arc
        d += `A ${p.a.rx} ${p.a.ry} ${p.a.rot} ${p.a.laf} ${p.a.sf} `;
        // I could add setting laf sf and proportions rotation?
      } else {
        d += "L ";
      }
      // Add S point - cubic mirrored S 150 150, 180 80
      d += `${p.x} ${p.y} `;
    });

    if (closePath) d += "Z";

    return d;
  }

  function getActivePointType() {
    const activePoint = points[activePointIndex];
    if (activePoint.q) {
      return "q";
    } else if (activePoint.c) {
      return "c";
    } else if (activePoint.a) {
      return "a";
    } else {
      return "l";
    }
  }

  return (
    <div styleName="app" onMouseUp={cancelDragging}>
      <SVG
        svgRef={svgRef}
        width={width}
        height={height}
        grid={grid}
        points={points}
        path={generatePath()}
        activePointIndex={activePointIndex}
        onPointClick={handleOnPointClick}
        onMouseMove={handleMouseMove}
        addPoint={handleAddPoint}
        onAnchorClick={handleAnchorClick}
      />
      <ControlPanel
        onWidthChange={handleWidthChange}
        onHeightChange={handleHeightChange}
        onClosePathChange={handleClosePathChange}
        onGridChange={handleGridChange}
        onPointTypeChange={handlePointTypeChange}
        svgWidth={width}
        svgHeight={height}
        closePath={closePath}
        grid={grid}
        path={generatePath()}
        activePointType={getActivePointType()}
        activePointIndex={activePointIndex}
      />
    </div>
  );
}

export default App;
