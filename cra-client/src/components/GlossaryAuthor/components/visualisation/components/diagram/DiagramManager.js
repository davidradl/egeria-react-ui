/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

import React, { useContext, useState, useEffect, useCallback }    from "react";

import PropTypes                          from "prop-types";

import Diagram                            from "./Diagram";

import { InstancesContext }               from "../../contexts/InstancesContext";



export default function DiagramManager(props) {


  let height = props.height;
  let width = props.width;


  /*
   * Access instancesContext to get access to gens
   */
  const instancesContext = useContext(InstancesContext);

  /*
   * nodeArray is stateful contiguous array of nodes - which resemble node digests.
   * linkArray is a stateful contiguous array of links - which resemble Relationship.
   * A contiguous arays are needed for D3 to databind.
   * nodeArray and linkArray are updated when the gens change - this re-renders DiagramManager and 
   * it picks up the change in gens - see below. It's important that nodeArray and linkArray are updated 
   * to reflect gens in this component because it is then possible for Diagram (a child cpt) to depend 
   * on nodeArray and linkArray and to be re-rendered when they change - it the child were to depend on 
   * gens (as a property) and do the gen parsing and update of nodeArray or linkArray itself it does not 
   * get re-rendered.
   */
  const [nodeArray, setNodeArray] = useState( [] );
  const [linkArray, setLinkArray] = useState( [] );

  /*
   * allNodes is a map from guid to node - it provides an index for fast retrieval of a node based on 
   * the id (guid) found in the links.
   */
  const [allNodes, setAllNodes]   = useState( {} );

  /*
   * lastGenProcessed allows DiagramManager to record the last gen it processed. This is used in the 
   * detection of changes to gens that need to be processed into nodeArray and linArray.
   */
  const [lastGenProcessed, setLastGenProcessed] = useState(0);

  
 

  /*
   * The parseGen function accepts a gen and creates the associated nodes and links
   * based on the nodes and relationships in the gen. 
   */
  const parseGen = useCallback(
    (gen) => {

    /*
     * Parse nodes
     */
  
    /*
     * Corral new nodes into local array variable for atomic update of nodeArray.
     */
    let newNodesArray = Object.assign([],nodeArray);  

    /*
     * Corral new nodes into local map for atomic update of allNodes.
     */
    let newNodesMap   = Object.assign({},allNodes);   

    /*
     * Retrieve the node digests from the gen 
     */
    const entsMap = gen.nodes;

    Object.keys(entsMap).forEach(k => {
     
      const node = gen.nodes[k];  

      var newNode = {};
      console.log("node !!! " + JSON.stringify(node));
      newNode.id                     = node.nodeGUID;
      newNode.category               = node.nodeType;
      newNode.label                  = node.name;   
      newNode.gen                    = node.gen;
      /*
       * Initialise position to null so that node is given appropriate starting posiiton 
       * by the diagram
       */            
      newNode.x                      = null;
      newNode.y                      = null;

     
      newNodesArray.push(newNode);     
      newNodesMap[newNode.id] = newNode;     
    });      
   

    /*
     *  Update the states of nodeArray and allNodes ...
     */
    setNodeArray(newNodesArray);
    setAllNodes(newNodesMap);  


    /*
     * Parse relationships
     */
    


    /* 
     * Corral new nodes into local array variable for atomic update of nodeArray.
     */
    let newLinksArray = Object.assign([],linkArray);  

  
    /*
     * Retrieve the relationship digests from the gen
     */
    const relsMap = gen.relationships;
    Object.keys(relsMap).forEach(k => {
      /*
       * gen.relationships is the map of relationships - pull out the relationshipGUID from the relationship.
       */
      const relationship = gen.relationships[k];  

      var newLink = {};
      newLink.id                     = relationship.relationshipGUID;
      newLink.label                  = relationship.label;
      /*
       * Need to get each node from its GUID...it must already be in the gens but you would need to 
       * ask InstancesContext to map the guid to the gen and then again to look up the guid in that gen
       * OR you perform parseNodes and parseRelationships together and look in newNodesMap.
       * If the node is in this latest gen (quite likely given exploration) the asynchronous state
       * update to allNodes - performed when parsing nodes (above) - will not have happened yet.
       */
      console.log("relationship " + JSON.stringify(relationship));
      newLink.source                 = newNodesMap[relationship.end1GUID];  
      newLink.target                 = newNodesMap[relationship.end2GUID];
      newLink.gen                    = relationship.gen;

      /*
       * Look through existing links (newlinksArray) to find multi-edges and set idx accordingly
       */
      var count = 0;
      newLinksArray.forEach(link => {
        if (link.source === newLink.source && link.target === newLink.target) {
          count = count+1;
        }
      });
      newLink.idx                    = count;
    
      
      newLinksArray.push(newLink);     
       
    });      
  
    /*
     *  Update the state of linkArray ...
     */
    setLinkArray(newLinksArray);
    
  },
  [nodeArray, setNodeArray, allNodes, setAllNodes, linkArray, setLinkArray]
  );




  /*
   * The removeGen function accepts a genId and removes the associated nodes and links
   * based on the nodes and relationships in that gen. It does not have the gen available
   * as it has already been deleted (unavoidable with React state management). If rescanning 
   * proves to be a performance problem, consider maintaining a gen-keyed map to use as an 
   * index.
   */
  const removeGen = useCallback(
    (genId) => {

    /*
     * Remove Nodes
     */
  
    /*
     * Corral new nodes into local array variable for atomic update of nodeArray.
     */
    let newNodesArray = [];  

    /*
     * Corral new nodes into local map for atomic update of allNodes.
     */
    let newNodesMap   = Object.assign({},allNodes);   

    /*
     * Strip out any node that is from the gen with id genId 
     */   
    if (nodeArray !== null && nodeArray.length > 0) {    
      for (let i=0; i<nodeArray.length; i++) {
        if (nodeArray[i].gen === genId) {   
          /*
           * Remove node from allNodes map and don't add it to the newNodesArray
           */
          let guid = nodeArray[i].id;  
          delete newNodesMap[guid];              
        }
        else {
          /*
           * Add this node to the newNodesArray and leave it in the map
           */   
          newNodesArray.push(nodeArray[i]);   
        }
      }                   
      /*
       *  Update the states of nodeArray and allNodes ...
       */
      setNodeArray(newNodesArray);
      setAllNodes(newNodesMap);  
    }


    /*
     * Remove relationships
     */
    
    /*
     * Corral new nodes into local array variable for atomic update of nodeArray.
     */
    let newLinksArray = [];
    
    /*
     * Strip out any link that is from the gen with id genId
     */
    if (linkArray !== null && linkArray.length > 0) {    
      for (let i=0; i<linkArray.length; i++) {
        if (linkArray[i].gen !== genId) {             
          /* 
           * Add this link to the new array
           */         
          newLinksArray.push(linkArray[i]);
        }
      } 
          
      /*
       *  Update the state of linkArray ...
       */
      setLinkArray(newLinksArray);
    }
    
  },
  [nodeArray, setNodeArray, allNodes, setAllNodes, linkArray, setLinkArray]
  );



  const clearGraph = useCallback(
    () => {

    /*
     * Clear Nodes
     */

    if (nodeArray.length > 0) {
  
      /*
       * Prepare to empty nodeArray
       */
      let newNodesArray = [];

      /* 
       * Prepare to empty allNodes
       */
      let newNodesMap   = {}; 

      /*
       * Update the states of nodeArray and allNodes ...
       */
      setNodeArray(newNodesArray);
      setAllNodes(newNodesMap);  

      /*
       * Clear relationships
       */
  
      if (linkArray.length > 0) {
        /*
         * Prepare to empty linkArray
         */
        let newLinksArray = [];     
      
        /*
         * Update the state of linkArray ...   
         */
        setLinkArray(newLinksArray);
      }
    }
  },
  [nodeArray, setNodeArray, linkArray, setLinkArray]
  );

 

  /*
   * Request that the InstancesContext loads the node from the view server and give it the focus.
   */
  const onNodeClick = useCallback(

    (guid) => {
      instancesContext.changeFocusNode(guid);
    },
    [instancesContext]
  );


  /*
   * Request that the InstancesContext loads the relationship from the view server and give it the focus.
   */
  const onLinkClick = useCallback(

    (guid) => {
      instancesContext.changeFocusRelationship(guid);
    },
    [instancesContext]
  );


  /*
   * When gens has changed - update the nodeArray and linkArray
   * Request the latestActiveGenId from InstancesContext and perform a numeric comparison to assess whether 
   * a new gen has been added since this component was last rendered. If so, request the latest gen
   * and parse it into the nodes and links arrays.
   */

  useEffect(
    () => {

      const latestActiveGenId = instancesContext.getLatestActiveGenId();

      if (latestActiveGenId > lastGenProcessed) {
        /* Additional gen */
        /* Get the last gen and add it to the nodes array and allNodes map. */
        parseGen(instancesContext.getLatestGen());
        setLastGenProcessed(latestActiveGenId);
      }
      else if (latestActiveGenId < lastGenProcessed) {
        if (latestActiveGenId === 0) {
          /* Graph has been cleared */
          clearGraph();
          setLastGenProcessed(latestActiveGenId);
          // instancesContext.changeFocusNode(guid);
        }
        else {
          /*
           * Graph has been reduced - by an undo operation that has remove the most recent gen
           */
          removeGen(latestActiveGenId+1);
          setLastGenProcessed(latestActiveGenId);

        }
      }

    },
    [instancesContext, lastGenProcessed, parseGen, removeGen, clearGraph]
  )


  return (
    <div>
      <Diagram nodes={nodeArray} 
               links={linkArray} 
               numGens={instancesContext.getLatestActiveGenId()}
               onNodeClick={onNodeClick} 
               onLinkClick={onLinkClick}
               outerHeight={height}
               outerWidth={width}
               />
    </div>     
  );

}


DiagramManager.propTypes = {
  children: PropTypes.node,
  height   : PropTypes.number,
  width    : PropTypes.number
};
