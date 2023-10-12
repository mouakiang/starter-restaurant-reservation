import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { cancelReservation } from "../utils/api.js";
import { useHistory } from "react-router-dom";

const ReservationCancel = ({reservation_id}) => {
  const history = useHistory();
  const [error, setError] = useState(null);

  const clickHandler = async(event) =>{
     event.preventDefault();

     if (
      window.confirm(
        'Do you want to cancel this reservation? This cannot be undone.'
      )
     ) {
      const abortController = new AbortController();
      setError(null);

      try {
        await cancelReservation(reservation_id, abortController.signal);
        history.go(0);
      } catch (error) {
        setError(error);
      }
      return () => abortController.abort();
     }
  };


return (
  <div>
    <ErrorAlert error={error} />
    <button
      className="btn btn-secondary"
      data-reservation-id-cancel={reservation_id}
      onClick={clickHandler}
    >
      Cancel
    </button>
  </div>
);
}

export default ReservationCancel
