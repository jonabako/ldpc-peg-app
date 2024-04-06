from flask import Flask, request, jsonify
from flask_cors import CORS
from peg_algorithm import create_graph, create_subgraph

app = Flask(__name__)
CORS(app)

@app.route('/generate-graph', methods=['POST'])
def generate_graph():
    # Receive data from the frontend
    data = request.get_json()

    # Extract data
    nr_symbol_nodes = data['nrSymbolNodes']
    nr_check_nodes = data['nrCheckNodes']
    symbol_node_degrees = data['symbolNodeDegrees']

    # Generate the graph
    graph = create_graph(nr_symbol_nodes, nr_check_nodes, symbol_node_degrees)

    # Prepare nodes and edges for response
    nodes = [{'id': node, 'label': node, 'data': {'customColor': '#e38163'}} if 's' in node else {'id': node, 'label': node, 'data': {'customColor': '#7ac5aa'}} for node in graph.nodes]
    edges = [{'source': source, 'target': target, 'data': {'customColor': '#6c86e2'}} for source, target in graph.edges]

    # Send back the nodes and edges as JSON
    response = {
        'nodes': nodes,
        'edges': edges
    }
    return jsonify(response)

@app.route('/generate-subgraph', methods=['POST'])
def generate_subgraph():
    data = request.get_json()

    # Extract data
    nr_symbol_nodes = data['nrSymbolNodes']
    nr_check_nodes = data['nrCheckNodes']
    symbol_node_degrees = data['symbolNodeDegrees']
    selected_symbol_node_index = data.get('selectedSymbolNodeIndex')
    selected_subgraph_depth = data.get('selectedSubgraphDepth')

    # Generate the graph
    graph = create_graph(nr_symbol_nodes, nr_check_nodes, symbol_node_degrees)

    selected_node = 's' + str(selected_symbol_node_index)
    depth = selected_subgraph_depth

    # Create the subgraph
    subgraph = create_subgraph(graph, selected_node, depth)

    # Prepare nodes and edges for response
    nodes = [{'id': node, 'label': node, 'data': {'customColor': '#e38163'}} if 's' in node else {'id': node, 'label': node, 'data': {'customColor': '#7ac5aa'}} for node in subgraph.nodes]
    edges = [{'source': source, 'target': target, 'data': {'customColor': '#6c86e2'}} for source, target in subgraph.edges]

    # Send back the nodes and edges as JSON
    response = {
        'nodes': nodes,
        'edges': edges
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)