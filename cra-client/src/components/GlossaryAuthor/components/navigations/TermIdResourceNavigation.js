/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */
import React from "react";

export default function TermIdResourceNavigation({ match }) {
  return (
    <div>
      <div>Term id </div>
      <div>Term guid is {match.params.termGuid}</div>
      <div>Prior segments are {match.params.priorSegments}</div>
    </div>
  );
}
