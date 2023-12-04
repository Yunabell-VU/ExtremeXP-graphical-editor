import { useState } from "react";
import "./style.scss";

const nodesList = [
  "start",
  "end",
  "task",
  "start",
  "end",
  "task",
  "start",
  "end",
  "task",
  "start",
  "end",
  "task",
  "start",
  "end",
  "task",
  "start",
  "end",
  "task",
  "start",
  "end",
  "task",
];
const edgesList = ["regular", "conditional", "exceptional"];

const Panel = () => {
  const [windowNode, setWindowNode] = useState("start");

  const onDragStart = (event, nodeType) => {
    setWindowNode(nodeType);
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <div className="panel">
      <div className="panel__info">
        <div className="panel__info__window">
          <div className="panel__info__window__notation">
            <img src={`./nodes/${windowNode}.svg`} alt="task" />
          </div>
          <div className="panel__info__window__title">
            <p>{windowNode}</p>
          </div>
        </div>
        <div className="panel__info__description">
          <p>
            Task node description: Task nodeTask nodeTask node Task nodeTask
            nodeTask nodeTask node Task nodeTask node ask nodeTask node Task
            nodeTask node ask nodeTask node Task nodeTask node ask nodeTask node
            Task nodeTask node
          </p>
        </div>
      </div>
      <div className="panel__nodes">
        <div className="panel__nodes__title">
          <p className="panel__nodes__title__name">Nodes</p>
          <p className="panel__nodes__title__tutorial">
            Click to show the node description or drag the node onto the board
            on the right.
          </p>
        </div>
        <div className="panel__nodes__content">
          {nodesList.map((nodeType, index) => {
            return (
              <div
                key={index}
                className="panel__nodes__content__node"
                onDragStart={(event) => onDragStart(event, nodeType)}
                draggable
                onClick={() => {
                  setWindowNode(nodeType);
                }}
              >
                <img src={`./nodes/${nodeType}.svg`} alt="" />
              </div>
            );
          })}
        </div>
      </div>
      <div className="panel__links">
        <div className="panel__links__title">
          <p className="panel__links__title__name">Links</p>
          <p className="panel__links__title__tutorial">
            Click to select the link to connect between nodes.
          </p>
        </div>
        <div className="panel__links__content">
          {edgesList.map((edgeType, index) => {
            return (
              <div key={index} className="panel__links__content__link">
                {edgeType}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Panel;
