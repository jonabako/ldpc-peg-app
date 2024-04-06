import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Edge, Node } from '@swimlane/ngx-graph';
import { Observer } from 'rxjs'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})

export class HomeComponent {
  activeItemIndex = 0;
  graphFlag: boolean = false;
  subgraphFlag: boolean = false;

  nodes: Node[] = [];
  links: Edge[] = [];
  nodesAtStep: Node[] = [];
  linksAtStep: Edge[] = [];
  subgraphNodes: Node[] = [];
  subgraphLinks: Edge[] = [];

  nrSymbolNodes: number | undefined;
  nrCheckNodes: number | undefined;
  symbolNodeDegrees: string = '';

  parityCheckMatrix: number[][] = [];
  parityCheckMatrixAtStep: number[][] = [];

  currentStep: number = 0;

  selectedSymbolNodeIndex: number | undefined;
  selectedSubgraphDepth: number | undefined;

  constructor(private http: HttpClient) { }

  ngOnInit(): void { }

  onTabClick(itemIndex: number): void {
    this.activeItemIndex = itemIndex;
  }

  // Tab 0

  clearInputFields() {
    this.graphFlag = false;
    this.nrSymbolNodes = undefined;
    this.nrCheckNodes = undefined;
    this.symbolNodeDegrees = '';
    this.currentStep = 0;
    this.clearSelectorFields();
  }

  generateGraph() {
    // Check if all input fields are filled
    if (!this.nrSymbolNodes || !this.nrCheckNodes || !this.symbolNodeDegrees) {
      alert('Please fill in all parameters to generate the Tanner graph.');
      return;
    }

    // Convert nrSymbolNodes and nrCheckNodes to numbers
    const symbolNodes = Number(this.nrSymbolNodes);
    const checkNodes = Number(this.nrCheckNodes);

    // Validation for nrSymbolNodes and nrCheckNodes
    if (symbolNodes <= 0 || checkNodes <= 0 || !Number.isInteger(symbolNodes) || !Number.isInteger(checkNodes)) {
      alert('Error: Number of symbol nodes and check nodes must be positive integers.');
      return;
    }

    // Validation for symbolNodeDegrees
    const degrees = this.symbolNodeDegrees.split(',').map(Number);

    // Check if symbolNodeDegrees contains non-numeric values or non-positive integers
    if (!degrees.every(value => !isNaN(value) && Number.isInteger(value) && value >= 0)) {
      alert('Error: Symbol node degrees must be provided as positive integers, separated by commas.');
      return;
    }

    // Check if number of degrees provided matches number of symbol nodes
    if (degrees.length !== symbolNodes) {
      alert(`Error: Number of degrees provided (${degrees.length}) does not match the number of symbol nodes (n=${symbolNodes}).`);
      return;
    }

    // Check if degree values of symbol nodes exceed number of check nodes
    if (degrees.some(degree => degree > checkNodes)) {
      alert(`Error: Some degrees provided exceed the number of check nodes (m=${checkNodes}). Please provide degrees less than or equal to ${checkNodes}.`);
      return;
    }

    // Create the payload to send to the backend
    const payload = {
      nrSymbolNodes: symbolNodes,
      nrCheckNodes: checkNodes,
      symbolNodeDegrees: degrees
    };

    // Send a POST request to Flask backend
    this.http.post<any>('http://localhost:5000/generate-graph', payload)
      .subscribe({
        next: (response) => {
          this.graphFlag = true;
          this.nodes = response.nodes;
          this.links = response.edges;
          this.generateParityCheckMatrix(this.nodes, this.links); // Generate Parity Check Matrix
        },
        error: (error) => {
          console.error('Error generating graph:', error);
        }
      } as Observer<any>);
  }

