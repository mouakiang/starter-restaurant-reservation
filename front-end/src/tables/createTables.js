import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

function createTables() {

//declare state
const history = useHistory();
const [error, setError] = useState(null);
const [table, setTable] = useState({
    table_name: "",
    capacity: 1,
});

//declare change handler
const handleChange = ({target}) => {
    setTable({
        ...table,
        [target.name]: target.value,
    });
}

//const handle submit
const handleSubmit = (e) => {
    e.preventDefault();

    createTable(table)
        .then(() => {
            history.push(`/dashboard`);
         })
         .catch(setError);
    }
}


//return json
return (
    <>
    
    </>
)

export default createTables;