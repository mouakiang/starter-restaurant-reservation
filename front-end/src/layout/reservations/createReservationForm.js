import React, { useState } from "react";
import { useHistory } from "react-router";
import { createReservation } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function CreateNewReservationForm({date}) {
//declare state
const history = useHistory();
const [error, setError] = useState(null);
const [reservation, setReservation] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "1",
});

//declare change handler
const handleChange = ({target}) => {
    setReservation({
        ...reservation,
        [target.name]: target.value,
    });
}

//declare handle submit 
function handleSubmit (e) {
    e.preventDefault();
    createReservation({
        ...reservation,
        people: Number(reservation.people),
    })
    .then(() => {
      history.push(`/dashboard?date=${reservation.reservation_date}`);
    })
    .catch(setError);
}

return (
    <>
    <h1> Create A Reservation </h1>
    <ErrorAlert error={error} />
    <form onSubmit={handleSubmit} className="form-group">
    <div className="row mb-3">
      <div className="col-4 form-group">
        <label className="form-label" htmlFor="first_name">
          First Name 
        </label>
        <input
        className="form-control"
        id="first_name"
        name="first_name"
        type="text"
        onChange={handleChange}
        required={true}
        value={reservation.first_name}
        />
        <small className="form-text text-muted"> Enter First Name</small>
      </div>
      <div className="col-4 form-group">
        <label className="form-label" htmlFor="last_name">
          Last Name
        </label>
        <input
        className="form-control"
        id="last_name"
        name="last_name"
        type="text"
        onChange={handleChange}
        required={true}
        value={reservation.last_name}
        />
         <small className="form-text text-muted"> Enter Last Name</small>
      </div>
      <div className="col-4 form-group">
        <label className="form-label" htmlFor="mobile_number">
          Mobile Number
        </label>
        <input
        className="form-control"
        id="mobile_number"
        name="mobile_number"
        type="text"
        onChange={handleChange}
        required={true}
        value={reservation.mobile_number}
        />
       <small className="form-text text-muted"> Enter Mobile Number</small>
      </div>
      <div className="col-4 form-group">
        <label className="form-label" htmlFor="reservation_date">
        <input
        className="form-control"
        id="reservation_date"
        name="reservation_date"
        type="date"
        onChange={handleChange}
        required={true}
        value={reservation.reservation_date}
        />
      <small className="form-text text-muted"> Enter Reservation Date</small>
        </label>
      </div>
      <div className="col-4 form-group">
        <label className="form-label" htmlFor="reservation_time">
        <input
        className="form-control"
        id="reservation_time"
        name="reservation_time"
        type="time"
        onChange={handleChange}
        required={true}
        value={reservation.reservation_time}
        />
      <small className="form-text text-muted"> Enter Reservation Time</small>
        </label>
      </div>
      <div className="col-4 form-group">
        <label className="form-label" htmlFor="people">
        <input
        className="form-control"
        id="people"
        name="people"
        type="number"
        onChange={handleChange}
        required={true}
        value={reservation.people}
        />
      <small className="form-text text-muted"> Enter Party Size</small>
        </label>
      </div>
    </div>
    </form>
    </>
)
}

export default CreateNewReservationForm;