  generateParityCheckMatrix(nodes: Node[], links: Edge[]) {
    // Initialize an empty parity check matrix
    let parityCheckMatrix: number[][] = [];

    // Extract the list of symbol nodes and check nodes
    let sNodes: Node[] = nodes.filter(node => node.id.startsWith('s'));
    let cNodes: Node[] = nodes.filter(node => node.id.startsWith('c'));

    // Create a mapping from node id to node index
    let nodeIndexMap: { [id: string]: number } = {};
    nodes.forEach((node, index) => {
      nodeIndexMap[node.id] = index;
    });

    // Populate the parity check matrix
    cNodes.forEach(cNode => {
      let cIndex = nodeIndexMap[cNode.id]; // Check node index
      parityCheckMatrix[cIndex] = new Array(sNodes.length).fill(0); // Initialize row for check node

      // Find connected symbol nodes
      let connectedSymbolNodes = links
        .filter(link => link.target === cNode.id) // Filter links where check node is the target
        .map(link => nodeIndexMap[link.source]); // Map connected symbol node IDs to their indices

      // Set corresponding entries in parity check matrix to 1
      connectedSymbolNodes.forEach(sIndex => {
        parityCheckMatrix[cIndex][sIndex] = 1;
      });
    });

    // Update the component's parityCheckMatrix property
    this.parityCheckMatrix = parityCheckMatrix;
  }


  // Tab 1

  goBack() {
    if (this.currentStep !== 0) {
      this.currentStep--;
      this.clearSelectorFields()
      console.log("Current Step:", this.currentStep);
      this.generateGraphAtStep(this.currentStep);
    }
  }

  goForward() {
    // Convert the string to an array of numbers
    const symbolNodeDegrees = this.symbolNodeDegrees.split(',').map(Number);

    // Calculate the sum of the elements in nrSymbolNodesArray
    const totalDegrees = symbolNodeDegrees.reduce((acc, curr) => acc + curr, 0);

    if (this.currentStep !== totalDegrees) {
      this.currentStep++;
      this.clearSelectorFields()
      console.log("Current Step:", this.currentStep);
      this.generateGraphAtStep(this.currentStep);
    }
  }


  // Function to generate a graph at a specific step
  generateGraphAtStep(step: number) {
    // Convert nrSymbolNodes and nrCheckNodes to numbers
    const symbolNodes = Number(this.nrSymbolNodes);
    const checkNodes = Number(this.nrCheckNodes);

    // Split the existing degrees string into an array
    let degrees = this.symbolNodeDegrees.split(',').map(Number);

    // Create new degrees based on the step
    for (let i = 0; i < symbolNodes; i++) {
      if (step == 0) {
        degrees[i] = 0;
      } else if (degrees[i] < step) {
        // Decrease step by the filled amount
        step -= degrees[i];
      } else {
        // If the current degree is greater than step, set it to step
        degrees[i] = step;
        step = 0; // Step is now 0 as it's completely filled
      }
    }

    // Create the payload to send to the backend
    const payload = {
      nrSymbolNodes: symbolNodes,
      nrCheckNodes: checkNodes,
      symbolNodeDegrees: degrees
    };

    // Send a POST request to Flask backend
    this.http.post<any>('http://localhost:5000/generate-graph', payload)
      .subscribe({
        next: (response) => {
          this.nodesAtStep = response.nodes;
          this.linksAtStep = response.edges;
          this.generateMatrixAtStep(this.nodesAtStep, this.linksAtStep); // Generate Parity Check Matrix
          
        },
        error: (error) => {
          console.error('Error generating graph:', error);
        }
      } as Observer<any>);
  }

