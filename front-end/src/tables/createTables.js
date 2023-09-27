import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

function CreateTables() {
  const history = useHistory();
  const [error, setError] = useState(null);
  const [table, setTable] = useState({
    table_name: "",
    capacity: 1, 
  });

  const handleChange = ({ target }) => {
    if (target.name === "capacity") {
        setTable({ ...table, [target.name]: Number(target.value) });
      } else {
        setTable({
            ...table,
            [target.name]: target.value,
          });  
      }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();

    console.log(typeof table.capacity);

    createTable(table, abortController.signal)
      .then(() => history.push(`/dashboard`))
      .catch(setError);

    return () => abortController.abort();
  };

  return (
    <>
      <h1>Create A Table</h1>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit} className="form-group">
        <div className="row mb-3">
          <div className="col-4 form-group">
            <label className="form-label" htmlFor="table_name">
              Table Name
            </label>
            <input
              className="form-control"
              id="table_name"
              name="table_name"
              type="text"
              onChange={handleChange}
              required={true}
              value={table.table_name}
            />
            <small className="form-text text-muted"> Enter Table Name</small>
          </div>
          <div className="col-4 form-group">
            <label className="form-label" htmlFor="capacity">
              Capacity
            </label>
            <input
              className="form-control"
              id="capacity"
              name="capacity"
              type="number"
              onChange={handleChange}
              required={true}
              value={table.capacity}
            />
            <small className="form-text text-muted">Enter Capacity</small>
          </div>
        </div>
        <button
          type="button"
          onClick={() => history.goBack()}
          className="btn btn-secondary mr-2"
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Submit Table
        </button>
      </form>
    </>
  );
}

export default CreateTables;
