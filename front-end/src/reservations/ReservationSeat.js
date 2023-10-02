import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { listTables, seatReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

function ReservationSeat() {
  const history = useHistory();
  const { reservation_id } = useParams();
    
  const [tables, setTables] = useState([]);
  const [tableFormData, setTableFormData] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    setError(null);
    listTables()
      .then(setTables)
      .catch(setError);

    return () => abortController.abort();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tableObj = JSON.parse(tableFormData);
      if (tableObj.table_name === "Bar #1") {
        throw new Error("Cannot seat reservation at Bar #1");
      }

      const response = await seatReservation(tableObj.table_id, reservation_id);

      const newTables = tables.map((table) => {
        return table.table_id === response.table_id ? response : table;
      });

      setTables(newTables);
      history.push('/dashboard');
    } catch (error) {
      setError(error);
    }
  };

  if (tables.length > 0) {
    return (
      <>
        <div className="mb-3">
          <h1>Seat The Current Reservation</h1>
        </div>

        <ErrorAlert error={error} />
        <div className="mb-3">
          <h3>Current Reservation: {reservation_id}</h3>
        </div>

        <form className="form-group" onSubmit={handleSubmit}>
          <div className="col mb-3">
            <label className="form-label" htmlFor="table_id"> Select Table</label>
            <select
              className="form-control"
              name="table_id"
              id="table_id"
              value={tableFormData}
              onChange={(e) => setTableFormData(e.target.value)}
            >
              <option value=""> Table Name - Capacity</option>
              {tables.map((table) => (
                <option
                  key={table.table_id}
                  value={JSON.stringify(table)}
                  required={true}
                >
                  {table.table_name} - {table.capacity}
                </option>
              ))}
            </select>
          </div>
          <button type="button" onClick={() => history.goBack()} className="btn btn-secondary mr-2"> Cancel </button>
          <button className="btn btn-primary" type="submit"> Submit </button>
        </form>
      </>
    );
  } else {
    return (
      <div>
        <h1> No open tables to seat </h1>
      </div>
    )
  }
}

export default ReservationSeat;
