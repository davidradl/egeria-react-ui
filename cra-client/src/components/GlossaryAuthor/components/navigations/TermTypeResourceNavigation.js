/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import NodesNavigation from "./NodesNavigation";
// create glossary
import CreateGlossary from "../create/CreateGlossary";

export default function TermTypeResourceNavigation({ match }) {
  
  return (
    <div>
        <NodesNavigation match={match} nodeTypeName="term" />
    </div>
  );
}
