import React, { useState } from "react";
import { useHistory } from "react-router";
import {createReservations} from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function createNewReservation({date}) {
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


}

export default createNewReservation;



