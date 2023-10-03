import React, { useEffect, useState } from "react";

import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import ReservationCreate from "../reservations/ReservationCreate";
import useQuery from "../utils/useQuery";
import CreateTables from "../tables/createTables";
import ReservationSeat from "../reservations/ReservationSeat";
/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */

function Routes() {
  const [date, setDate] = useState(today());

  const url = useRouteMatch();
  const query = useQuery();

  function loadDate(){
    const newDate = query.get("date");
    if(newDate) {
      setDate(newDate);
    }
  }

  useEffect(loadDate, [url, query]);

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date} />
      </Route>
      <Route path="/reservations/new">
        <ReservationCreate date={date}/>
      </Route>
      <Route path="/tables/new">
        <CreateTables/>
      </Route>
      <Route path="/tables">
        <Dashboard date={date}/>
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <ReservationSeat />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
