/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */
import React from "react";

import { Route } from "react-router-dom";
import GlossaryAuthorComponentChooser from "../GlossaryAuthorComponentChooser";

// the top paths
function getGlossariesTypePath() {
  let path;
  const currentLocationArray = glossaryAuthorURL.split("/");
  const lastSegment = currentLocationArray[currentLocationArray.length - 1];
  if (lastSegment === "glossaries") {
    // if we are navigated to via the task drop down we get a url ending with glossaries
    path = glossaryAuthorURL;
  } else {
    // if we are navigated to as the default component loaded under glossary-author then we need to append the glossaries
    path = glossaryAuthorURL + "/glossaries";
  }
  console.log("getGlossariesPath " + path);
  return path;
}
function getGlossariesIdPath() {
  let path;
  const currentLocationArray = glossaryAuthorURL.split("/");
  const lastSegment = currentLocationArray[currentLocationArray.length - 1];
  if (lastSegment === "glossaries") {
    // if we are navigated to via the task drop down we get a url ending with glossaries
    path = glossaryAuthorURL;
  } else {
    // if we are navigated to as the default component loaded under glossary-author then we need to append the glossaries
    path = glossaryAuthorURL + "/glossaries";
  }
  console.log("getGlossariesPath " + path);
  return path;
}
function getTermsTypePath() {
  let path;
  const currentLocationArray = glossaryAuthorURL.split("/");
  const lastSegment = currentLocationArray[currentLocationArray.length - 1];
  if (lastSegment === "terms") {
    // if we are navigated to via the task drop down we get a url ending with terms
    path = glossaryAuthorURL;
  } else {
    // if we are navigated to as the default component loaded under glossary-author then we need to append the terms
    path = glossaryAuthorURL + "/terms";
  }
  console.log("getTermsPath " + path);
  return path;
}
function getCategoriesTypePath() {
  let path;
  const currentLocationArray = glossaryAuthorURL.split("/");
  const lastSegment = currentLocationArray[currentLocationArray.length - 1];
  if (lastSegment === "categories") {
    // if we are navigated to via the task drop down we get a url ending with terms
    path = glossaryAuthorURL;
  } else {
    // if we are navigated to as the default component loaded under glossary-author then we need to append the categories
    path = glossaryAuthorURL + "/categories";
  }
  console.log("getCategriesPath " + path);
  return path;
}

export default function GlossaryAuthorResourceRoutes({ glossaryAuthorURL }) {
  return (
    <div>
      <GlossaryAuthorBreadCrumb />

      <Switch>
        {/* <Route path={`${match.url}/:id`} component={GlossaryAuthorComponentChooser}/> */}

        {/* top types  */}
        <Route
          exact
          path={getGlossariesTypePath()}
          component={GlossaryTypeNavigation}
        ></Route>
        <Route
          exact
          path={getTermsTypePath()}
          component={TermTypeNavigation}
        ></Route>
        <Route
          exact
          path={getCategoriesTypePath()}
          component={CategoryTypeNavigation}
        ></Route>
        {/* top types plus id */}
        <Route
          exact
          path={getGlossariesIdPath()}
          component={GlossaryIdNavigation}
        ></Route>
        <Route
          exact
          path={getTermsIdPath()}
          component={TermIdNavigation}
        ></Route>
        <Route
          exact
          path={getCategoriesIdPath()}
          component={CategoryIdNavigation}
        ></Route>

      </Switch>
    </div>
  );
}
