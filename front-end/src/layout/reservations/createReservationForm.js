import React, { useState } from "react";
import { useHistory } from "react-router";
import { createReservation } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function CreateNewReservation({date}) {
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

    </>
)
}

export default CreateNewReservation;



