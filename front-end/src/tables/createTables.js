import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

function CreateTables() {

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

    //return json
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
                value={table.table_name}
                />
                <small className="form-text text-muted"> Enter First Name</small> 
            </div>
            <div className="col-4 form-group">
                <label className="form-label" htmlFor="capacity">
                    Capacity
                </label>
                <input 
                className="form-control"
                id="capacity"
                name="capacity"
                type="text"
                onChange={handleChange}
                required={true}
                value={table.capacity}
                />
            </div>
        </div>
    </form>
    </>
)

}



export default CreateTables;