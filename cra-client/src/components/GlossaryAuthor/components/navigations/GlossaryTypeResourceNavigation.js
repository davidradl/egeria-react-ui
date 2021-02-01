/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import NodesNavigation from "./NodesNavigation";
// create glossary
import CreateGlossary from "../create/CreateGlossary";

export default function GlossaryTypeResourceNavigation({ match }) {
  const [isGlossaryList, setIsGlossaryList] = useState(false);
  const [isCreate, setIsCreate] = useState(false);


  const location = useLocation();
  useEffect(() => {
    setIsCreate(false);
    setIsGlossaryList(false);
    if (location.search) {
      const query = new URLSearchParams(location.search);
      const action = query.get('action');
      
      if (action && action === 'CREATE') {
        setIsCreate(true);
      } else {
        setIsGlossaryList(true);
      }
    } else {
      setIsGlossaryList(true);
    }

  }, [location]);

  return (
    <div>
      {isGlossaryList && (
        <NodesNavigation match={match} nodeTypeName="glossary" />
      )}
      {isCreate && (
        <CreateGlossary match={match} />
      )}
    </div>
  );
}
