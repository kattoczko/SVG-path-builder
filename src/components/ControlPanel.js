import React from "react";
import PropTypes from "prop-types";

import "../styles/ControlPanel.module.scss";

import TextInput from "./common/TextInput";
import Checkbox from "./common/Checkbox";
import RadioButtons from "./common/RadioButtons";

function ControlPanel({
  onWidthChange,
  onHeightChange,
  onClosePathChange,
  onGridChange,
  onPointTypeChange,
  svgWidth,
  svgHeight,
  closePath,
  grid,
  path,
  activePointType,
  activePointIndex
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
            error=""
          />
        </div>
        <div styleName="item">
          <TextInput
            name="height"
            label="Height"
            onChange={onHeightChange}
            placeholder="0"
            value={String(svgHeight)} //value must be text
            error=""
          />
        </div>
        <div styleName="item">
          <Checkbox
            name="closePath"
            label="Close path"
            checked={closePath}
            onChange={onClosePathChange}
            error=""
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
            error=""
          />
        </div>
        <div styleName="item">
          <Checkbox
            name="snap"
            label="Snap grid"
            checked={grid.snap}
            onChange={onGridChange}
            error=""
          />
        </div>
        <div styleName="item">
          <Checkbox
            name="show"
            label="Show grid"
            checked={grid.show}
            onChange={onGridChange}
            error=""
          />
        </div>
      </div>

      {/* Selected point options */}
      <h3 styleName="heading">Selected Point</h3>
      <div styleName="controls-set">
        {activePointIndex !== 0 && (
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
              // checkedOption={activePointType}
            />
          </div>
        )}
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
  svgWidth: PropTypes.number.isRequired,
  svgHeight: PropTypes.number.isRequired,
  grid: PropTypes.object.isRequired,
  closePath: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired,
  activePointType: PropTypes.string.isRequired,
  activePointIndex: PropTypes.number.isRequired
};

export default ControlPanel;
