import React from "react";
import PropTypes from "prop-types";

import "../styles/ControlPanel.module.scss";

import TextInput from "./common/TextInput";
import Checkbox from "./common/Checkbox";
import RadioButtons from "./common/RadioButtons";
import RangeInput from "./common/RangeInput";
import Button from "./common/Button";

function ControlPanel({
  onWidthChange,
  onHeightChange,
  onClosePathChange,
  onGridChange,
  onPointTypeChange,
  onYPositionChange,
  onXPositionChange,
  onResetButtonClick,
  onSweepFlagChange,
  svgWidth,
  svgHeight,
  closePath,
  grid,
  path,
  activePointType,
  activePointIndex,
  points
}) {
  return (
    <div styleName="control-panel">
      {/* Parameters*/}
      <h3 styleName="heading">Parameters</h3>
      <div styleName="controls-set">
        <div styleName="item">
          <TextInput
            name="width"
            label="Width"
            onChange={onWidthChange}
            placeholder="0"
            value={String(svgWidth)}
          />
        </div>
        <div styleName="item">
          <TextInput
            name="height"
            label="Height"
            onChange={onHeightChange}
            placeholder="0"
            value={String(svgHeight)} //value must be text
          />
        </div>
        <div styleName="item">
          <Checkbox
            name="closePath"
            label="Close path"
            checked={closePath}
            onChange={onClosePathChange}
          />
        </div>
      </div>

      <div styleName="controls-set">
        <div styleName="item">
          <TextInput
            name="size"
            label="Grid size"
            onChange={onGridChange}
            placeholder="0"
            value={String(grid.size)}
          />
        </div>
        <div styleName="item">
          <Checkbox
            name="snap"
            label="Snap grid"
            checked={grid.snap}
            onChange={onGridChange}
          />
        </div>
        <div styleName="item">
          <Checkbox
            name="show"
            label="Show grid"
            checked={grid.show}
            onChange={onGridChange}
          />
        </div>
      </div>

      <div styleName="controls-set">
        <div styleName="item">
          <Button
            type="button"
            text="Reset path"
            onClick={onResetButtonClick}
          />
        </div>
      </div>

      {/* Selected point options */}
      <h3 styleName="heading">Selected Point</h3>
      {activePointIndex !== 0 && (
        <div styleName="controls-set">
          <div styleName="item">
            <RadioButtons
              name="pointType"
              label="Point type"
              options={[
                {
                  name: "L",
                  value: "l",
                  checked: activePointType === "l"
                },
                {
                  name: "Q",
                  value: "q",
                  checked: activePointType === "q"
                },
                {
                  name: "C",
                  value: "c",
                  checked: activePointType === "c"
                },
                { name: "A", value: "a", checked: activePointType === "a" }
              ]}
              onChange={onPointTypeChange}
            />
          </div>
        </div>
      )}
      {points[activePointIndex].a && (
        <div styleName="controls-set">
          <Checkbox
            name="sweepFlag"
            label="Sweep Flag"
            checked={points[activePointIndex].a.sf === 0 ? true : false}
            onChange={onSweepFlagChange}
          />
        </div>
      )}
      <div styleName="controls-set">
        <div styleName="item">
          <RangeInput
            label="Point X position"
            name="positionX"
            min={0}
            max={svgWidth}
            value={points[activePointIndex].x}
            step={grid.snap ? grid.size : 1}
            onChange={onXPositionChange}
          />
        </div>
      </div>
      <div styleName="controls-set">
        <div styleName="item">
          <RangeInput
            label="Point Y position"
            name="positionY"
            min={0}
            max={svgHeight}
            value={points[activePointIndex].y}
            step={grid.snap ? grid.size : 1}
            onChange={onYPositionChange}
          />
        </div>
      </div>

      <div styleName="result">
        <p>{path}</p>
      </div>
    </div>
  );
}

ControlPanel.propTypes = {
  onHeightChange: PropTypes.func.isRequired,
  onWidthChange: PropTypes.func.isRequired,
  onClosePathChange: PropTypes.func.isRequired,
  onGridChange: PropTypes.func.isRequired,
  onPointTypeChange: PropTypes.func.isRequired,
  onYPositionChange: PropTypes.func.isRequired,
  onXPositionChange: PropTypes.func.isRequired,
  onResetButtonClick: PropTypes.func.isRequired,
  onSweepFlagChange: PropTypes.func.isRequired,
  svgWidth: PropTypes.number.isRequired,
  svgHeight: PropTypes.number.isRequired,
  grid: PropTypes.object.isRequired,
  closePath: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired,
  activePointType: PropTypes.string.isRequired,
  activePointIndex: PropTypes.number.isRequired,
  points: PropTypes.array.isRequired
};

export default ControlPanel;
