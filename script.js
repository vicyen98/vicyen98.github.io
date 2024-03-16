// Import libraries
import { X } from "./conversion.js";
import { M } from "./math.js";
import { CON } from "./constraints.js";
import { NOTE } from "./note.js";
import * as THREE from 'three';
import { TrackballControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/TrackballControls.js';

// Global Variables
let PI = 3.141592653589793238462643383279502884197;
const targetAssignments = ["V", "M"];
let FV = [];
let FC = [];
let userSelectedDegree4Node = null;
let userSelectedDegree4VV = null;
let userInputFoldingAngle = 0; // For future use
let initialVerticesCoords = [];
const radius = 10;
const wordSizeSVG = 12;

const ins = [
  {id: "r", x: 30, y: 230, min: 1, max: 999, step: 1, val: 500},
];

// Functions

const scalePointsToUnitRange = (points) => {
  // Find the minimum and maximum values for x, y, and z coordinates
  let min_x = Infinity, min_y = Infinity, min_z = Infinity;
  let max_x = -Infinity, max_y = -Infinity, max_z = -Infinity;
  let hasX = false; // Flag to check if any x-coordinate is non-zero
  let hasY = false; // Flag to check if any y-coordinate is non-zero
  let hasZ = false; // Flag to check if any z-coordinate is non-zero
  
  for (let i = 0; i < points.length; i++) {
      let point = points[i];
      min_x = Math.min(min_x, point[0]);
      min_y = Math.min(min_y, point[1]);
      min_z = Math.min(min_z, point[2]);
      max_x = Math.max(max_x, point[0]);
      max_y = Math.max(max_y, point[1]);
      max_z = Math.max(max_z, point[2]);
      if (point[0] !== 0) {
        hasX = true;
      }
      if (point[1] !== 0) {
        hasY = true;
      }
      if (point[2] !== 0) {
          hasZ = true;
      }
  }
  
  // Calculate the range for each dimension (x, y, z)
  let range_x = hasX ? (max_x - min_x) : 1;
  let range_y = hasY ? (max_y - min_y) : 1;
  let range_z = hasZ ? (max_z - min_z) : 1; // To avoid division by zero if all z-coordinates are zero

  // Determine the scaling factor for each dimension to fit within the range [0, 1]
  let scaling_factor_x = 1 / range_x;
  let scaling_factor_y = 1 / range_y;
  let scaling_factor_z = 1 / range_z;

  // Scale each coordinate using the scaling factors
  let scaled_points = [];
  for (let i = 0; i < points.length; i++) {
      let point = points[i];
      let scaled_x = hasX ? ((point[0] - min_x) * scaling_factor_x) : 0;
      let scaled_y = hasY ? ((point[1] - min_y) * scaling_factor_y) : 0;
      let scaled_z = hasZ ? ((point[2] - min_z) * scaling_factor_z) : 0; // Preserve z-coordinate if present
      scaled_points.push([scaled_x, scaled_y, scaled_z]);
  }

  // Find the maximum range 
  let coordinateRange = [range_x, range_y, range_z];
  let maxRange = - Infinity;
  for (let i = 0; i < coordinateRange.length; i++){
    maxRange = Math.max(maxRange, coordinateRange[i]);
  }
  let maxAxis = coordinateRange.indexOf(maxRange);

  // rescale to retain the shape
  let scaled_points2 = [];
  if(maxAxis === 0){
    console.log(`maxAxis = ${maxAxis}`);
    for (let i = 0; i < scaled_points.length; i++){
      let point2 = scaled_points[i];
      let scaled_y2 = point2[1] * range_y / range_x;
      let scaled_z2 = point2[2] * range_z / range_x;
      scaled_points2.push([point2[0], scaled_y2, scaled_z2]);
    }
  } else if (maxAxis === 1){
    console.log(`maxAxis = ${maxAxis}`);
    for (let i = 0; i < scaled_points.length; i++){
      let point2 = scaled_points[i];
      let scaled_x2 = point2[0] * range_x / range_y;
      let scaled_z2 = point2[2] * range_z / range_y;
      scaled_points2.push([scaled_x2, point2[1], scaled_z2]);
    }
  } else if (maxAxis === 2){
    console.log(`maxAxis = ${maxAxis}`);
    for (let i = 0; i < scaled_points.length; i++){
      let point2 = scaled_points[i];
      let scaled_x2 = point2[0] * range_x / range_z;
      let scaled_y2 = point2[1] * range_y / range_z;
      scaled_points2.push([scaled_x2, scaled_y2, point2[2]]);
    }
  }

  return scaled_points2;
};

const input_validation = (example) => {

  // javascript Program to detect cycle in an undirected graph

  // This class represents a undirected
  // graph using adjacency list representation

  class Graph{

      constructor(vertices){
           
          // No. of vertices
          this.V = vertices;
           
          // Default dictionary to store graph
          this.graph = new Array(vertices);
          for(let i = 0; i < vertices; i++){
              this.graph[i] = new Array();
          }
      }
   
      // Function to add an edge to graph
      addEdge(v, w){
           
          // Add w to v_s list
          this.graph[v].push(w);
   
          // Add v to w_s list
          this.graph[w].push(v);      
      }

      // A recursive function that uses
      // visited[] and parent to detect
      // cycle in subgraph reachable from vertex v.
      isCyclicUtil(v, visited, parent){
    
          // Mark the current node as visited
          visited[v] = true;
   
          // Recur for all the vertices
          // adjacent to this vertex
          for(let i = 0; i < this.graph[v].length; i++){
   
              // If the node is not
              // visited then recurse on it
              if(visited[this.graph[v][i]] == false){
                  if(this.isCyclicUtil(this.graph[v][i], visited, v) == true){
                      return true;
                  }
              }
              // If an adjacent vertex is
              // visited and not parent
              // of current vertex,
              // then there is a cycle
              else if(parent != this.graph[v][i]){
                  return true;
              }
          }
          return false;
      }
   
   
   
      // Returns true if the graph
      // contains a cycle, else false.
      isCyclic(){
   
          // Mark all the vertices
          // as not visited
          let visited = new Array(this.V).fill(false);
   
          // Call the recursive helper
          // function to detect cycle in different
          // DFS trees
          for(let i = 0; i < this.V; i++){
              // Don't recur for u if it
              // is already visited
              if(visited[i] == false){
                  if(this.isCyclicUtil(i, visited, -1) == true){
                      return true;
                  }
              }
                   
          }
   
          return false;
      }
   
  }

  
  
  const filterEdgesByAssignment = (edgesVertices, edgesAssignment, targetAssignments) => {
      if (edgesVertices.length !== edgesAssignment.length) {
        throw new Error("Input arrays must have the same length");
      }
      const edges = edgesVertices.map((vertices, index) => ({ vertices, assignment: edgesAssignment[index] }));
      const filteredEdges = edges.filter(edge => targetAssignments.includes(edge.assignment));
      const filteredVertices = filteredEdges.map(edge => edge.vertices);
      return filteredVertices;
    };

  const extractNodes = (edgesArray) => {
      // Use a Set to store unique nodes
      const uniqueNodesSet = new Set();
      
      // Iterate through each edge and add its nodes to the set
      edgesArray.forEach((edge) => {
          uniqueNodesSet.add(edge[0]);
          uniqueNodesSet.add(edge[1]);
      });
      
      // Convert the set back to an array and return
      const uniqueNodesArray = Array.from(uniqueNodesSet);
      return uniqueNodesArray;
      };

  const subtractArrays = (array1, array2) => {
      // Use filter to keep elements from array1 that are not in array2
      const resultArray = array1.filter((element) => !array2.includes(element));
      return resultArray;
      };

  const eliminate_border_vertices = (example) => {
      let borderEdges = filterEdgesByAssignment(example.edges_vertices, example.edges_assignment, ["B"]);
      //console.log(borderEdges);
      let borderVertices = extractNodes(borderEdges);
      //console.log(borderVertices);
      let internalVertices = subtractArrays(allVertices, borderVertices);
      //console.log(internalVertices);
      let internalEdges = filterEdgesByAssignment(example.edges_vertices, example.edges_assignment, ["U", "V", "M", "F"]);
      // console.log(internalEdges);
      return [internalEdges, internalVertices, borderVertices];
  };

  const createNodeAssociatedEdges = (filteredEdgesVertices) => {
      const nodeAssociatedEdges = {};
    
      // Iterate through each edge in the filtered edges
      filteredEdgesVertices.forEach(([node1, node2]) => {
        // Update or create an entry for node1
        if (!nodeAssociatedEdges[node1]) {
          nodeAssociatedEdges[node1] = [];
        }
        nodeAssociatedEdges[node1].push([node1, node2]);
    
        // Update or create an entry for node2
        if (!nodeAssociatedEdges[node2]) {
          nodeAssociatedEdges[node2] = [];
        }
        nodeAssociatedEdges[node2].push([node1, node2]);
      });
    
      return nodeAssociatedEdges;
    };

  const check_non_degree_four_internal_vertices = (internalVertices, nodeAssociatedEdges) => {
      for(let i = 0;i < internalVertices.length; i++){
          //console.log(nodeAssociatedEdges[internalVertices[i]]);
          if(nodeAssociatedEdges[internalVertices[i]].length != 4){
              return true
          }
      }
      return false;
  };

  const check_internal_cycle = (inputArray) => {
      // Create a graph using the provided array
      const verticesCount = inputArray.reduce((max, [v, w]) => Math.max(max, v, w), -1) + 1;
      const graph = new Graph(verticesCount);

      // Add edges to the graph
      inputArray.forEach(([v, w]) => graph.addEdge(v, w));

      // Check if the graph contains a cycle
      if (graph.isCyclic()) {
          console.log("Graph contains an internal cycle");
      } else {
          console.log("Graph doesn't contain an internal cycle");
      }
  };

  let allVertices = [];
  for(let i = 0; i < example.vertices_coords.length; i++){
      allVertices.push(i);
  }
  //console.log(allVertices);

  let internalVertices = [];
  let borderVertices = [];
  let internalEdges = [];
  [internalEdges, internalVertices, borderVertices] = eliminate_border_vertices(example);
  // console.log(internalEdges);
  // console.log(internalVertices);
  // console.log(borderVertices);

  let nodeAssociatedEdges = createNodeAssociatedEdges(example.edges_vertices);
  // console.log(nodeAssociatedEdges);

  if(check_non_degree_four_internal_vertices(internalVertices, nodeAssociatedEdges)){
      console.log("Graph contain a non degree 4 internal vertex");
  }
  else{
      console.log("Graph doesn't contain a non degree 4 internal vertex");
  }
  check_internal_cycle(internalEdges);
};


const storeInitialVerticesCoords = () => {
  for(let i = 0; i < box.vertices_coords.length; i++){
    initialVerticesCoords.push(box.vertices_coords[i]);
  }
};

const resetVerticesCoords = () => {
  box.vertices_coords.length = 0;
  for(let i = 0; i < initialVerticesCoords.length; i++){
    box.vertices_coords.push(initialVerticesCoords[i]);
  }
};

const Y = {
  V_VV_EV_EA_2_VK_VA: (V, VV, EV, EA) => { //VA: Flat foldable degree 4 sector angle
    const VVA_map = new Map();
    for (const [i, [v1, v2]] of EV.entries()) {
        const a = EA[i];
        VVA_map.set(M.encode([v1, v2]), a);
        VVA_map.set(M.encode([v2, v1]), a);
    }
    const VK = [];
    //Maybe make a new function
    //initilize the array here for tracking VA + index
    const VA = [];
    for (const [i, A] of VV.entries()) {
        //console.log([i, A]); //i will be the index
        const adj = [];
        let boundary = false;
        let [count_M, count_V, count_U] = [0, 0, 0];
        for (const j of A) {
            const a = VVA_map.get(M.encode([i, j]));
            if (a == "B") {
                boundary = true;
                break;
            }
            if (a == "V" || a == "M" || a == "U") {
                adj.push(j);
            }
            if (a == "M") { ++count_M; }
            if (a == "V") { ++count_V; }
            if (a == "U") { ++count_U; }
        }
        if (boundary || (adj.length == 0)) {
            VK.push(0);
            VA.push([]);
        } else if (
            ((count_U == 0) && (Math.abs(count_M - count_V) != 2)) ||
            (adj.length % 2 != 0)
        ) {                       // violates Maekawa
            VK.push(1);           // far from zero
            VA.push([]);
        } else {
            const angles = adj.map(j => M.angle(M.sub(V[j], V[i])));
            angles.sort((a, b) => a - b);
            let kawasaki = 0;
            for (let j = 0; j < angles.length; j += 2) {
                kawasaki += angles[j + 1] - angles[j];
            }
            VK.push(Math.abs(kawasaki - Math.PI));
            VA.push(angles);
        }
    }
    return [VK, VA];
  },
  // Write a function to attach sector angle according to VV arrangement
  VA_ESVA: (VA) => {
    let ESVA = [];
    for(let i = 0; i < VA.length; i++){
      if (VA[i].length == 0) {
        ESVA.push(VA[i]);
      }
      else {
        let angles = [];
        for(let j = 0; j < VA[i].length; j++){
          let angle = 0;
          if (j == (VA[i].length - 1)) {
            angle = VA[i][0] + (2*PI) - VA[i][VA[i].length - 1];
            angles.push(angle);
          }
          else {
            angle = VA[i][j + 1] - VA[i][j];
            angles.push(angle);
          }
        }
        ESVA.push(angles);
      } 
    }
    return ESVA;
  }
};

// rotate a point
const calculateUnitVector = ([x1, y1, z1], [x2, y2, z2]) => {
  const length = Math.sqrt((x2 - x1)**2 + (y2 - y1)**2 + (z2 - z1)**2);
  const ux = (x2 - x1) / length;
  const uy = (y2 - y1) / length;
  const uz = (z2 - z1) / length;
  return [ux, uy, uz];
};

const rotateAroundOrigin = ([px, py, pz], [ux, uy, uz], [ox, oy, oz], a) => {
  const [s, c, d] = [Math.sin(a), Math.cos(a), 1 - Math.cos(a)];

  // Translate the point P and the origin of the unit vector to the origin
  const translatedPx = px - ox;
  const translatedPy = py - oy;
  const translatedPz = pz - oz;

  const x = translatedPx * (ux * ux * d + c) + translatedPy * (ux * uy * d - uz * s) + translatedPz * (ux * uz * d + uy * s);
  const y = translatedPx * (uy * ux * d + uz * s) + translatedPy * (uy * uy * d + c) + translatedPz * (uy * uz * d - ux * s);
  const z = translatedPx * (uz * ux * d - uy * s) + translatedPy * (uz * uy * d + ux * s) + translatedPz * (uz * uz * d + c);

  // Translate the result back to the original position
  const rotatedX = x + ox;
  const rotatedY = y + oy;
  const rotatedZ = z + oz;

  return [rotatedX, rotatedY, rotatedZ];
}; 

const rotatePointAroundAxis = (axisA, pointB, a) => {
  // Extracting coordinates from axisA and pointB
  const [x1, y1, z1] = axisA[0];
  const [x2, y2, z2] = axisA[1];
  const [x3, y3, z3] = pointB;
  const [ux, uy, uz] = calculateUnitVector([x1, y1, z1],[x2, y2, z2]);
  const [x, y, z] = rotateAroundOrigin([x3, y3, z3], [ux, uy, uz], [x1, y1, z1], a);
  return [x, y, z];
};

const convertToDictionary = (inputArray) => {
  return inputArray.reduce((dictionary, array, index) => {
    dictionary[index] = array;
    return dictionary;
  }, {});
};

const getKeysArray = (inputObject) => Object.keys(inputObject);

const filterDegreeFourVV = (VV, degreeFourVertices) => {
  const degreeFourVV = Object.fromEntries(
    Object.entries(VV).filter(([key]) => degreeFourVertices.hasOwnProperty(key))
  );

  return degreeFourVV;
};

const addZCoordinateTo2DFoldFileVerticesCoords = (verticesCoords) => {
  let processedVerticesCoords = verticesCoords;
  for(let i = 0; i < processedVerticesCoords.length; i++){
      if(processedVerticesCoords[i].length < 3){
          processedVerticesCoords[i].push(0);
      }
  }
  console.log("processedVerticesCoordsWithZCoordinates");
  console.log(processedVerticesCoords);
  return processedVerticesCoords;
};

const substituteIndexes = (coordinates, indexArray) => {
    return indexArray.map(indices => indices.map(index => coordinates[index]));
  };

const generateSurfaceColors = (numSurfaces) => {
  const getRandomHex = () => Math.floor(Math.random() * 256);
  const colors = [];
  for (let i = 0; i < numSurfaces; i++) {
      let color = (getRandomHex() << 16) | (getRandomHex() << 8) | getRandomHex();
      while ( // Ensure the color is different from the previous one
          i > 0 &&
          color === colors[i - 1]
      ) {
          color = (getRandomHex() << 16) | (getRandomHex() << 8) | getRandomHex();
      }
      colors.push(color);
  }
  return colors;
};

const setup = () =>{
  ins[0].val = 500;
  const canvasContainer = document.getElementById("canvas-container");
  while(canvasContainer.firstChild){
    canvasContainer.removeChild(canvasContainer.firstChild);
  }
  const inputPanel = document.getElementById("input-panel");
  while(inputPanel.children[1]){
    inputPanel.removeChild(inputPanel.children[1]);
  }

  const changeOfDegree4Nodes = (dictionaryVV, newUserSelectedDegree4Node) => {
    const vVToInitialize = document.getElementById('selectedDegree4VV');
    while(vVToInitialize.options.length > 0){vVToInitialize.remove(0);}
    console.log(`dictionaryVV of ${newUserSelectedDegree4Node}: ${dictionaryVV[newUserSelectedDegree4Node]}`);
    for(let i = 0; i < dictionaryVV[newUserSelectedDegree4Node].length; i++){
      const vVToInitializeOption = document.createElement('option');
      vVToInitializeOption.text = dictionaryVV[newUserSelectedDegree4Node][i] + '';
      vVToInitialize.add(vVToInitializeOption);
    }
    userSelectedDegree4VV = dictionaryVV[newUserSelectedDegree4Node][0];
    userSelectedDegree4Node = newUserSelectedDegree4Node;
    console.log(`New user input node is ${userSelectedDegree4Node}`);
    console.log(`New user input vv is ${userSelectedDegree4VV}`);
    //setup();
    update();
  };

  const changeOfDegree4VV = (newUserSelectedDegree4VV) => {
    userSelectedDegree4VV = newUserSelectedDegree4VV;
    console.log(`New user input vv is ${userSelectedDegree4VV}`);
    update();
  };
  
  box.vertices_coords = addZCoordinateTo2DFoldFileVerticesCoords(box.vertices_coords);
  // Rescale to unit vector
  box.vertices_coords = scalePointsToUnitRange(box.vertices_coords);
  console.log("rescaledToUnitVerticesCoords:")
  console.log(box.vertices_coords);

  storeInitialVerticesCoords();
  canvasContainer.style.margin = 0;
  canvasContainer.style.padding = 0;
  const [w, h] = [window.innerWidth, window.innerHeight];
  const scene = new THREE.Scene();
  const s = 3;
  const camera = new THREE.OrthographicCamera(-s, s, s*h/w, -s*h/w, 0, 2*s);
  camera.position.z = s;
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(w, h);
  renderer.setClearColor(0xf0f0f0);
  canvasContainer.appendChild(renderer.domElement);

  let mouse = undefined;
  let change = undefined;
  
  FC = generateSurfaceColors(box.faces_vertices.length);
  FC[0] = 0xff0000; FC[1] = 0x00ff00; FC[2] = 0xff00ff; FC[3] = 0x00ffff; 
  console.log("FV:")
  console.log(FV);
  console.log("FC:");
  console.log(FC);

  //Finding Flat Degree Vertices
  let filteredEdgesVertices = filterEdgesByAssignment(box.edges_vertices, box.edges_assignment, targetAssignments);
  console.log("filteredEdgesVertices:");
  console.log(filteredEdgesVertices);
  let nodeAssociatedEdges = createNodeAssociatedEdges(filteredEdgesVertices);
  console.log("nodeAssociatedEdges:");
  console.log(nodeAssociatedEdges);
  let xDegreeVertex = 4;
  let xDegreeNodeAssociatedEdges = filterNodeAssociatedEdgesByDegree(nodeAssociatedEdges, xDegreeVertex);
  console.log("Degree 4 Vertices:");
  console.log(xDegreeNodeAssociatedEdges);

  let VV = [];
  let FV2 = [];
  [VV, FV2] = X.V_EV_2_VV_FV(box.vertices_coords, box.edges_vertices);
  console.log("VV");
  console.log(VV);
  console.log("FV2");
  console.log(FV2);

  let Vf = [];
  let Ff = [];
  [Vf, Ff] = X.V_FV_EV_EA_2_Vf_Ff(box.vertices_coords, box.faces_vertices, box.edges_vertices, box.edges_assignment);
  console.log("Vf");
  console.log(Vf);
  console.log("Ff");
  console.log(Ff);

  let [EF, FE] = [[], []];
  [EF, FE] = X.EV_FV_2_EF_FE(box.edges_vertices, box.faces_vertices);
  console.log("EF");
  console.log(EF);
  console.log("FE");
  console.log(FE);

  let [VK, VA] = [[],[]];
  [VK, VA] = Y.V_VV_EV_EA_2_VK_VA(box.vertices_coords, VV, box.edges_vertices, box.edges_assignment);
  console.log("VK");
  console.log(VK);
  console.log("VA");
  console.log(VA);

  let ESVA = [];
  ESVA = Y.VA_ESVA(VA);
  console.log("ESVA");
  console.log(ESVA);

  let dictionaryVV = {};
  dictionaryVV = convertToDictionary(VV);
  console.log("dictionaryVV");
  console.log(dictionaryVV);
  let degreeFourVV = {};
  degreeFourVV = filterDegreeFourVV(VV, xDegreeNodeAssociatedEdges);
  console.log("degreeFourVV");
  console.log(degreeFourVV);

  // Add that two drop down button here

  //Drop Down Button (Degree 4 Vertices)
  let degree4Vertices = getKeysArray(degreeFourVV);
  console.log(`Degree 4 Vertices Array: ${degree4Vertices}`);
  const selectedDegree4Node = document.createElement('select');
  selectedDegree4Node.className = 'selectedDegree4Node';
  selectedDegree4Node.id = 'selectedDegree4Node';
  selectedDegree4Node.style.background = 'white';
  document.getElementById("input-panel").appendChild(selectedDegree4Node);
  selectedDegree4Node.style.position = 'absolute';
  selectedDegree4Node.style.width = '50px';
  selectedDegree4Node.style.height = '30px';
  selectedDegree4Node.style.left = '210px';
  selectedDegree4Node.style.top = '125px';
  for(let i = 0; i < degree4Vertices.length; i++){
      const selectedDegree4NodeOption = document.createElement('option');
      selectedDegree4NodeOption.text = degree4Vertices[i] + '';
      selectedDegree4Node.add(selectedDegree4NodeOption);
  }

  //Drop Down Button (Degree 4 VV)
  userSelectedDegree4Node = Number(selectedDegree4Node.value);
  const selectedDegree4VV = document.createElement('select');
  selectedDegree4VV.className = 'selectedDegree4VV';
  selectedDegree4VV.id = 'selectedDegree4VV';
  selectedDegree4VV.style.background = 'white';
  document.getElementById("input-panel").appendChild(selectedDegree4VV);
  selectedDegree4VV.style.position = 'absolute';
  selectedDegree4VV.style.width = '50px';
  selectedDegree4VV.style.height = '30px';
  selectedDegree4VV.style.left = '210px';
  selectedDegree4VV.style.top = '160px';
  for(let i = 0; i < dictionaryVV[userSelectedDegree4Node].length; i++){
      const selectedDegree4VVOption = document.createElement('option');
      selectedDegree4VVOption.text = dictionaryVV[userSelectedDegree4Node][i] + '';
      selectedDegree4VV.add(selectedDegree4VVOption);
  }
  userSelectedDegree4VV = Number(selectedDegree4VV.value);
  selectedDegree4Node.addEventListener("change", function(){changeOfDegree4Nodes(dictionaryVV, Number(selectedDegree4Node.value))});
  selectedDegree4VV.addEventListener("change", function(){changeOfDegree4VV(Number(selectedDegree4VV.value))});
  

  const findEdgeAssignment = (node1, node2, edgesVertices, edgesAssignment) => {
    for (let i = 0; i < edgesVertices.length; i++) {
      const [vertex1, vertex2] = edgesVertices[i];
  
      // Check if the edge is formed by the given nodes (order doesn't matter)
      if ((vertex1 === node1 && vertex2 === node2) || (vertex1 === node2 && vertex2 === node1)) {
        return edgesAssignment[i]; // Return the edge assignment
      }
    }
  
    // Return null if the edge is not found
    return null;
  };


  const rearrangeInputSectorAnglesArrayForFolding = (selectedEdges) => {
    console.log("inputSelectedEdges")
    console.log(selectedEdges);
    let selectedNode = selectedEdges[0];
    let inputEdgeNode = selectedEdges[1];
    
    let defaultDegreeFourVV = [];
    let defaultSectorAngles = [];
    // Import ESVA according to selectedNode
    defaultDegreeFourVV = VV[selectedNode];
    defaultSectorAngles = ESVA[selectedNode];
    console.log('selectedNode');
    console.log(selectedNode);
    console.log('inputEdgeNode');
    console.log(inputEdgeNode);
    console.log('defaultDegreeFourVV');
    console.log(defaultDegreeFourVV);
    console.log('defaultSectorAngles');
    console.log(defaultSectorAngles);
    
    // Write a while loop
    // Import original VV according to selectedNode
    let arrangedDegreeFourVV = [];
    // arrange the placement of the VV index according to arrangedSectorAngles
    let arrangedSectorAngles = [];
    // Import edges_assignment according to arrangedDegreeFourVV
    let arrangedVVEdgesAssignment = [];

    // Shift the angle associated to input edge to first index (index 0) so that it could be fit into the folding function
    while(defaultDegreeFourVV[0] != inputEdgeNode){
      const firstElementVV = defaultDegreeFourVV.shift();
      defaultDegreeFourVV.push(firstElementVV);
      const firstElementAngle = defaultSectorAngles.shift();
      defaultSectorAngles.push(firstElementAngle);
    }
    arrangedDegreeFourVV = defaultDegreeFourVV;
    arrangedSectorAngles = defaultSectorAngles;
    for(let i = 0; i < arrangedDegreeFourVV.length; i++){
      arrangedVVEdgesAssignment.push(findEdgeAssignment(selectedNode, arrangedDegreeFourVV[i], box.edges_vertices, box.edges_assignment));
    }
    return [selectedNode, arrangedSectorAngles, arrangedDegreeFourVV, arrangedVVEdgesAssignment];
  };

  const degree4FoldingAngles = (arrangedSectorAngles, arrangedDegreeFourVV, arrangedVVAssignment, foldAngle) => {
    let outputArrangedFoldingAngles = [];
    console.log('AnglesCalculation');
    console.log("inputSectorAnglesArray");
    console.log(arrangedSectorAngles);
    console.log("inputDegreeFourVV");
    console.log(arrangedDegreeFourVV);
    console.log("inputFoldAngle");
    console.log(foldAngle);
    //console.log("inputMajorEdgePair");
    //console.log(majorEdgePair);
    // assume diheralAngle to be 180 at flat settings
    let f1Radian = foldAngle; 
    let f1 = f1Radian;
    console.log(`f1Radian = ${f1}`);
    let [f2, f3, f4] = [null, null, null];
    let [a1, a2, a3, a4] = [arrangedSectorAngles[0], arrangedSectorAngles[1], arrangedSectorAngles[2], arrangedSectorAngles[3]];
    console.log(`a1=${a1}; a2=${a2}; a3=${a3}; a4=${a4}`);
    let [es1, es2, es3, es4] = [arrangedVVAssignment[0], arrangedVVAssignment[1], arrangedVVAssignment[2], arrangedVVAssignment[3]];
    console.log(`es1=${es1}; es2=${es2}; es3=${es3}; es4=${es4}`);
    // Calculating opposite angle a3 (theorem 3 equation 7)
    let f3NA = 2 * Math.atan(Math.sqrt(2 * Math.pow(Math.tan(f1/2), 2) * Math.sin(a4) * Math.sin(a1) / (2 * Math.sin(a2) * Math.sin(a3) + Math.pow(Math.tan(f1/2), 2) * Math.cos(a2 - a3) - Math.pow(Math.tan(f1/2), 2) * Math.cos(a4 - a1))));
    console.log(`f3Radian before assignment = ${f3NA}`);
    // Deciding the sign based on edges_assignment
    if(f1 >= 0){
      if(es1 === es3){
        f3 = Math.abs(f3NA);
      } else {
        f3 = -Math.abs(f3NA);
      }
    } else if (f1 < 0){
      if(es1 === es3){
        f3 = -Math.abs(f3NA);
      } else {
        f3 = Math.abs(f3NA);
      }
    }
    console.log(`f3Radian after assignment = ${f3}`);
    // Calculate f2 (ask prof on monday?/: the different sign problem) [sub f3 or f3NA for i+1?] //assume different sign is included
    let f2NA = 2 * Math.atan(Math.sin(a3 + a4) * Math.tan(f1/2) * Math.tan(f3/2) / (Math.tan(f3/2) * Math.sin(a2) + Math.tan(f1/2) * Math.sin(a1)));
    console.log(`f2Radian before assignment = ${f2NA}`);
    if(f1 >= 0){
      if(es1 === es2){
        f2 = Math.abs(f2NA);
      } else {
        f2 = -Math.abs(f2NA);
      }
    } else if (f1 < 0){
      if(es1 === es2){
        f2 = -Math.abs(f2NA);
      } else {
        f2 = Math.abs(f2NA);
      }
    }
    console.log(`f2Radian after assignment = ${f2}`);
    // Calculate f4
    let f4NA = 2 * Math.atan(Math.sqrt(2 * Math.pow(Math.tan(f2/2), 2) * Math.sin(a1) * Math.sin(a2) / (2 * Math.sin(a3) * Math.sin(a4) + Math.pow(Math.tan(f2/2), 2) * Math.cos(a3 - a4) - Math.pow(Math.tan(f2/2), 2) * Math.cos(a1 - a2))));
    console.log(`f4Radian before assignment = ${f4NA}`);
    if(f1 >= 0){
      if(es1 === es4){
        f4 = Math.abs(f4NA);
      } else {
        f4 = -Math.abs(f4NA);
      }
    } else if (f1 < 0){
      if(es1 === es4){
        f4 = -Math.abs(f4NA);
      } else {
        f4 = Math.abs(f4NA);
      }
    }
    console.log(`f4Radian after assignment = ${f4}`);
    outputArrangedFoldingAngles = [f1, f2, f3, f4];
    console.log('outputArrangedFoldingAngles');
    console.log(outputArrangedFoldingAngles);
    return outputArrangedFoldingAngles;
  };

  const findFaceByVertices = (v1, v2, v3, facesVertices) => {
    for (let i = 0; i < facesVertices.length; i++) {
        const face = facesVertices[i];
        if (face.includes(v1) && face.includes(v2) && face.includes(v3)) {
            return face;
        }
    }
    // If no matching face is found
    return null;
  };

  const findFacesVerticesByVertices = (arrangedVV, selectedNode, facesVertices) => {
    console.log(arrangedVV);
    console.log(selectedNode)
    let arrangedFVArray = [];
    for(let i = 0; i < arrangedVV.length - 1; i++){
      arrangedFVArray.push(findFaceByVertices(selectedNode, arrangedVV[i], arrangedVV[i+1],facesVertices));
    }
    arrangedFVArray.push(findFaceByVertices(selectedNode, arrangedVV[0], arrangedVV[3], facesVertices));
    console.log("arrangedFVArray");
    console.log(arrangedFVArray);
    return arrangedFVArray;
  };

  const fold = (selectedNode, arrangedDegreeFourVV, arrangedFVArray, outputArrangedFoldingAngles) => {
    // Actual folding action via changing vertices_coords
    console.log(`Node ${selectedNode} folding in progress...`);
    const uniqueNodes = (inputArray) => [...new Set(inputArray.flat())];
    let allNode = uniqueNodes(arrangedFVArray);
    console.log(`allNode = ${allNode}`);
    let unprocessedNode = [];
    let rotatingFace = [];
    for(let i = 0; i < allNode.length; i++){
      unprocessedNode.push(allNode[i]);
    }
    console.log(`Initial unprocessedNode: ${unprocessedNode}`)
    unprocessedNode = unprocessedNode.filter(item => !arrangedFVArray[3].includes(item));

    // Folding according to current degree 4 node
    for(let i = 0; i < arrangedDegreeFourVV.length; i++){
      rotatingFace = arrangedFVArray[i];
      unprocessedNode = unprocessedNode.filter(item => item !== arrangedDegreeFourVV[i]);
      console.log(`RotatingFace = ${rotatingFace}`);
      for(let j = 0; j < allNode.length; j++){
        if(unprocessedNode.includes(allNode[j])){
          box.vertices_coords[allNode[j]] = rotatePointAroundAxis([box.vertices_coords[selectedNode],box.vertices_coords[arrangedDegreeFourVV[i]]], box.vertices_coords[allNode[j]], outputArrangedFoldingAngles[i]);
        }
      }
      unprocessedNode = unprocessedNode.filter(item => !rotatingFace.includes(item));
    }
    console.log(`UnprocessedNode after Node ${selectedNode}: ${unprocessedNode}`);
  };

  const recursiveDFS = (graph, node, firstEdgeNode, firstFoldingAngle) => {
    // Because it doesn't use an actual stack, we'll need to track depth artificially.
    const callStack = [];
    let max = 0;
    let previousNode = null;
  
    // Record the nodes we have visited.
    const visited = [];

    // Record the fold data
    let foldData = {};
    foldData.degreeFourNode = [];
    foldData.arrangedDegreeFourVV = [];
    foldData.arrangedFoldingAngle = [];
    foldData.arrangedFVArray = [];

    // Record the processed nodes
    let processedNodes = [];

    // Define the DFS function. It's nested so we can more easily keep track of the visited nodes and the callstack depth.
    const dfs = (graph, node, visited, previousNode) => {

      // Mark the next level deep.
      callStack.push(node);
      max = Math.max(max, callStack.length);

      // Mark the node as visited.
      visited.push(node);
      console.log(`Pushed ${node} on to the stack: [${callStack}]`);
  
      // Call the function for each child that hasn't already been visisted.
      if(graph[node]){
        foldData.degreeFourNode.push(node);
        // Fold the node and its four faces when first encounters it

        if(node !== foldData.degreeFourNode[0] && previousNode !== null){
          // must let parent node data not previous array (use callstack)
          console.log(`Folding subsequent node ${node}...`);
          let parentNodeIndexInFoldData = foldData.degreeFourNode.indexOf(callStack[callStack.length - 2]);
          let indexUnderParentNode = foldData.arrangedDegreeFourVV[parentNodeIndexInFoldData].indexOf(node);
          console.log(`${indexUnderParentNode} is the index of node from ${node}'s parentNode ${callStack[callStack.length - 2]}`);
          let parentArray = foldData.arrangedDegreeFourVV[parentNodeIndexInFoldData];
          let inputAngleIndex = parentArray.indexOf(node);
          let inputAngleValue = foldData.arrangedFoldingAngle[foldData.arrangedFoldingAngle.length - 1][inputAngleIndex];
          let [selectedNode, arrangedAngle,arrangedVV,arrangedVVAssignment] = rearrangeInputSectorAnglesArrayForFolding([node, previousNode]);
          let outputArrangedFoldingAngles = degree4FoldingAngles(arrangedAngle, arrangedVV, arrangedVVAssignment, inputAngleValue);
          let arrangedFVArray = findFacesVerticesByVertices(arrangedVV, selectedNode, box.faces_vertices);
          foldData.arrangedDegreeFourVV.push(arrangedVV);
          foldData.arrangedFoldingAngle.push(outputArrangedFoldingAngles);
          foldData.arrangedFVArray.push(arrangedFVArray);

          // Folding subsequent nodes (only index 1 & 2 faces vertices are involved)

          const uniqueNodes = (inputArray) => [...new Set(inputArray.flat())];
          let processedFacesNodes = uniqueNodes(arrangedFVArray);
            // Recalibrating previous parent nodes folding ***Revise this algorithm
            for(let h = 1; h < callStack.length; h++){
              let indexOfFoldingParent = foldData.degreeFourNode.indexOf(callStack[h - 1]);
              let indexUnderParentNode = foldData.arrangedDegreeFourVV[indexOfFoldingParent].indexOf(callStack[h]);
              for(let j = 0; j <= indexUnderParentNode; j++){
                for(let i = 0; i < processedFacesNodes.length; i++){
                  if(!processedNodes.includes(processedFacesNodes[i])){
                  box.vertices_coords[processedFacesNodes[i]] = rotatePointAroundAxis([box.vertices_coords[callStack[h-1]],box.vertices_coords[foldData.arrangedDegreeFourVV[indexOfFoldingParent][j]]], box.vertices_coords[processedFacesNodes[i]], foldData.arrangedFoldingAngle[indexOfFoldingParent][j]);
                  }
                }
              }
            }
            // Actual folding for the node
            for(let i = 0; i < arrangedVV.length; i++){
              let rotatingFace = arrangedFVArray[i];
              for(let j = 0; j < processedFacesNodes.length; j++){
                if(!processedNodes.includes(processedFacesNodes[j])){
                  box.vertices_coords[processedFacesNodes[j]] = rotatePointAroundAxis([box.vertices_coords[selectedNode],box.vertices_coords[arrangedVV[i]]], box.vertices_coords[processedFacesNodes[j]], outputArrangedFoldingAngles[i]);
                }
              }
              for(let k = 0; k < rotatingFace.length; k++){
                processedNodes.push(rotatingFace[k]);
              }
            }   

        } else if (previousNode === null){
          let [selectedNode, arrangedAngle,arrangedVV,arrangedVVAssignment] = rearrangeInputSectorAnglesArrayForFolding([node, firstEdgeNode]);
          let outputArrangedFoldingAngles = degree4FoldingAngles(arrangedAngle, arrangedVV, arrangedVVAssignment, firstFoldingAngle);
          let arrangedFVArray = findFacesVerticesByVertices(arrangedVV, selectedNode, box.faces_vertices);
          foldData.arrangedDegreeFourVV.push(arrangedVV);
          foldData.arrangedFoldingAngle.push(outputArrangedFoldingAngles);
          foldData.arrangedFVArray.push(arrangedFVArray);
          fold(selectedNode, arrangedVV, arrangedFVArray, outputArrangedFoldingAngles);
          const uniqueNodes = (inputArray) => [...new Set(inputArray.flat())];
          let processedFacesNodes = uniqueNodes(arrangedFVArray);
          for(let i = 0; i < processedFacesNodes.length; i++){
            processedNodes.push(processedFacesNodes[i]);
          };
          console.log(`ProcessedNodes after the first face has been processed: ${processedNodes}`);
        }
        graph[node].forEach(child => {
          if (!visited.includes(child)) {
            dfs(graph, child, visited, node);
          } else {
            console.log(`Already visited ${child}: [${callStack}]`);
          }
        });
      }
      else{
        console.log(`${node} is not a degree 4 vertex`);
      }
  
      // All the children of this node have been scanned, so we're done with it.

      callStack.pop();
      console.log(`Finished with node ${node}: [${callStack}]`);

      // Eliminate unused degree four node in foldData
      while(foldData.degreeFourNode.length > callStack.length){
        foldData.degreeFourNode.pop();
        foldData.arrangedDegreeFourVV.pop();
        foldData.arrangedFVArray.pop();
        foldData.arrangedFoldingAngle.pop();
      }
      
    }
    dfs(graph, node, visited, previousNode);
  
    console.log('Longest stack:', max);
    return foldData;
  };
  

  const renderSVG = () => {
    const svgContainer = document.getElementById("svg-container");
    while(svgContainer.firstChild){
      svgContainer.removeChild(svgContainer.firstChild);
    }
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "350");
    svg.setAttribute("height", "350");
    svg.style.backgroundColor = "#f0f0f0";

    let rescaledVerticesCoordsSVG = box.vertices_coords.map(innerArray => innerArray.map((element, index) => index === 1 ? 300 - element * 300 : element * 300));
    let shiftedRescaledVerticesCoordsSVG = rescaledVerticesCoordsSVG.map(innerArray => [innerArray[0] + 25, innerArray[1] + 25, innerArray[2]]);
    let FVSVG = substituteIndexes(shiftedRescaledVerticesCoordsSVG, box.faces_vertices);
    
    console.log(FVSVG);
    console.log(FC);

    for (let i = 0; i < FVSVG.length; ++i) {
      const [P, number] = [FVSVG[i], FC[i]];
      // Convert vertices to Float32Array
      const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      var pointsStr = P.map(function(point) {
        return point[0] + "," + point[1];
      }).join(" ");
      polygon.setAttribute("points", pointsStr);
      let red = (number >> 16) & 255;     // Extracting red component
      let green = (number >> 8) & 255;    // Extracting green component
      let blue = number & 255;            // Extracting blue component
      let color = '#' + ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1); // Convert to hexadecimal representation
      polygon.setAttribute("fill", color);
      //polygon.setAttribute("fill-opacity", "0.8");
      polygon.setAttribute("stroke", "black");
      polygon.setAttribute("stroke-width", "2");
      svg.appendChild(polygon);
    }

    for(let i = 0; i < shiftedRescaledVerticesCoordsSVG.length; i++){
      const [x, y, z] = shiftedRescaledVerticesCoordsSVG[i];
      const circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
      circle.setAttributeNS(null, 'cx', x);
      circle.setAttributeNS(null, 'cy', y);
      circle.setAttributeNS(null, 'r', radius);
      circle.setAttributeNS(null, 'fill', 'white');
      circle.setAttributeNS(null, 'stroke', 'black');
      circle.setAttributeNS(null, 'stroke-width', '2');
      svg.appendChild(circle);

      var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", x);
      text.setAttribute("y", y);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "middle");
      text.setAttribute("font-size", wordSizeSVG);
      text.textContent = "" + i;
      svg.appendChild(text);
    }
    
    svgContainer.appendChild(svg);
  };

  renderSVG();
  
  // test scalling


  const update = () => {
      while (scene.children.length > 0) {
          scene.remove(scene.children[0]);
      }
      if (change != undefined) {
          const [dx, dy] = change.map(a => a*Math.PI/180);
          const rotation = new THREE.Quaternion()
              .setFromEuler(new THREE.Euler(dy, dx, 0, 'XYZ'));
          scene.quaternion.multiplyQuaternions(rotation, scene.quaternion);
      }
      FV = substituteIndexes(box.vertices_coords, box.faces_vertices);
      
      for (let i = 0; i < FV.length; ++i) {
          const [P, color] = [FV[i], FC[i]];
          // Convert vertices to Float32Array
          const vertices = new Float32Array(P.flat());

          // Create a BufferGeometry
          const geometry = new THREE.BufferGeometry();
          geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

          // Define indices for the shape (triangle fan)
          const indices = [];
          for (let i = 1; i <= P.length - 2; i++) {
              indices.push(0, i, i + 1);
          }

          geometry.setIndex(indices);

          // Create a material with the specified color
          const material = new THREE.MeshBasicMaterial({ color , transparent: true, opacity: 0.9, side: THREE.DoubleSide});

          // Create a mesh using the geometry and material
          const mesh = new THREE.Mesh(geometry, material);
          scene.add(mesh);
      }
      
      renderer.render(scene, camera);
      
  };

  renderer.domElement.onmousedown = (e) => {
    mouse = [e.offsetX, e.offsetY];
    update();
  };

  renderer.domElement.onmouseup = (e) => {
    mouse = undefined;
    update();
  };

  renderer.domElement.onmousemove = (e) => {
    if (mouse == undefined) { return; }
    change = [e.offsetX - mouse[0], e.offsetY - mouse[1]];
    mouse = [e.offsetX, e.offsetY];
    update();
  };

  for (const I of ins) {
    const {id, x, y, min, max, step, val} = I;
    const input = document.createElement("input");
    input.style = `position: absolute; left: ${x}px; top: ${y}px;`;
    input.type = "range";
    input.min = min;
    input.max = max;
    input.step = step;
    input.value = val;
    input.id = "input_" + id;
    document.getElementById("input-panel").append(input);
    input.oninput = () => {
        I.val = +document.getElementById("input_" + I.id).value;
        console.log(`input = ${I.val}`);
        const r = ((I.val)/1000 - 0.5)*2*Math.PI;
        console.log(`input folding angle in radian = ${r}`);
        // Reset box.vertices_coords
        resetVerticesCoords();

        // Eliminate what we can't handle (r = 0)
        if(r !== 0){
          // Fold the structure and generating foldData
            console.log('Recursive DFS on Degree 4 Inner Vertices Graph:');
            let foldData = recursiveDFS(degreeFourVV, userSelectedDegree4Node, userSelectedDegree4VV, r);
            console.log(foldData);
        }

        change = undefined;
        update();
    };
  }
  

  update();
};

