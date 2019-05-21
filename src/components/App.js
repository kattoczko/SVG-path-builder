import React, { useEffect, useState, useRef } from "react";

import "../styles/App.module.scss";
import initialSettings from "./utils/initialSettings";
import { positiveNumber } from "./utils/helpers";

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
  const [draggedAnchor, setDraggedAnchor] = useState({
    type: undefined,
    anchorIndex: undefined
  });

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
      const newPointCoordinates = getCoordinates(event);
      setPoints([...points, newPointCoordinates]);
      setActivePointIndex(points.length - 1);
    }
  }

  function handleQuadraticAnchorClick(pointIndex) {
    setActivePointIndex(pointIndex);
    setDraggedAnchor({ ...draggedAnchor, type: "q" });
  }

  function handleCubicAnchorClick(pointIndex, anchorIndex) {
    setActivePointIndex(pointIndex);
    setDraggedAnchor({ type: "c", anchorIndex });
  }

  function getCoordinates(event) {
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
    const { x, y } = getCoordinates(event);

    if (pointIsDragged) {
      const updatedPoints = points.map((point, i) =>
        i === activePointIndex ? { ...point, x, y } : point
      );
      setPoints(updatedPoints);
    } else if (draggedAnchor.type === "q") {
      const updatedPoints = points.map((point, i) => {
        return i === activePointIndex ? { ...point, q: { x, y } } : point;
      });
      setPoints(updatedPoints);
    } else if (draggedAnchor.type === "c") {
      const updatedPoints = points.map((point, i) => {
        if (i === activePointIndex) {
          point.c[draggedAnchor.anchorIndex] = { x, y };
          return { ...point };
        } else {
          return point;
        }
      });
      setPoints(updatedPoints);
    }
  }

  function cancelDragging() {
    setPointIsDragged(false);
    setDraggedAnchor({ type: undefined, anchorIndex: undefined });
  }

  function handleWidthChange(e) {
    let width = positiveNumber(e.target.value);
    const min = 1;

    if (width < min) {
      width = min;
    }
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
      default:
        console.log(`Grid property: ${name} doesn't match any case`);
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

  function handlePointTypeChange(e) {
    const pointType = e.target.value;
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

    switch (pointType) {
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
      default:
        console.error(`Point type: ${pointType} doesn't match`);
        break;
    }
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

  function handlePositionChange(value, axis, max) {
    if (typeof value == "string" && value.trim() !== "") {
      value = Number(value);
    } else {
      return;
    }
    if (Number.isNaN(value)) {
      return;
    }
    value = value > max ? max : value;

    const updatedPoints = points.map((point, i) => {
      if (i === activePointIndex) {
        return { ...point, [axis]: value };
      } else {
        return point;
      }
    });
    setPoints(updatedPoints);
  }

  function handleYPositionChange(e) {
    const value = e.target.value;
    handlePositionChange(value, "y", height);
  }

  function handleXPositionChange(e) {
    const value = e.target.value;
    handlePositionChange(value, "x", width);
  }

  function handleResetButtonClick() {
    setActivePointIndex(0);
    setPoints([{ x: width / 2, y: height / 2 }]);
  }

  function handleSweepFlagChange(e) {
    const flipSweepFlag = e.target.checked;
    const changedPoint = { ...points[activePointIndex] };
    changedPoint.a.sf = flipSweepFlag ? 0 : 1;

    const newPoints = points.map((point, i) => {
      if (i === activePointIndex) {
        return changedPoint;
      } else {
        return point;
      }
    });
    setPoints(newPoints);
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
        onQuadraticAnchorClick={handleQuadraticAnchorClick}
        onCubicAnchorClick={handleCubicAnchorClick}
      />
      <ControlPanel
        onWidthChange={handleWidthChange}
        onHeightChange={handleHeightChange}
        onClosePathChange={handleClosePathChange}
        onGridChange={handleGridChange}
        onPointTypeChange={handlePointTypeChange}
        onYPositionChange={handleYPositionChange}
        onXPositionChange={handleXPositionChange}
        onResetButtonClick={handleResetButtonClick}
        onSweepFlagChange={handleSweepFlagChange}
        svgWidth={width}
        svgHeight={height}
        closePath={closePath}
        grid={grid}
        path={generatePath()}
        activePointType={getActivePointType()}
        activePointIndex={activePointIndex}
        points={points}
      />
    </div>
  );
}

export default App;
