import React from "react";
import Symbol from "./Symbol";

const ReelGrid = ({ grid, spinning }) => {
  return (
    <div className={`reel-grid ${spinning ? "reel-spinning" : ""}`}>
      {grid.map((row, rIdx) => (
        <div key={rIdx} className="reel-row">
          {row.map((val, cIdx) => (
            <Symbol key={cIdx} value={val} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ReelGrid;
