import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationList from "../reservations/ReservationList";
import TableList from "../tables/TableList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
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
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <table className="table">
        <thead>
          <tr>
            <th>Reservation ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>People</th>
            <th>Mobile Number</th>
            <th>Reservation Date</th>
            <th>Reservation Time</th>
            <th>Status</th>
            <th>Actions</th>
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
    </main>
  );
}

export default Dashboard;
