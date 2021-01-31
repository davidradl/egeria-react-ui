/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */
import React, {useState, useEffect } from "react";

import { useLocation } from "react-router-dom";
import UpdateGlossary from "../update/UpdateGlossary";
import GlossaryQuickTerms from "../GlossaryQuickTerms";
import GlossaryChildren from "../GlossaryChildren";

export default function GlossaryIdResourceNavigation({ match }) {
  // const [isGlossaryList, setIsGlossaryList] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isQuickTerms, setIsQuickTerms] = useState(false);
  const [isChildren, setIsChildren] = useState(false);
  const [childType, setChildType] = useState('terms');


  const location = useLocation();
  useEffect(() => {
    setIsEdit(false);

    if (location.search) {
      const query = new URLSearchParams(location.search);
      const action = query.get('action');
      const type = query.get('type');
      
      if (action && action === 'EDIT') {
        setIsEdit(true);
      } if (action && action === 'QUICK-TERMS') {  
        setIsQuickTerms(true); 
      } if (action && action === 'CHILDREN') {  
        if (type) {
          setChildType(type);
        }
        setIsChildren(true); 
      } else {
        setIsEdit(true);
      }
    } else {
      setIsEdit(true);
    }

  }, [location]);
  return (
    <div>

      {isEdit && (
       <UpdateGlossary />
      )}
      {isQuickTerms && (
       <GlossaryQuickTerms />
      )}
      {isChildren && (
       <GlossaryChildren childType={childType} />
      )}
    </div>
  );
}
