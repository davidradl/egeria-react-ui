/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */
import React, { useState, useEffect, useContext } from "react";

import { IdentificationContext } from "../../../contexts/IdentificationContext";
import { ContentSwitcher, Switch } from "carbon-components-react";
import GlossaryAuthorTermsNavigation from "./navigations/GlossaryAuthorTermsNavigation";
import GlossaryAuthorCategoriesNavigation from "./navigations/GlossaryAuthorCategoriesNavigation";
import getNodeType from "./properties/NodeTypes";
import { useHistory, useLocation, withRouter } from "react-router-dom";

function NodeChildren(props) {
  const identificationContext = useContext(IdentificationContext);
  console.log("NodeChildren(props) " + props);
  const [selectedContentIndex, setSelectedContentIndex] = useState(0);
  /**
   * this useEffect is required so that the content in the content switcher is kept in step with the url.
   * This is required when the back button is pressed returning from a child component.
   */
  useEffect(() => {
    let index = 0;
    if (props.childType === "terms") {
      index = 1;
    }
    setSelectedContentIndex(index);
  }, []);
  const guid = props.parentguid;
  let history = useHistory();
  const location = useLocation();

  const onChange = (e) => {
    //  Conundrum
    // If I replace the url with the child type then only the child type will be displayed. 
    // or I have the holder parent url /id?action=children&type=terms
    // then we click on the id and we have a missing element in the breadcrumb.
    // so
    // glossaries -> list of glossaries
    // glossaries/id -> selected glossary in the list of glossaries
    // glossaries/id/terms -shows terms in glossary 
    // glossaries/id/categories -shows categories in glossary  
    
    // glossaries/id/terms and glossaries/id/categories both drives the glossary children page with appropriate tab selected. 
    // TODO pass isTop as a query param so we can reuse the category children for glossary and category children   

    history.replace(location.pathname + "/" + `${e.name}`); 
  };

  return (
    <div>
      <ContentSwitcher selectedIndex={selectedContentIndex} onChange={onChange}>
        <Switch name="categories" text="Categories" />
        <Switch name="terms" text="Terms" />
      </ContentSwitcher>

      {selectedContentIndex === 0 && (
        <GlossaryAuthorCategoriesNavigation
          getCategoriesURL={location.pathname + "/" + props.childType}
        />
      )}
      {selectedContentIndex === 1 && (
        <GlossaryAuthorTermsNavigation getTermsURL={location.pathname + "/" + props.childType} />
      )}
    </div>
  );
}
export default withRouter(NodeChildren);