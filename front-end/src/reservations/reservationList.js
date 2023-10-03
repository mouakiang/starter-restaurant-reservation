import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import {listTables, updateReservationStatus} from "../utils/api"


function ReservationList({res}) {
  const [error, setError] = useState(null);
  const history = useHistory();


  const handleCancelReservation = async () => {
    setError(null);

    if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
      try {
        await updateReservationStatus({ status: "cancelled" }, res.reservation_id);
        await listTables();
        history.push("/dashboard");
      } catch (error) {
        setError(error);
      }
    }
  };

  return (
    <>
      <ErrorAlert error={error} />
      <tr>
        <th scope="row"> {res.reservation_id} </th>
        <td> {res.first_name} </td>
        <td> {res.last_name} </td>
        <td> {res.people} </td>
        <td> {res.mobile_number} </td>
        <td> {res.reservation_date} </td>
        <td> {res.reservation_time} </td>
        <td data-reservation-id-status={res.reservation_id}> {res.status} </td>
        <td>
          {res.status === 'booked' ? 
            <a href={`/reservations/${res.reservation_id}/seat`}>
              <button className="btn btn-primary"> Seat </button>
            </a> 
            : null
          }
        </td>
        <td>
          {res.status === 'booked' ?
            <a href={`/reservations/${res.reservation_id}/edit`}>
              <button className="btn btn-primary "> Edit </button>
            </a>
            : null
          }
        </td>
        <td data-reservation-id-cancel={res.reservation_id}>
          {res.status === 'booked' ?
            <button className="btn btn-danger ml-2" onClick={handleCancelReservation}> Cancel </button>
            : null
          }
        </td>
      </tr>
    </>
  );
}

export default ReservationList;