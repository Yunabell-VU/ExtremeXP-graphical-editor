import "./style.scss";
import { useState, useEffect } from "react";
import useRequest from "../../../hooks/useRequest";
import { message } from "../../../utils/message";
import { timestampToDate } from "../../../utils/timeToDate";
import { Link, useNavigate, useLocation } from "react-router-dom";

type ResponseType = {
  message: string;
  data: {
    specifications: [];
  };
};

const defaultSpecification = {
  id_specification: "",
  experiment_id: "",
  name: "",
  create_at: NaN,
  update_at: NaN,
};

const Specifications = () => {
  const [specifications, setSpecifications] = useState([defaultSpecification]);

  // make sure the expID is the same as the one in the url
  const expID = useLocation().pathname.split("/")[3];

  const { request } = useRequest<ResponseType>();

  useEffect(() => {
    request({
      url: `exp/experiments/${expID}/specifications`,
    })
      .then((data) => {
        if (data.data.specifications) {
          setSpecifications(data.data.specifications);
        }
      })
      .catch((error) => {
        if (error.message) {
          message(error.message);
        }
      });
  }, [request, expID]);
  // const handleNewDeployment = async () => {
  //   try {
  //     // Sample JSON content for a new deployment
  //     const diagram = { nodes: [], edges: [] };

  //     const fileHandle = await window.showSaveFilePicker();
  //     const writable = await fileHandle.createWritable();

  //     await writable.write(JSON.stringify(diagram, null, 2));
  //     await writable.close();

  //     const file = await fileHandle.getFile();
  //     const fileName = file.name;
  //     const fileNameWithoutExtension = fileName.split(".")[0];
  //     const content = await file.text();

  //     localStorage.setItem("fileName", fileNameWithoutExtension);
  //     localStorage.setItem("diagram", content);
  //   } catch (error) {
  //     console.error("Error creating file:", error);
  //   }
  // };

  // const handleImportDeployment = async () => {
  //   try {
  //     const [fileHandle] = await window.showOpenFilePicker();
  //     const file = await fileHandle.getFile();
  //     const diagram = await file.text();

  //     const fileName = file.name;
  //     const fileNameWithoutExtension = fileName.split(".")[0];

  //     localStorage.setItem("fileName", fileNameWithoutExtension);
  //     localStorage.setItem("diagram", diagram);
  //   } catch (error) {
  //     console.error("Error importing file:", error);
  //   }
  // };
  return (
    <div className="specification">
      <div className="specification__functions">
        <button className="specification__functions__new">
          new specification
        </button>
        <button className="specification__functions__import">
          import specification
        </button>
      </div>
      <div className="specification__contents">
        <div className="specification__contents__header">
          <div className="specification__contents__header__title">
            Specification
          </div>
          <div className="specification__contents__header__create">
            Create At
          </div>
          <div className="specification__contents__header__update">
            Update At
          </div>
        </div>
        <ul className="specification__contents__list">
          {specifications.map((specification, index) => (
            <li
              className="specification__contents__list__item"
              key={index}
              onClick={() => {}}
            >
              <div className="specification__contents__list__item__title">
                {specification.name}
              </div>
              <div className="specification__contents__list__item__create">
                {timestampToDate(specification.create_at)}
              </div>
              <div className="specification__contents__list__item__update">
                {timestampToDate(specification.update_at)}
              </div>
              <div className="specification__contents__list__item__operations">
                <span className="iconfont">&#xe627;</span>
                <span className="iconfont">&#xe634;</span>
                <button> open </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Specifications;
