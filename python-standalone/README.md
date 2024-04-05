# LDPC-PEG SIMULATION TOOL (PYTHON STANDALONE CODE)

This Python code generates a Tanner Graph, Parity Check Matrix & Subgraph based on user input.

The script uses the PEG (Progressive Edge Growth) algorithm for edge creation.

## Prerequisites
- Python installed on your system. If you don't have Python installed, you can download it from the [Python website](https://www.python.org/downloads/).
- Required Python libraries: `networkx`, `matplotlib`, `numpy`. You can install these using pip:

```powershell
pip install networkx matplotlib numpy
```

## Running the Script
1. **Download the Script**:
 - Download the `ldpc_peg_generator.py` script from this repository.

2. **Open Terminal or Command Prompt and Navigate to the Script Directory**:
 - Use the `cd` command to navigate to the directory where you saved `ldpc_peg_generator.py`.

3. **Run the Script**:
 - In the terminal, type:
   ```
   python ldpc_peg_generator.py
   ```

4. **Follow the Prompts**:
 - Enter the following information when prompted:
   - `Number of symbol nodes (n)`: Enter an integer for the number of symbol nodes.
   - `Number of check nodes (m)`: Enter an integer for the number of check nodes.
   - `S-node degrees (comma separated)`: For each symbol node, enter its degree as a comma-separated list.

5. **View the Output**:
 - The script will create the Tanner graph based on your input and display:
   - The Parity Check Matrix (in between steps and as the final matrix).
   - The Final Tanner Graph (visualized in matplotlib window).
   - Prompt you to select a specific symbol node to visualize its subgraph by entering the node name (e.g., `s0`, `s1`, etc.) and the depth of the subgraph (then view the Subgraph visualized as a tree graph with the selected node as the root node).

6. **Close Graph Windows**:
 - After viewing each graph, close the graph window to continue with the script.

## Additional Notes:
- If you encounter any errors during input, the script will provide error messages and prompt you to enter valid inputs.
- The graph and subgraph will be displayed using `matplotlib`.