  generateMatrixAtStep(nodes: Node[], links: Edge[]) {
    // Initialize an empty parity check matrix
    let parityCheckMatrixAtStep: number[][] = [];

    // Extract the list of symbol nodes and check nodes
    let sNodes: Node[] = nodes.filter(node => node.id.startsWith('s'));
    let cNodes: Node[] = nodes.filter(node => node.id.startsWith('c'));

    // Create a mapping from node id to node index
    let nodeIndexMap: { [id: string]: number } = {};
    nodes.forEach((node, index) => {
      nodeIndexMap[node.id] = index;
    });

    // Populate the parity check matrix
    cNodes.forEach(cNode => {
      let cIndex = nodeIndexMap[cNode.id]; // Check node index
      parityCheckMatrixAtStep[cIndex] = new Array(sNodes.length).fill(0); // Initialize row for check node

      // Find connected symbol nodes
      let connectedSymbolNodes = links
        .filter(link => link.target === cNode.id) // Filter links where check node is the target
        .map(link => nodeIndexMap[link.source]); // Map connected symbol node IDs to their indices

      // Set corresponding entries in parity check matrix to 1
      connectedSymbolNodes.forEach(sIndex => {
        parityCheckMatrixAtStep[cIndex][sIndex] = 1;
      });
    });

    // Update the component's parityCheckMatrix property
    this.parityCheckMatrixAtStep = parityCheckMatrixAtStep;
  }

  // Tab 2

  generateSubgraph() {
    if (
      this.selectedSymbolNodeIndex === undefined ||
      this.selectedSubgraphDepth === undefined
    ) {
      alert(
        'Please enter a symbol node index and subgraph depth to generate the subgraph.'
      );
      return;
    }

    // Convert selectedSymbolNodeIndex and selectedSubgraphDepth to numbers
    const symbolNodeIndex = Number(this.selectedSymbolNodeIndex);
    const subgraphDepth = Number(this.selectedSubgraphDepth);

    // Validation for positive integer values
    if (
      symbolNodeIndex < 0 ||
      !Number.isInteger(symbolNodeIndex) ||
      subgraphDepth < 0 ||
      !Number.isInteger(subgraphDepth)
    ) {
      alert(
        'Error: Please enter valid positive integer values for the symbol node index and subgraph depth.'
      );
      return;
    }

    // Validation for selectedSymbolNodeIndex
    if (
      this.nrSymbolNodes !== undefined &&
      symbolNodeIndex >= this.nrSymbolNodes
    ) {
      alert(
        'Error: Please enter a valid symbol node index from the existing symbol node list (s0 to s' +
        this.nrSymbolNodes +
        ')'
      );
      return;
    }

    // Convert nrSymbolNodes and nrCheckNodes to numbers
    const symbolNodes = Number(this.nrSymbolNodes);
    const checkNodes = Number(this.nrCheckNodes);

    // Split the existing degrees string into an array
    let degrees = this.symbolNodeDegrees.split(',').map(Number);
    let step = this.currentStep;

    // Create new degrees based on the step
    for (let i = 0; i < symbolNodes; i++) {
      if (step == 0) {
        degrees[i] = 0;
      } else if (degrees[i] < step) {
        // Decrease step by the filled amount
        step -= degrees[i];
      } else {
        // If the current degree is greater than step, set it to step
        degrees[i] = step;
        step = 0; // Step is now 0 as it's completely filled
      }
    }

    // Create the payload to send to the backend
    const payload = {
      nrSymbolNodes: symbolNodes,
      nrCheckNodes: checkNodes,
      symbolNodeDegrees: degrees,
      selectedSymbolNodeIndex: symbolNodeIndex,
      selectedSubgraphDepth: subgraphDepth
    };

    // Send a POST request to Flask backend
    this.http.post<any>('http://localhost:5000/generate-subgraph', payload)
      .subscribe({
        next: (response) => {
          this.subgraphFlag = true;
          this.subgraphNodes = response.nodes;
          this.subgraphLinks = response.edges;
          
        },
        error: (error) => {
          console.error('Error generating graph:', error);
        }
      } as Observer<any>);
  }

  clearSelectorFields() {
    this.subgraphFlag = false;
    this.selectedSymbolNodeIndex = undefined;
    this.selectedSubgraphDepth = undefined;
  }

}
