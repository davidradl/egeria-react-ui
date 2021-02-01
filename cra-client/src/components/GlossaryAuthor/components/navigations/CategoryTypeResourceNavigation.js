/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NodesNavigation from "./NodesNavigation";
// create category
import CreateCategory from "../create/CreateCategory";

export default function CategoryTypeResourceNavigation({ match }) {
  const [isTop, setIsTop] = useState(true);
  const [isCategoryList, setIsCategoryList] = useState(false);
  const [isCreate, setIsCreate] = useState(false);


  const location = useLocation();
  useEffect(() => {
    setIsCreate(false);
    setIsCategoryList(false);
    if (location.search) {
      const query = new URLSearchParams(location.search);
      const action = query.get('action');
      
      if (action && action === 'CREATE') {
        setIsCreate(true);
      } else {
        setIsCategoryList(true);
      }
    } else {
      setIsCategoryList(true);
    }

  }, [location]);

  return (
    <div>
      {isCategoryList && (
        <NodesNavigation match={match} nodeTypeName="category" />
      )}
      {isCreate && (
        <CreateCategory match={match} />
      )}
    </div>
  );
}

