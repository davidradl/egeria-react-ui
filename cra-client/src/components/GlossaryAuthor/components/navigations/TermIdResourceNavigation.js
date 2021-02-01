/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */
import React, {useState, useEffect } from "react";

import { useLocation } from "react-router-dom";
import UpdateTerm from "../update/UpdateTerm";

export default function TermIdResourceNavigation({ match }) {
  const [isEdit, setIsEdit] = useState(false);


  const location = useLocation();
  useEffect(() => {
    setIsEdit(false);

    if (location.search) {
      const query = new URLSearchParams(location.search);
      const action = query.get('action');
      if (action && action === 'EDIT') {
        setIsEdit(true);
      } 
      //TODO other actions
    } else {
      setIsEdit(true);
    }

  }, [location]);
  return (
    <div>

      {isEdit && (
       <UpdateTerm />
      )}
    </div>
  );
}
