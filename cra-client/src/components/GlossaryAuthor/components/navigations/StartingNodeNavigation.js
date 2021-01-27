/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */
import React, { useState, useEffect, useContext } from "react";

import { IdentificationContext } from "../../../../contexts/IdentificationContext";

import { Pagination, Toggle } from "carbon-components-react";
import Add32 from "../../../../images/carbon/Egeria_add_32";
import Delete32 from "../../../../images/carbon/Egeria_delete_32";
import Edit32 from "../../../../images/carbon/Egeria_edit_32";
import Term32 from "../../../../images/odpi/Egeria_term_32";
import ParentChild32 from "../../../../images/carbon/Egeria_parent_child_32";
import GlossaryImage from "../../../../images/odpi/Egeria_glossary_32";

import { LocalNodeCard, NodeCardSection } from "../NodeCard/NodeCard";
import { issueRestGet, issueRestDelete } from "../RestCaller";
import useDebounce from "../useDebounce";
import NodeTableView from "../views/NodeTableView";
import getNodeType from "../properties/NodeTypes.js";

import { Link } from "react-router-dom";
import { useLocation, useHistory } from "react-router-dom";

export default function StartingNodeNavigation({
  match,
  nodeTypeName,
  onSelectCallback,
}) {
  const identificationContext = useContext(IdentificationContext);
  const [nodes, setNodes] = useState([]);
  const [isCardView, setIsCardView] = useState(true);
  const [total, setTotal] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  let history = useHistory();
  // State and setter for search term
  // State and setter for search term
  const [filterCriteria, setFilterCriteria] = useState("");
  const [exactMatch, setExactMatch] = useState(false);
  // Now we call our hook, passing in the current filterCriteria value.
  // The hook will only return the latest value (what we passed in) ...
  // ... if it's been more than 500ms since it was last called.
  // Otherwise, it will return the previous value of filterCriteria.
  // The goal is to only have the API call fire when user stops typing ...
  // ... so that we aren't hitting our API rapidly.
  const debouncedFilterCriteria = useDebounce(filterCriteria, 500);

  const [errorMsg, setErrorMsg] = useState();
  const [selectedNodeGuid, setSelectedNodeGuid] = useState();
  // const [debouncedFilterCriteria, setDebouncedFilterCriteria] = useState();

  const nodeType = getNodeType(
    identificationContext.getRestURL("glossary-author"),
    nodeTypeName
  );

  const location = useLocation();
  // Here's where the API call happens
  // We use useEffect since this is an asynchronous action
  useEffect(
    () => {
      const query = new URLSearchParams(location.search);
      let isExactMatchSet = false;
      if (query.get("exactMatch"))
        isExactMatchSet = query.get("exactMatch") === "true";
      if (query.get("pageSize")) setPageSize(parseInt(query.get("pageSize")));
      if (query.get("pageNumber"))
        setPageNumber(parseInt(query.get("pageNumber")));
      if (query.get("exactMatch")) setExactMatch(isExactMatchSet);
      if (query.get("searchString"))
        setFilterCriteria(query.get("searchString"));
      // processUserCriteriaAndIssueSearch();
    },
    // This is the useEffect input array
    // Our useEffect function will only execute if this value changes ...
    // ... and thanks to our hook it will only change if the original ...
    // value (FilterCriteria) hasn't changed for more than 500ms.
    // If the exactMatch changes then we need to re-issue the search.
    // [debouncedFilterCriteria, exactMatch, pageSize, pageNumber]
    [location]
  );
  useEffect(
    () => {
      // const query = new URLSearchParams(location.search);
      // let isExactMatchSet = false;
      // if (query.get('exactMatch')) isExactMatchSet = (query.get('exactMatch') === 'true');
      // if (query.get('pageSize')) setPageSize(parseInt(query.get('pageSize')));
      // if (query.get('pageNumber')) setPageNumber(parseInt(query.get('pageNumber')));
      // if (query.get('exactMatch')) setExactMatch(isExactMatchSet);
      //if (query.get('searchString')) setDebouncedFilterCriteria(query.get('searchString'));
      processUserCriteriaAndIssueSearch();
    },
    // This is the useEffect input array
    // Our useEffect function will only execute if this value changes ...
    // ... and thanks to our hook it will only change if the original ...
    // value (FilterCriteria) hasn't changed for more than 500ms.
    // If the exactMatch changes then we need to re-issue the search.
    // [debouncedFilterCriteria, exactMatch, pageSize, pageNumber]
    [pageSize, pageNumber, exactMatch, debouncedFilterCriteria]
  );

  const paginationProps = () => ({
    disabled: false,
    page: pageNumber,
    pagesUnknown: true,
    pageInputDisabled: false,
    backwardText: "Previous page",
    forwardText: "Next page",
    totalItems: total,
    pageSize: pageSize,
    pageSizes: [5, 10, 50, 100],
    itemsPerPageText: "Items per page:",
    onChange: onPagination,
  });
  // driven when pagination options have changed - page size or page number
  const onPagination = (options) => {
    console.log("onPaginationChange");
    console.log(options);
    let queryParams = {};
    if (options.pageSize) queryParams.pageSize = options.pageSize;
    if (options.page) queryParams.pageNumber = options.page;
    updateQueryParams(queryParams);
  };
  function updateQueryParams(newQueryParams) {
    const query = new URLSearchParams(location.search);
    for (var newQueryParam in newQueryParams) {
      query.set(newQueryParam, newQueryParams[newQueryParam]);
    }
    // Update the location with the new query params
    history.replace({
      search: encodeURI(query.toString())
    });
  }
  function removeQueryParam(paramName) {
    const query = new URLSearchParams(location.search);
    console.log("query.get(paramName");
    console.log(query.get(paramName));
    if (query.get(paramName)) {
      console.log("query.get(paramName");
      query.delete(paramName);
      console.log("query");
      console.log(query);
      // Update the location with the new query params
      history.replace({
        search: query.toString(),
      });
    }
  }

  // Refresh the displayed nodes search results
  // this involves taking the results and pagination options and calculating nodes that is the subset needs to be displayed
  // The results, page size and page number are passed as arguments, rather than picked up from state, as the state updates
  // are done asynchronously in a render cycle.

  function refreshNodes(results, passedPageSize, passedPageNumber) {
    let selectedInResults = false;
    // the total that we are trying to keep track of is all the previous pages plus the current results length.
    // because we ask for one more thatn the page size the pagination widget should indicate a there is another page only if there really is

    console.log("passed page number " + passedPageNumber);
    console.log("passed page size " + passedPageSize);
    console.log("resuilts length " + results.length);
    // define as a constant so that the + is an arithmetic + not a string concatination +.
    const calculatedTotal =
      (passedPageNumber - 1) * passedPageSize + results.length;
    console.log("total is going to be " + calculatedTotal);
    setTotal(calculatedTotal);
    if (results.length > passedPageSize) {
      // remove the last element.
      results.pop();
    }
    if (results && results.length > 0) {
      results.map(function (row) {
        row.id = row.systemAttributes.guid;
        if (selectedNodeGuid && selectedNodeGuid === row.id) {
          row.isSelected = true;
          selectedInResults = true;
        }
      });
      setNodes(results);
    } else {
      setNodes([]);
    }
    // we have selectedNode but it is not in the search results - we must have deleted it.
    if (!selectedInResults) {
      setSelectedNodeGuid(undefined);
    }
  }
  const processUserCriteriaAndIssueSearch = () => {
    // sort out the actual search criteria.
    let actualDebounceCriteria = debouncedFilterCriteria;
    if (actualDebounceCriteria) {
      if (!exactMatch) {
        actualDebounceCriteria = actualDebounceCriteria + ".*";
      }
    } else {
      // by default get everything
      actualDebounceCriteria = ".*";
    }
    // Fire off our API call
    issueNodeSearch(actualDebounceCriteria);
  };

  // issue search for first page of nodes
  const issueNodeSearch = (criteria) => {
    // encode the URI. Be aware the more recent RFC3986 for URLs makes use of square brackets which are reserved (for IPv6)
    const url = encodeURI(
      nodeType.url +
        "?searchCriteria=" +
        criteria +
        "&pageSize=" +
        (pageSize + 1) +
        "&startingFrom=" +
        (pageNumber - 1) * pageSize
    );
    issueRestGet(url, onSuccessfulSearch, onErrorSearch);
  };

  const onClickDelete = () => {
    setErrorMsg("");
    console.log("Delete");
    if (selectedNodeGuid) {
      nodes.forEach(deleteIfSelected);
    }
  };
  /**
   * Delete the supplied node if it's guid matches the selected one.
   * @param {*} node
   */
  const deleteIfSelected = (node) => {
    if (node.systemAttributes.guid === selectedNodeGuid) {
      const guid = selectedNodeGuid;
      const url = nodeType.url + "/" + guid;
      issueRestDelete(url, onSuccessfulDelete, onErrorDelete);
    }
  };

  const onSuccessfulDelete = () => {
    setSelectedNodeGuid(undefined);
    if (pageNumber === 1) {
      // we are already on the first page so just refresh that content
      processUserCriteriaAndIssueSearch();
    } else {
      // we are not on the first page, so set the page number to 1. Or we could end up showing an empty page with no pagination widget.
      setPageNumber(1);
    }
  };

  const onErrorDelete = (msg) => {
    console.log("Error on delete " + msg);
    setErrorMsg(msg);
  };

  const onSuccessfulSearch = (json) => {
    setErrorMsg("");
    console.log("onSuccessfulSearch " + json.result);

    json.result.map(function (row) {
      row.id = row.systemAttributes.guid;
      return row;
    });
    refreshNodes(json.result, pageSize, pageNumber);
    // setCompleteResults(json.result);
  };

  const onErrorSearch = (msg) => {
    console.log("Error on search " + msg);
    setErrorMsg(msg);
    setNodes([]);
  };

  const onClickExactMatch = () => {
    console.log("onClickExactMatch");
    const checkBox = document.getElementById("node_nav_exact_Match");
    let queryParams = {};
    queryParams.exactMatch = checkBox.checked;
    updateQueryParams(queryParams);
  };

  function getNodeChildrenUrl() {
    return match.path + "/" + selectedNodeGuid + "/children";
  }
  /**
   * The function returns another function; this is required by react Link. The below syntax is required to be able to handle the parameter.
   * Not working ...
   */
  const getNodeChildrenUrlUsingGuid = (guid) => () => {
    return `${match.path}/${guid}/children`;
  };

  const onToggleCard = () => {
    console.log("onToggleCard");
    if (isCardView) {
      setIsCardView(false);
    } else {
      setIsCardView(true);
    }
  };
  function getAddNodeUrl() {
    // return match.path + "/add-" + nodeTypeName;
    return match.path + "?action=CREATE";
  }
  function getGlossaryQuickTermsUrl() {
    return match.path + "/" + selectedNodeGuid + "/quick-terms";
  }
  function getCategoryQuickTermsUrl() {
    return match.path + "/" + selectedNodeGuid + "/quick-category-terms";
  }
  function getEditNodeUrl() {
    return match.path + "/edit-" + nodeTypeName + "/" + selectedNodeGuid;
  }
  const onFilterCriteria = (e) => {
    let value = e.target.value;
    if (value === undefined || value === "") {
      value='.*';
    } 
    let queryParams = {};
    queryParams.searchString = value;

     updateQueryParams(queryParams);
    
    // setFilterCriteria(e.target.value);
  };
  const isSelected = (nodeGuid) => {
    return nodeGuid === selectedNodeGuid;
  };
  const setSelected = (nodeGuid) => {
    setSelectedNodeGuid(nodeGuid);
    if (onSelectCallback) {
      onSelectCallback(nodeGuid);
    }
  };

  return (
    <div>
      <div className="bx--grid">
        <NodeCardSection className="landing-page__r3">
          <article className="node-card__controls bx--col-sm-4 bx--col-md-1 bx--col-lg-1 bx--col-xlg-1 bx--col-max-1">
            Choose {nodeType.key}
          </article>
          <article className="node-card__controls bx--col-sm-4 bx--col-md-2 bx--col-lg-4 bx--col-xlg-4 bx--col-max-4">
            <input
              type="text"
              id="filter-input"
              onChange={onFilterCriteria}
              value={filterCriteria}
              placeholder="Filter"
            />
          </article>
          <article className="node-card__controls bx--col-sm-4 bx--col-md-1 bx--col-lg-2 bx--col-xlg-2 bx--col-max-2">
            <div className="node-card__exact_control">
              <label htmlFor="exactMatch">Exact Match </label>
              <input
                type="checkbox"
                id="node_nav_exact_Match"
                onClick={onClickExactMatch}
              />
            </div>
          </article>
          <article className="node-card__controls bx--col-sm-4 bx--col-md-1 bx--col-lg-3 bx--col-xlg-3 bx--col-max-2">
            <div className="bx--row">
              {!onSelectCallback && (
                <Link to={getAddNodeUrl}>
                  <Add32 kind="primary" />
                </Link>
              )}
              {selectedNodeGuid &&
                !onSelectCallback &&
                nodeTypeName === "glossary" && (
                  <Link to={getGlossaryQuickTermsUrl}>
                    <Term32 kind="primary" />
                  </Link>
                )}
              {selectedNodeGuid &&
                !onSelectCallback &&
                nodeTypeName === "category" && (
                  <Link to={getCategoryQuickTermsUrl}>
                    <Term32 kind="primary" />
                  </Link>
                )}
              {selectedNodeGuid &&
                !onSelectCallback &&
                nodeTypeName !== "term" && (
                  <Link to={getNodeChildrenUrl}>
                    <ParentChild32 kind="primary" />
                  </Link>
                )}
              {selectedNodeGuid && !onSelectCallback && (
                <Link to={getEditNodeUrl()}>
                  <Edit32 kind="primary" />
                </Link>
              )}
              {selectedNodeGuid && !onSelectCallback && (
                <Delete32 onClick={() => onClickDelete()} />
              )}
            </div>
          </article>
        </NodeCardSection>

        <NodeCardSection className="landing-page__r3">
          <article style={{ color: "red" }}>{errorMsg}</article>
        </NodeCardSection>
        <NodeCardSection className="landing-page__r3">
          <Toggle
            aria-label="nodeCardTableToggle"
            defaultToggled
            labelA="Table View"
            labelB="Card View"
            id="node-cardtable-toggle"
            onToggle={onToggleCard}
          />
        </NodeCardSection>
        {isCardView && (
          <NodeCardSection className="landing-page__r3">
            {nodes.map((node) => (
              <LocalNodeCard
                key={node.systemAttributes.guid}
                heading={node.name}
                guid={node.systemAttributes.guid}
                body={node.description}
                icon={<GlossaryImage />}
                isSelected={isSelected(node.systemAttributes.guid)}
                setSelected={setSelected}
                link={getNodeChildrenUrlUsingGuid(node.systemAttributes.guid)}
              />
            ))}
          </NodeCardSection>
        )}
        {!isCardView && (
          <NodeTableView
            // tableKey={getNextTableKey()}
            nodeType={nodeType}
            nodes={nodes}
            setSelected={setSelected}
          />
        )}
        {nodes.length === 0 && <div>No {nodeType.plural} found!</div>}
        <div className="search-item">
          <Pagination {...paginationProps()} />
        </div>
      </div>
    </div>
  );
}
