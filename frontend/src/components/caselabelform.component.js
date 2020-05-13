import React, { useState } from 'react';

const CaseLabelFormComponent = (props) => {
  const [selectedValue, setSelectedValue] = useState('');

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        props.labelNextCase(selectedValue);
        setSelectedValue('');
      }}
    >
      <div className="row">
        <div className="col">
          <div className="form-group">
            <label htmlFor="nextCase">Please review this case:</label>
            <textarea
              className="form-control form-control-sm"
              id="nextCase"
              rows="20"
              value={props.nextCase.content}
            />
          </div>
        </div>

        <div className="col">
          <div className="form-group">
            <label htmlFor="label">Select condition:</label>
            <select
              className="form-control form-control-sm"
              id="label"
              size="15"
              value={selectedValue}
              onChange={(event) => setSelectedValue(event.target.value)}
            >
              {props.labels.map((label) => (
                <option
                  key={label.code}
                  value={label.code}
                >{`${label.description} (${label.code})`}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="row justify-content-end">
        <div className="col"></div>
        <div className="col">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!selectedValue}
          >
            Next case
          </button>
        </div>
      </div>
    </form>
  );
};

export default CaseLabelFormComponent;
