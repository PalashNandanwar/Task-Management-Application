import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard"; // Import TaskCard component
import { v4 as uuidv4 } from "uuid";

const KanbanBoard = () => {
  // State for tasks
  const [tasks, setTasks] = useState({
    todo: [
      {
        id: "1",
        title: "Fix Login Issue",
        description: "Investigate and fix the bug in the login API.",
        priority: "High",
        deadline: "2024-01-10",
        assigned: "John Doe",
      },
      {
        id: "2",
        title: "Update Documentation",
        description: "Add missing details to the API documentation.",
        priority: "Medium",
        deadline: "2024-01-15",
        assigned: "Jane Smith",
      },
    ],
    inProgress: [],
    completed: [],
  });

  // State for new task form
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    deadline: "",
    assigned: "",
    status: "todo", // Default column is 'todo'
  });

  const [isAddingTask, setIsAddingTask] = useState(false); // Control modal visibility

  // Handle drag and drop
  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceColumn = tasks[source.droppableId];
    const destinationColumn = tasks[destination.droppableId];

    const sourceTasks = Array.from(sourceColumn);
    const destinationTasks = Array.from(destinationColumn);

    const [movedTask] = sourceTasks.splice(source.index, 1);
    destinationTasks.splice(destination.index, 0, movedTask);

    setTasks({
      ...tasks,
      [source.droppableId]: sourceTasks,
      [destination.droppableId]: destinationTasks,
    });
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Add new task to the specified column
  const handleAddTask = (columnId) => {
    if (!newTask.title.trim()) {
      alert("Task title is required!");
      return;
    }

    const newTaskData = {
      id: uuidv4(),
      ...newTask,
      status: columnId,
    };

    setTasks((prevTasks) => ({
      ...prevTasks,
      [columnId]: [...prevTasks[columnId], newTaskData],
    }));

    setIsAddingTask(false);
    setNewTask({
      title: "",
      description: "",
      priority: "Medium",
      deadline: "",
      assigned: "",
      status: "todo",
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4 p-4">
        {/* Render columns */}
        {Object.entries(tasks).map(([columnId, columnTasks]) => (
          <Droppable key={columnId} droppableId={columnId}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="w-1/3 p-4 bg-gray-100 rounded-lg shadow-md"
              >
                <h2 className="text-xl font-semibold capitalize mb-4">
                  {columnId.replace(/([A-Z])/g, " $1")}
                </h2>

                {columnTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        {/* Render TaskCard */}
                        <TaskCard
                          task={task}
                          onEdit={(id) => console.log("Edit Task", id)}
                          onDelete={(id) => console.log("Delete Task", id)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}

                {/* Add Task Button */}
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setIsAddingTask(true);
                      setNewTask((prevState) => ({
                        ...prevState,
                        status: columnId,
                      }));
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
                  >
                    Add Task
                  </button>
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>

      {/* New Task Modal */}
      {isAddingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Add New Task</h2>
            <input
              type="text"
              name="title"
              placeholder="Task Title"
              value={newTask.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-4"
            />
            <textarea
              name="description"
              placeholder="Task Description"
              value={newTask.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-between mb-4">
              <select
                name="priority"
                value={newTask.priority}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <input
              type="date"
              name="deadline"
              value={newTask.deadline}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-4"
            />
            <input
              type="text"
              name="assigned"
              placeholder="Assigned To"
              value={newTask.assigned}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleAddTask(newTask.status)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Task
              </button>
              <button
                onClick={() => setIsAddingTask(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DragDropContext>
  );
};

export default KanbanBoard;
