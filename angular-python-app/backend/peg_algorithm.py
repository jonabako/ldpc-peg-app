from builtins import enumerate, int, list, range
import networkx as nx

def create_graph(n, m, s_node_degrees):
    # Create an empty graph
    graph = nx.Graph()

    # Create symbol nodes (s_type)
    s_nodes = ['s{}'.format(i) for i in range(n)]
    graph.add_nodes_from(s_nodes, node_type='s')

    # Create check nodes (c_type)
    c_nodes = ['c{}'.format(i) for i in range(m)]
    graph.add_nodes_from(c_nodes, node_type='c')

    # Initialize check node degrees
    c_degrees = [0] * m

    # PEG Algorithm for edge creation
    for s_i in s_nodes:
        for d_i in range(s_node_degrees[int(s_i[1:])]):
            if d_i == 0:
                # Connect s_i to check node with lowest degree
                min_degree = min(c_degrees)
                min_degree_c_nodes = [c_nodes[i] for i, deg in enumerate(c_degrees) if deg == min_degree]
                c_node = min_degree_c_nodes[0]
                graph.add_edge(s_i, c_node)
                c_degrees[c_nodes.index(c_node)] += 1
            else:
                # Build subgraph of s_i
                depth = 0
                prev_subgraph_nodes = set()
                current_subgraph_nodes = set(create_subgraph(graph, s_i, depth).nodes)

                # Continue building subgraph until it no longer expands
                while current_subgraph_nodes != prev_subgraph_nodes:
                    depth += 1
                    prev_subgraph_nodes = current_subgraph_nodes
                    current_subgraph_nodes = set(create_subgraph(graph, s_i, depth).nodes)

                subgraph_c_nodes = [node for node in create_subgraph(graph, s_i, depth).nodes if create_subgraph(graph, s_i, depth).nodes[node]['node_type'] == 'c']

                if set(subgraph_c_nodes) == set(c_nodes):
                    # Connect s_i to the check node with the lowest degree among the farthest nodes in the subgraph
                    farthest_check_nodes = get_farthest_check_nodes(graph, s_i, depth, c_nodes, c_degrees)

                    min_degree = min([c_degrees[c_nodes.index(c)] for c in farthest_check_nodes])
                    min_degree_c_nodes = [c for c in farthest_check_nodes if c_degrees[c_nodes.index(c)] == min_degree]
                    c_node = min_degree_c_nodes[0]
                    graph.add_edge(s_i, c_node)
                    c_degrees[c_nodes.index(c_node)] += 1
                else:
                    # Connect s_i to check node with lowest degree among check nodes not present in the subgraph
                    check_nodes_not_in_subgraph = list(set(c_nodes) - set(subgraph_c_nodes))
                    min_degree = min([c_degrees[c_nodes.index(c)] for c in check_nodes_not_in_subgraph])
                    min_degree_c_nodes = [c for c in check_nodes_not_in_subgraph if c_degrees[c_nodes.index(c)] == min_degree]

                    # Sort min_degree_c_nodes based on their index to prioritize the lowest index
                    min_degree_c_nodes.sort(key=lambda x: c_nodes.index(x))

                    c_node = min_degree_c_nodes[0]
                    graph.add_edge(s_i, c_node)
                    c_degrees[c_nodes.index(c_node)] += 1

    return graph

def get_farthest_check_nodes(graph, selected_node, depth, c_nodes, c_degrees):
    subgraph = create_subgraph(graph, selected_node, depth)
    subgraph_c_nodes = [node for node in subgraph.nodes if subgraph.nodes[node]['node_type'] == 'c']

    # Find the nodes at the maximum depth in the subgraph
    max_depth_nodes = [node for node, node_depth in nx.shortest_path_length(subgraph, selected_node).items() if node_depth == depth]

    # If no nodes are found at the maximum depth, try depth - 1
    if not max_depth_nodes and depth > 0:
        max_depth_nodes = [node for node, node_depth in nx.shortest_path_length(subgraph, selected_node).items() if node_depth == depth - 1]

    # Among these max_depth_nodes, filter out only the check nodes
    farthest_check_nodes = [node for node in max_depth_nodes if node in subgraph_c_nodes]

    # If there are no farthest check nodes, use the check node with the lowest degree
    if not farthest_check_nodes:
        min_degree = min(c_degrees)
        min_degree_c_nodes = [c_nodes[i] for i, deg in enumerate(c_degrees) if deg == min_degree]
        farthest_check_nodes = [min_degree_c_nodes[0]]  # Use the first node with minimum degree

    # Sort farthest_check_nodes based on their degree in c_degrees
    farthest_check_nodes.sort(key=lambda x: c_degrees[c_nodes.index(x)])

    return farthest_check_nodes

def create_subgraph(graph, selected_node, depth):
    subgraph = nx.Graph()
    queue = [(selected_node, 0)]  # (node, level)
    visited = set([selected_node])

    while queue:
        node, level = queue.pop(0)
        if level > depth:
            break
        subgraph.add_node(node, node_type=graph.nodes[node]['node_type'])

        if level < depth:
            neighbors = graph.neighbors(node)
            for neighbor in neighbors:
                if neighbor not in visited:
                    subgraph.add_node(neighbor, node_type=graph.nodes[neighbor]['node_type'])
                    subgraph.add_edge(node, neighbor)
                    queue.append((neighbor, level + 1))
                    visited.add(neighbor)
    
    return subgraph