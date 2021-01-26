/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */
import React, { useState, useEffect } from "react";
import { Breadcrumb, BreadcrumbItem } from "carbon-components-react";
import { useHistory, Link } from "react-router-dom";

// import getNodeType from "./properties/NodeTypes";

export default function GlossaryAuthorBreadCrumb(props) {
  // const identificationContext = useContext(IdentificationContext);
  console.log("GlossaryAuthorBreadCrumb ");
  const history = useHistory();
  const [breadcrumbMap, setBreadcrumbMap] = useState({});

  // *******   all files growing ********
  // useEffect(() => {
  //   history.listen((location) => {
  //     console.log(`You changed the page to: ${location.pathname}`);
  //     // /aaa/glossary-author/glossaries/5854fe88-2277-4bae-9e95-3258e4a7e5aa/children
  //     let map = [];

  //     let growingUrl =
  //       window.location.protocol +
  //       "//" +
  //       window.location.hostname +
  //       ":" +
  //       window.location.port;

  //     const segments = location.pathname.split("/");
  //     for (var i = 0; i < segments.length; i++) {
  //       const segment = segments[i];
  //       if (segment && segment.length > 0) {
  //         growingUrl = growingUrl + "/" + segment;
  //         if (i > 1) {
  //           let crumb = {};
  //           crumb.name = segment;
  //           let backupPrefix ="";
  //           for (var j=0;j<segments.length-2;j++) {
  //             backupPrefix = backupPrefix + "../";
  //           }
  //           crumb.url = backupPrefix + growingUrl;
  //           map.push(crumb);
  //         }
  //       }
  //     }
  //     setBreadcrumbMap(map);
  //   });
  // }, [history]);

  // *******   all files ../ approach ********
  // useEffect(() => {
  //   history.listen((location) => {
  //     console.log(`You changed the page to: ${location.pathname}`);
  //     // /aaa/glossary-author/glossaries/5854fe88-2277-4bae-9e95-3258e4a7e5aa/children
  //     let map = [];
  //     let backupPrefix = "";
  //     for (var i = segments.length ; i > 2 ; i--) {
  //       let crumb = {};
  //       crumb.name = segments[i];
  //       if (crumb.name && crumb.name.length > 0) {
  //         if ( i == segments.length -1 ) {
  //           crumb.url ="";
  //         } else {
  //         backupPrefix = backupPrefix + "../";
  //         crumb.url = backupPrefix;
  //       }
  //         console.log("crumb name = " + crumb.name + ",crumb url = " + crumb.url);
  //         map.unshift(crumb);
  //       }
  //     }
  //     setBreadcrumbMap(map);
  //   });
  // }, [history]);

  // useEffect(() => {
  //   history.listen((location) => {
  //     console.log(`You changed the page to: ${location.pathname}`);
  //     // /aaa/glossary-author/glossaries/5854fe88-2277-4bae-9e95-3258e4a7e5aa/children
  //     let map = [];
  //     let backupPrefix = "";
  //     const segments = location.pathname.split("/");
  //     for (var i = segments.length ; i > 2 ; i--) {
  //       let crumb = {};
  //       crumb.name = segments[i];
  //       if (crumb.name && crumb.name.length > 0) {
  //         if ( i == segments.length -1 ) {
  //           crumb.url ="";
  //         } else {
  //         backupPrefix = backupPrefix + "../";
  //         crumb.url = backupPrefix;
  //       }
  //         console.log("crumb name = " + crumb.name + ",crumb url = " + crumb.url);
  //         map.unshift(crumb);
  //       }
  //     }
  //     setBreadcrumbMap(map);
  //   });
  // }, [history]);

  useEffect(() => {
    history.listen((location) => {
      console.log(`You changed the page to: ${location.pathname}`);
      // /aaa/glossary-author/glossaries/5854fe88-2277-4bae-9e95-3258e4a7e5aa/children
      let map = [];
      let backupPrefix = "";
      const segments = location.pathname.split("/");
      for (var i = segments.length; i > 2; i--) {
        let crumb = {};
        crumb.name = segments[i];
        if (crumb.name && crumb.name.length > 0) {
          if (i === segments.length - 1) {
            crumb.url = "";
          } else {
            backupPrefix = backupPrefix + "../";
            crumb.url = backupPrefix;
          }
          console.log(
            "crumb name = " + crumb.name + ",crumb url = " + crumb.url
          );

          if (segments[i] === "children"
          ) {
            crumb.name = segments[i-1] + " " + segments[i];
            i--;
          }

          map.unshift(crumb);
        }
      }
      setBreadcrumbMap(map);
    });
  }, [history]);
  return (
    <div>
      <Breadcrumb>
        {breadcrumbMap &&
          breadcrumbMap.length > 0 &&
          breadcrumbMap.map((crumb) => {
            return (
              <BreadcrumbItem>
                <Link to={crumb.url}>{crumb.name}</Link>
              </BreadcrumbItem>
            );
          })}
      </Breadcrumb>
    </div>
  );
}
