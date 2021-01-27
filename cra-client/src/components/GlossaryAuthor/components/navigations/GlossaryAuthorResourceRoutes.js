/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */
import React, { useContext } from "react";

import { Route, Switch } from "react-router-dom";

import { IdentificationContext } from "../../../../contexts/IdentificationContext";
import GlossaryAuthorBreadCrumb from "../GlossaryAuthorBreadCrumb";

import GlossaryTypeResourceNavigation from "./GlossaryTypeResourceNavigation";
import CategoryTypeResourceNavigation from "./CategoryTypeResourceNavigation";
import TermTypeResourceNavigation     from "./TermTypeResourceNavigation";

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
        <Route
          exact
          path={getGlossaryAuthorURL()}
          component={GlossaryTypeResourceNavigation}
        ></Route>
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
          path={getGlossaryAuthorURL() + "/glossaries/:glossaryGuid"}
          component={GlossaryIdResourceNavigation}
        ></Route>
        <Route
          exact
          path={getGlossaryAuthorURL() + "/:priorSegments*/terms/:termGuid"}
          component={TermIdResourceNavigation}
        ></Route>
        <Route
          exact
          path={getGlossaryAuthorURL() + "/:priorSegments*/categories/:categoryGuid"}
          component={CategoryIdResourceNavigation}
        ></Route>
      </Switch>
    </div>
  );
}