//Finding Flat Degree 4 Vertices

const filterEdgesByAssignment = (edgesVertices, edgesAssignment, targetAssignments) => {
  if (edgesVertices.length !== edgesAssignment.length) {
    throw new Error("Input arrays must have the same length");
  }

  const edges = edgesVertices.map((vertices, index) => ({ vertices, assignment: edgesAssignment[index] }));

  const filteredEdges = edges.filter(edge => targetAssignments.includes(edge.assignment));

  const filteredVertices = filteredEdges.map(edge => edge.vertices);

  return filteredVertices;
};

const createNodeAssociatedEdges = (filteredEdgesVertices) => {
  const nodeAssociatedEdges = {};

  // Iterate through each edge in the filtered edges
  filteredEdgesVertices.forEach(([node1, node2]) => {
    // Update or create an entry for node1
    if (!nodeAssociatedEdges[node1]) {
      nodeAssociatedEdges[node1] = [];
    }
    nodeAssociatedEdges[node1].push([node1, node2]);

    // Update or create an entry for node2
    if (!nodeAssociatedEdges[node2]) {
      nodeAssociatedEdges[node2] = [];
    }
    nodeAssociatedEdges[node2].push([node1, node2]);
  });

  return nodeAssociatedEdges;
};

const filterNodeAssociatedEdgesByDegree = (nodeAssociatedEdges, xDegreeVertex) => {
  const xDegreeNodeAssociatedEdges = {};

  // Iterate through each key-value pair in nodeAssociatedEdges
  Object.entries(nodeAssociatedEdges).forEach(([node, edges]) => {
    // Filter edges based on xDegreeVertex
    if (edges.length === xDegreeVertex) {
      xDegreeNodeAssociatedEdges[node] = edges;
    }
  });

  return xDegreeNodeAssociatedEdges;
};

