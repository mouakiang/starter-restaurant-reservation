import React, {useState} from "react";
import { deleteTableReservation, listTables, seatReservation, updateReservationStatus } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function TableList({table}) {
    const [currentTable, setCurrentTable] = useState(table);
    const [error, setError] = useState(null);
    const history = useHistory();

    async function reloadTableData() {
      const abortController = new AbortController();
      try {
        const response = await deleteTableReservation(currentTable.table_id, abortController.signal);
        const tableToSet = response.find((table) => table.table_id === currentTable.table_id);
        setCurrentTable({...tableToSet})
        listTables()
        return tableToSet;
      } catch (error) {
        setError(error);
      }
      }

    async function handleClearTable(event) {
      const abortController = new AbortController();
      event.preventDefault();
      setError(null);
      if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
        await seatReservation({ status: "finished"}, currentTable.reservation_id, abortController.signal);
        const newTable = await reloadTableData();
        console.log(newTable);
        history.push("/tables");
        return;
      }
      }

      return (
        <>
        <ErrorAlert error={error} />
          <tr>
            <th scope="row"> {currentTable.table_id} </th>
            <td> {currentTable.table_name} </td>
            <td> {currentTable.capacity} </td>
            <td> {currentTable.reservation_id} </td>
            <td data-table-id-status={`${table.table_id}`}> {currentTable.table_status} </td>
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
      );
        
}

export default TableList;