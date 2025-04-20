import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  NodeTypes,
  Handle,
  Position,
  NodeProps
} from 'reactflow';
import 'reactflow/dist/style.css';
import { TableInfo } from '@/types/database';

interface DiagramViewProps {
  tables: TableInfo[];
}

// Custom table node component
const TableNode = ({ data }: NodeProps) => {
  const { table } = data;
  
  return (
    <div className="bg-[#2A2A2A] border border-[#444444] rounded shadow-md p-2 min-w-[180px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      {/* Table name header */}
      <div className="font-bold text-white border-b border-[#444444] pb-1 mb-2">
        {table.name}
      </div>
      
      {/* Table columns with types */}
      <div className="text-sm">
        {table.columns.map((col: string) => (
          <div key={col} className="flex justify-between py-1 border-b border-[#333333] last:border-b-0">
            <span className="text-green-400">{col}</span>
            <span className="text-gray-400 text-xs italic">
              ({table.columnTypes?.[col] || 'unknown'})
            </span>
          </div>
        ))}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

// Detect potential relationships between tables based on column names
const detectRelationships = (tables: TableInfo[]): Edge[] => {
  const edges: Edge[] = [];
  
  // Simple heuristic: Look for columns that end with "_id" or match "tablename_id"
  tables.forEach(sourceTable => {
    tables.forEach(targetTable => {
      if (sourceTable.name !== targetTable.name) {
        // Look for foreign keys as "<tablename>_id"
        const potentialFkColumn = `${targetTable.name.toLowerCase()}_id`;
        
        sourceTable.columns.forEach(column => {
          const lowerColumn = column.toLowerCase();
          
          // Check if column might be a foreign key to the target table
          if (
            lowerColumn === potentialFkColumn || 
            (lowerColumn.endsWith('_id') && 
             targetTable.name.toLowerCase() === lowerColumn.replace('_id', ''))
          ) {
            edges.push({
              id: `${sourceTable.name}-${targetTable.name}`,
              source: sourceTable.name,
              target: targetTable.name,
              animated: true,
              style: { stroke: '#3f8cf2' },
              label: column,
            });
          }
        });
      }
    });
  });
  
  return edges;
};

// Define the BackgroundVariant enum to match reactflow's expected type
enum BackgroundVariant {
  Lines = 'lines',
  Dots = 'dots',
  Cross = 'cross'
}

export function DiagramView({ tables }: DiagramViewProps) {
  // Define node types for using custom nodes
  const nodeTypes = useMemo<NodeTypes>(() => ({ 
    tableNode: TableNode 
  }), []);

  // Create nodes from tables
  const nodes: Node[] = useMemo(() => {
    // Position tables in a grid layout
    const columns = 3;
    const nodeWidth = 220;
    const nodeHeight = 250;
    const horizontalGap = 100;
    const verticalGap = 150;

    return tables.map((table, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      
      return {
        id: table.name,
        type: 'tableNode',
        data: { table },
        position: {
          x: column * (nodeWidth + horizontalGap),
          y: row * (nodeHeight + verticalGap)
        },
        style: {
          width: nodeWidth,
        }
      };
    });
  }, [tables]);

  // Detect relationships between tables
  const edges = useMemo(() => detectRelationships(tables), [tables]);

  // Handle when nodes change (drag, etc.)
  const onNodesChange = useCallback(() => {
    // This is needed for nodes to be draggable
    // For more advanced scenarios, implement node position persistence
  }, []);

  return (
    <div className="w-full h-full">
      <div className="w-full h-[600px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          fitView
          attributionPosition="bottom-right"
        >
          <Controls />
          <Background color="#444" variant={BackgroundVariant.Lines} />
        </ReactFlow>
      </div>
      <div className="text-sm text-gray-400 mt-4">
        <p>Diagram shows potential relationships between tables based on column naming patterns.</p>
        <p>Drag nodes to rearrange the diagram for better visualization.</p>
      </div>
    </div>
  );
} 