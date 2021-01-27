/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */
import React from "react";
import StartingNodeNavigation from "./StartingNodeNavigation"

export default function TermTypeResourceNavigation({ match }) {
  const isTop = getIsTop();
  const getIsTop = () =>
    match.params.priorSegments === undefined ||
    match.params.priorSegments === null;
  return (
    <div>
      {isTop && (
        <StartingNodeNavigation match={match} nodeTypeName="term" />
      )}
    </div>
  );
}
