import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';


interface Param {
  id: number;
  name: string;
  type: string;
};

interface ParamValue {
  paramId: number;
  value: string;
};

interface Model {
  ParamValue: ParamValue[];
};

interface Props {
  params: Param[];
  model: Model;
};

interface CustomInutEvent extends ParamValue {
  value: string;
  paramId: number;
  type: Param["type"];
};

interface ListParamsProps extends Props {
  onChange: (customEvent: CustomInutEvent) => void;
};

interface newParamProps {
  handleAddParam: (param: Props) => void;
  paramsLength: number;
};

interface FormParamProps {
  param: Param;
  value: ParamValue["value"];
  params: Props["params"];
  handleChange: (customEvent: CustomInutEvent) => void;
  paramId: ParamValue["paramId"];
  type: Param["type"];
};




const ListParams = ({ params, model, onChange }: ListParamsProps) => {
  const handleChange = (customEvent: CustomInutEvent) => {
    onChange(customEvent);
  };

  return (
    <div className="form">
      <form className="form__el" action="#">
        <span className="form__labels">
          {params.map((item) => (
            <label
              className="form__label"
            >
              {item.name}
            </label>
          ))}
        </span>

        <span className="form__inputs">
          {model.ParamValue.map((item, i) => (
            <FormParam param={params[i]} value={item.value} params={params} paramId={item.paramId} type={params[i].type} handleChange={handleChange} />
          ))}
        </span>
      </form>
    </div >
  )
};


const FormParam = ({value, paramId, type, handleChange }: FormParamProps) => {

  return (
    <input
      className="form__input"
      value={value}
      type={type}
      onChange={(e) => handleChange({
        value: e.target.value,
        paramId: paramId,
        type: type
      })}
    />
  )
};


const NewParam = ({ handleAddParam, paramsLength }: newParamProps) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nameParam = (event.currentTarget[0] as HTMLInputElement).value;
    const valueParam = (event.currentTarget[1] as HTMLInputElement).value;;

    handleAddParam({
      params: [{
        id: paramsLength + 1,
        name: nameParam,
        type: "string",
      }],
      model: {
        ParamValue: [{
          paramId: paramsLength + 1,
          value: valueParam,
        }]
      }
    });

    (event.target as HTMLFormElement).reset();
  };

  return (
    <form className="add" onSubmit={(event) => handleSubmit(event)}>
      <input className="add__input" placeholder="Name" />
      <input className="add__input" placeholder="Value" />
      <button className="add__btn">Add Param</button>
    </form>
  )
};


const ShowParams = ({ model }: Props) => {
  const [showOutput, setShowOutput] = useState(false);

  const getModel = (): Model => {

    return model;
  };

  return (
    <div className="show-params">
      <button className="show-params__btn" onClick={() => setShowOutput((prev) => !prev)}>Get Model</button>
      <div className="show-params__output">
        {showOutput && JSON.stringify(getModel())}
      </div>
    </div>
  )
};


const App = () => {
  const [state, setState] = useState<Props>({
    params: [
      {
        id: 1,
        name: "Назначение",
        type: "string"
      },
      {
        id: 2,
        name: "Длинна",
        type: "string"
      },
    ],
    model: {
      ParamValue: [
        {
          paramId: 1,
          value: "повседневное"
        },
        {
          paramId: 2,
          value: "макси"
        },
      ]
    }
  });

  const handleChange = (customEvent: CustomInutEvent) => {
    const currentParamIndex = state.model.ParamValue.findIndex((item) => item.paramId === customEvent.paramId);

    setState(state => ({
      ...state,
      model: {
        ParamValue: state.model.ParamValue.map((el, i) => i === currentParamIndex ? { ...el, value: customEvent.value } : el)
      }
    }));
  };

  const handleAddParam = (param: Props) => {
    setState((state) => ({
      ...state,
      params: [
        ...state.params,
        param.params[0]
      ],
      model: {
        ParamValue: [...state.model.ParamValue, param.model.ParamValue[0]]
      }
    }));
  };

  return (
    <div className="app">
      <ListParams params={state.params} model={state.model} onChange={handleChange} />
      <NewParam handleAddParam={handleAddParam} paramsLength={state.params.length} />
      <ShowParams params={state.params} model={state.model} />
    </div>
  )
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
