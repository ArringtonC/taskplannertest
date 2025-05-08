import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../hooks';
import { Task } from '../context/taskState';
import Badge from '../components/Badge';
import { Button } from '@/components/ui/button';

interface GraphNode {
  id: string;
  title: string;
  status: string;
  priority: string;
  complexity: number;
  x: number;
  y: number;
  radius: number;
}

interface GraphLink {
  source: string;
  target: string;
}

/**
 * DependencyGraph component
 * Renders a visualization of task dependencies
 */
const DependencyGraph: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, loading, error, refreshTasks } = useTasks();
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [highlightedLink, setHighlightedLink] = useState<string | null>(null);
  const [relatedNodes, setRelatedNodes] = useState<string[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  // Generate graph data from tasks
  useEffect(() => {
    if (!tasks.length) return;

    // Create a map of task IDs to track duplication
    const taskMap = new Map(tasks.map((task) => [task._id, task]));

    // Generate nodes
    const graphNodes: GraphNode[] = [];
    const graphLinks: GraphLink[] = [];

    // Initial positions using a radial layout
    const centerX = 500;
    const centerY = 400;
    const radius = 250;

    tasks.forEach((task, index) => {
      // Calculate position in a circle
      const angle = (index / tasks.length) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      // Create node
      graphNodes.push({
        id: task._id,
        title: task.title,
        status: task.status,
        priority: task.priority,
        complexity: task.complexity || 1,
        x,
        y,
        radius: 20 + (task.complexity || 1) * 2, // Size based on complexity
      });

      // Create links for dependencies
      if (task.dependencies?.length) {
        task.dependencies.forEach((depId) => {
          // Check if the dependency exists in our task list
          if (taskMap.has(depId)) {
            graphLinks.push({
              source: depId,
              target: task._id,
            });
          }
        });
      }

      // Create links for parent-child relationships
      if (task.parentTask && taskMap.has(task.parentTask)) {
        graphLinks.push({
          source: task.parentTask,
          target: task._id,
        });
      }
    });

    setNodes(graphNodes);
    setLinks(graphLinks);
  }, [tasks]);

  // Handle node drag start
  const handleNodeMouseDown = (nodeId: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggedNode(nodeId);

    // Find and set the selected task
    const task = tasks.find((task) => task._id === nodeId);
    setSelectedTask(task || null);

    // Highlight all nodes directly connected to this one
    if (task) {
      // Find all links where this node is source or target
      const connectedLinks = links.filter(
        (link) => link.source === nodeId || link.target === nodeId
      );

      // Get all node IDs connected to this one
      const connectedNodeIds = connectedLinks.map((link) =>
        link.source === nodeId ? link.target : link.source
      );

      setRelatedNodes([nodeId, ...connectedNodeIds]);
    }
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedNode || !svgRef.current) return;

    // Get SVG coordinates
    const svgRect = svgRef.current.getBoundingClientRect();
    const x = (e.clientX - svgRect.left) / zoom;
    const y = (e.clientY - svgRect.top) / zoom;

    // Update node position
    setNodes((prev) =>
      prev.map((node) => (node.id === draggedNode ? { ...node, x, y } : node))
    );
  };

  // Handle node drag end
  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  // Handle link click to highlight connected nodes
  const handleLinkClick =
    (linkIndex: number, sourceId: string, targetId: string) =>
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setHighlightedLink(`${linkIndex}`);
      setRelatedNodes([sourceId, targetId]);
    };

  // Clear highlights when clicking on the SVG background
  const handleSvgClick = () => {
    if (!draggedNode) {
      setHighlightedLink(null);
      setRelatedNodes([]);
      // Don't clear selected task - keep that visible
    }
  };

  // Handle zoom in/out
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  // Reset zoom
  const handleResetZoom = () => {
    setZoom(1);
  };

  // Get color for node based on status
  const getNodeColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return '#10B981'; // green
      case 'in-progress':
        return '#3B82F6'; // blue
      case 'cancelled':
        return '#EF4444'; // red
      case 'deferred':
        return '#F59E0B'; // amber
      default:
        return '#8B5CF6'; // purple for pending
    }
  };

  // Get color for priority indicator
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high':
        return '#EF4444'; // red
      case 'medium':
        return '#F59E0B'; // amber
      case 'low':
        return '#10B981'; // green
      default:
        return '#6B7280'; // gray
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 border-b">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">
            Task Dependency Graph
          </h1>
          <p className="text-gray-600">
            Visualize task dependencies and relationships
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow p-4 relative">
        <div className="container mx-auto flex flex-col h-full">
          {/* Controls */}
          <div className="bg-white rounded-md shadow-sm p-4 mb-4 flex justify-between">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-gray-700 hover:bg-gray-800 text-white"
                onClick={handleZoomIn}
              >
                Zoom In
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-gray-700 hover:bg-gray-800 text-white"
                onClick={handleZoomOut}
              >
                Zoom Out
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-gray-700 hover:bg-gray-800 text-white"
                onClick={handleResetZoom}
              >
                Reset
              </Button>
            </div>

            {/* Legend */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span className="text-xs text-gray-600">Completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                <span className="text-xs text-gray-600">In Progress</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
                <span className="text-xs text-gray-600">Pending</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span className="text-xs text-gray-600">Cancelled</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
                <span className="text-xs text-gray-600">Deferred</span>
              </div>
            </div>
          </div>

          {/* Graph */}
          <div className="flex-grow bg-white rounded-md shadow-sm overflow-hidden relative">
            {/* Error message */}
            {error && (
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && tasks.length === 0 && (
              <div className="absolute inset-0 flex flex-col justify-center items-center">
                <svg
                  className="w-16 h-16 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Tasks Found
                </h3>
                <p className="text-gray-600 mb-4 text-center">
                  There are no tasks to display in the dependency graph.
                </p>
              </div>
            )}

            {/* SVG Graph */}
            <svg
              ref={svgRef}
              className="w-full h-full"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={handleSvgClick}
            >
              <g transform={`scale(${zoom})`}>
                {/* Links */}
                {links.map((link, index) => {
                  const source = nodes.find((node) => node.id === link.source);
                  const target = nodes.find((node) => node.id === link.target);

                  if (!source || !target) return null;

                  // Check if this link is highlighted or connected to highlighted nodes
                  const isHighlighted =
                    highlightedLink === `${index}` ||
                    (relatedNodes.length > 0 &&
                      relatedNodes.includes(link.source) &&
                      relatedNodes.includes(link.target));

                  return (
                    <g
                      key={`link-${index}`}
                      onClick={handleLinkClick(index, link.source, link.target)}
                      style={{ cursor: 'pointer' }}
                    >
                      <defs>
                        <marker
                          id={`arrowhead-${index}`}
                          markerWidth="10"
                          markerHeight="7"
                          refX="9"
                          refY="3.5"
                          orient="auto"
                        >
                          <polygon
                            points="0 0, 10 3.5, 0 7"
                            fill={isHighlighted ? '#3B82F6' : '#6B7280'}
                          />
                        </marker>
                      </defs>
                      <line
                        x1={source.x}
                        y1={source.y}
                        x2={target.x}
                        y2={target.y}
                        stroke={isHighlighted ? '#3B82F6' : '#6B7280'}
                        strokeWidth={isHighlighted ? '3' : '2'}
                        strokeDasharray={isHighlighted ? 'none' : '5,5'}
                        markerEnd={`url(#arrowhead-${index})`}
                      />
                    </g>
                  );
                })}

                {/* Nodes */}
                {nodes.map((node) => {
                  // Check if this node is selected or highlighted
                  const isSelected = selectedTask
                    ? selectedTask._id === node.id
                    : false;
                  const isHighlighted = relatedNodes.includes(node.id);

                  return (
                    <g
                      key={`node-${node.id}`}
                      transform={`translate(${node.x}, ${node.y})`}
                      onMouseDown={handleNodeMouseDown(node.id)}
                      style={{ cursor: 'grab' }}
                    >
                      {/* Highlight effect for selected or related nodes */}
                      {(isSelected || isHighlighted) && (
                        <circle
                          r={node.radius + 5}
                          fill="transparent"
                          stroke={isSelected ? '#3B82F6' : '#60A5FA'}
                          strokeWidth="3"
                          strokeDasharray={isSelected ? 'none' : '5,5'}
                        />
                      )}

                      {/* Main circle */}
                      <circle
                        r={node.radius}
                        fill={getNodeColor(node.status)}
                        fillOpacity={isHighlighted ? '1' : '0.8'}
                        stroke="#fff"
                        strokeWidth={isSelected ? '3' : '2'}
                      />

                      {/* Priority indicator */}
                      <circle
                        r={node.radius / 3}
                        cy={-node.radius - 5}
                        fill={getPriorityColor(node.priority)}
                        stroke="#fff"
                        strokeWidth="1"
                      />

                      {/* Complexity badge */}
                      <g>
                        <circle
                          cx={node.radius - 5}
                          cy={-node.radius - 5}
                          r={10}
                          fill="#4B5563"
                          fillOpacity="0.9"
                          stroke="#fff"
                          strokeWidth="1"
                        />
                        <text
                          x={node.radius - 5}
                          y={-node.radius - 5}
                          fontSize="10"
                          fill="#fff"
                          fontWeight="bold"
                          textAnchor="middle"
                          dy=".3em"
                        >
                          {node.complexity}
                        </text>
                      </g>

                      {/* Task title */}
                      <text
                        textAnchor="middle"
                        dy=".3em"
                        fontSize="11"
                        fill="#fff"
                        fontWeight="500"
                      >
                        {node.title.length > 15
                          ? node.title.substring(0, 15) + '...'
                          : node.title}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Task details panel */}
          {selectedTask && (
            <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 w-80">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedTask.title}
                </h3>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setSelectedTask(null)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div className="text-sm text-gray-600">
                {selectedTask.description && (
                  <p className="mb-2">{selectedTask.description}</p>
                )}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>{' '}
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        selectedTask.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : selectedTask.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-800'
                            : selectedTask.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {selectedTask.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Priority:</span>{' '}
                    <Badge className="bg-blue-100 text-blue-800">
                      {selectedTask.priority}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Complexity:
                    </span>{' '}
                    <span className="text-gray-900">
                      {selectedTask.complexity || 1}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Due:</span>{' '}
                    <span className="text-gray-900">
                      {selectedTask.dueDate
                        ? new Date(selectedTask.dueDate).toLocaleDateString()
                        : 'Not set'}
                    </span>
                  </div>
                </div>

                {/* Dependencies information */}
                <div className="mt-3">
                  <h4 className="font-medium text-gray-700 mb-1">
                    Dependencies:
                  </h4>
                  {selectedTask.dependencies &&
                  selectedTask.dependencies.length > 0 ? (
                    <ul className="text-xs text-gray-600 list-disc ml-4">
                      {selectedTask.dependencies.map((depId) => {
                        const depTask = tasks.find((t) => t._id === depId);
                        return (
                          <li key={depId}>
                            {depTask ? depTask.title : 'Unknown task'}
                            {depTask && (
                              <span
                                className={`ml-1 ${
                                  depTask.status === 'completed'
                                    ? 'text-green-600'
                                    : 'text-orange-600'
                                }`}
                              >
                                ({depTask.status})
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500">No dependencies</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-sm p-4 border-t">
        <div className="container mx-auto flex justify-between items-center">
          <button
            type="button"
            className="bg-secondary text-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-secondary"
            onClick={() => navigate('/')}
          >
            Back to Dashboard
          </button>
          <button
            type="button"
            className="bg-primary text-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            onClick={() => navigate('/monthly')}
          >
            Monthly Mapper
          </button>
        </div>
      </footer>
    </div>
  );
};

export default DependencyGraph;