//End of Finding Flat Degree 4 Vertices

// Start the application with upload mechanism

let box;
const uploadButton = document.getElementById("upload");
const fileInput = document.getElementById("fileInput");

uploadButton.addEventListener("click", () => {  // Add a click event listener to the button
  fileInput.click();  // Trigger the file input click event when the button is clicked
});

fileInput.addEventListener("change", (event) => { // Add an event listener to handle file selection
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    const reader = new FileReader();
    console.log("Selected file: " + selectedFile.name);
    reader.onload = function (e) {
      const fileContent = e.target.result;
      try {
        const parsedData = JSON.parse(fileContent); // Parse the uploaded file content as JSON
        box = JSON.parse(JSON.stringify(parsedData));
        console.log("inputBox");
        console.log(box);
        input_validation(box);
        setup(); 
        } catch (error) {
        console.error("Error parsing the uploaded file as JSON:", error);
        }
      }
      reader.readAsText(selectedFile);
    }
  });


// Start without upload mechanism (deg4_cp.fold)
/*
// Current example
let box = {
  "file_spec": 1.1,
  "file_creator": "flat-folder",
  "file_title": "deg4_cp",
  "file_classes": [
    "singleModel"
  ],
  "vertices_coords": [
    [
      0,
      1
    ],
    [
      1,
      1
    ],
    [
      0.75,
      0
    ],
    [
      0.75,
      0.75
    ],
    [
      0,
      0.25
    ],
    [
      0.25,
      0.25
    ],
    [
      0.5,
      0
    ],
    [
      0,
      0
    ],
    [
      1,
      0.5
    ],
    [
      0,
      0.5
    ],
    [
      0.25,
      0.75
    ],
    [
      1,
      0
    ]
  ],
  "edges_vertices": [
    [
      0,
      1
    ],
    [
      2,
      3
    ],
    [
      4,
      5
    ],
    [
      5,
      6
    ],
    [
      6,
      7
    ],
    [
      1,
      8
    ],
    [
      2,
      6
    ],
    [
      9,
      10
    ],
    [
      4,
      7
    ],
    [
      2,
      11
    ],
    [
      5,
      7
    ],
    [
      5,
      10
    ],
    [
      0,
      10
    ],
    [
      3,
      10
    ],
    [
      1,
      3
    ],
    [
      0,
      9
    ],
    [
      4,
      9
    ],
    [
      8,
      11
    ],
    [
      3,
      8
    ]
  ],
  "edges_assignment": [
    "B",
    "M",
    "V",
    "M",
    "B",
    "B",
    "B",
    "V",
    "B",
    "B",
    "M",
    "M",
    "M",
    "M",
    "M",
    "B",
    "B",
    "B",
    "V"
  ],
  "faces_vertices": [
    [
      2,
      3,
      10,
      5,
      6
    ],
    [
      1,
      0,
      10,
      3
    ],
    [
      3,
      2,
      11,
      8
    ],
    [
      4,
      5,
      10,
      9
    ],
    [
      6,
      5,
      7
    ],
    [
      8,
      1,
      3
    ],
    [
      9,
      10,
      0
    ],
    [
      5,
      4,
      7
    ]
  ]
};
input_validation(box);
setup();
*/