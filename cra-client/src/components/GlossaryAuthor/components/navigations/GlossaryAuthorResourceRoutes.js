/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */
import React, { useContext } from "react";

import { Route, Switch, Redirect } from "react-router-dom";

import { IdentificationContext } from "../../../../contexts/IdentificationContext";
import GlossaryAuthorBreadCrumb from "../GlossaryAuthorBreadCrumb";

import GlossaryTypeResourceNavigation from "./GlossaryTypeResourceNavigation";
import TermTypeResourceNavigation     from "./TermTypeResourceNavigation";
import CategoryTypeResourceNavigation     from "./CategoryTypeResourceNavigation";

import GlossaryIdResourceNavigation   from "./GlossaryIdResourceNavigation";
import CategoryIdResourceNavigation   from "./CategoryIdResourceNavigation";
import TermIdResourceNavigation       from "./TermIdResourceNavigation";

export default function GlossaryAuthorResourceRoutes() {
  const identificationContext = useContext(IdentificationContext);
  const getGlossaryAuthorURL = () => identificationContext.getBrowserURL("glossary-author");

  return (
    <div>
      <GlossaryAuthorBreadCrumb />

      <Switch>
        {/* types  */}
        <Redirect path={getGlossaryAuthorURL()} exact to={getGlossaryAuthorURL() + "/glossaries"} />
        <Route
          exact
          path={getGlossaryAuthorURL() + "/glossaries"}
          component={GlossaryTypeResourceNavigation}
        ></Route>
        <Route
          exact
          path={getGlossaryAuthorURL() + "/:priorSegments*/terms"}
          component={TermTypeResourceNavigation}
        ></Route>
        <Route
          exact
          path={getGlossaryAuthorURL() + "/:priorSegments*/categories"}
          component={CategoryTypeResourceNavigation}
        ></Route>
        {/* types plus id */}
        <Route
          exact
          path={getGlossaryAuthorURL() + "/glossaries/:guid"}
          component={GlossaryIdResourceNavigation}
        ></Route>
        <Route
          exact
          path={getGlossaryAuthorURL() + "/:priorSegments*/terms/:guid"}
          component={TermIdResourceNavigation}
        ></Route>
        <Route
          exact
          path={getGlossaryAuthorURL() + "/:priorSegments*/categories/:guid"}
          component={CategoryIdResourceNavigation}
        ></Route>
      </Switch>
    </div>
  );
}
