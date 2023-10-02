import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationList from "../reservations/ReservationList";
import TableList from "../tables/TableList";
import ReservationSeat from "../reservations/ReservationSeat";

function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
  
    Promise.all([
      listReservations({ date }, abortController.signal),
      listTables(),
    ])
      .then(([reservationData, tableData]) => {
        setReservations(reservationData);
        setTables(tableData);
      })
      .catch((error) => {
        setReservationsError(error);
        setTablesError(error);
      });
  
    return () => abortController.abort();
  }
  

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Reservation ID</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Party Size</th>
            <th scope="col">Mobile Number</th>
            <th scope="col">Reservation Date</th>
            <th scope="col">Reservation Time</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
            <th scope="col"> Seat </th>
            <th scope="col"> Edit </th>
            <th scope="col"> Cancel </th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <ReservationList key={reservation.reservation_id} res={reservation} />
          ))}
        </tbody>
      </table>
      <div className="mt-4">
    <h4>Tables</h4>
    <ErrorAlert error={tablesError} />
    <table className="table">
      <thead>
        <tr>
          <th>Table ID</th>
          <th>Table Name</th>
          <th>Capacity</th>
          <th>Occupancy</th>
        </tr>
      </thead>
      <tbody>
        {tables.map((table) => (
          <TableList key={table.table_id} table={table} />
        ))}
      </tbody>
    </table>
    </div>
  <div>
  {reservations.map((reservation) => (
    <ReservationSeat key={reservation.reservation_id} reservation_id={reservation.reservation_id} />
  ))}
  </div>
    </main>
  );
}

export default Dashboard;
