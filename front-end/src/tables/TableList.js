import React, {useState} from "react";
import { deleteTableReservation, listTables, updateReservationStatus } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function ListTables({table}) {
    const [currentTable, setCurrentTable] = useState(table);
    const [error, setError] = useState(null);
    const history = useHistory();

    async function reloadTableData() {
        const abortController = new AbortController();
        
        try {
          const [tableToSet] = await Promise.all([
            deleteTableReservation(currentTable.table_id, abortController.signal),
            listTables()
          ]);
      
          setCurrentTable({ ...tableToSet });
          return tableToSet;
        } catch (error) {
          setError(error);
        }
      }

    async function handleClearTable(event) {
        event.preventDefault();
        setError(null);
      
        if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
          try {
            await updateReservationStatus({ status: "finished" }, currentTable.reservation_id);
            const newTable = await reloadTableData();
            console.log(newTable);
            history.push("/tables");
          } catch (error) {
            setError(error);
          }
        }
      }

      return (
        <>
        <ErrorAlert error={error} />
        <tr>
            <th scope="row">{currentTable.table_id}</th>
            <td>{currentTable.table_name}</td>
            <td>{currentTable.capacity}</td>
            <td>{currentTable.reservation_id}</td>
            <td data-table-id-status={`${table.table_id}`}>{currentTable.table_status}</td>
            <td >
            {currentTable.reservation_id ?
            <button
            className="btn btn-danger"
            onClick={handleClearTable}
            data-table-id-finish={`${table.table_id}`}
            > 
            Finish 
            </button>
            : 
            <></>
            }
        </td>
        </tr>
        </>
      )
        
}

export default ListTables;