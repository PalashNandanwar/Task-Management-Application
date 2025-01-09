import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard"; // Import TaskCard component
import HomeComponent from "./HomeComponent";
import axios from "axios"; // Import axios for API requests

const KanbanBoard = () => {
  // State for tasks
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    completed: [],
  });

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    deadline: "",
    assigned: "",
    status: "todo",
  });

  const [isAddingTask, setIsAddingTask] = useState(false); // Control modal visibility

  // Fetch tasks from the server
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const fetchedTasks = response.data;

        console.log('Fetched tasks:', fetchedTasks); // Log the fetched tasks

        // Group tasks by status
        const groupedTasks = {
          todo: fetchedTasks.filter((task) => task.status === 'todo'),
          inProgress: fetchedTasks.filter((task) => task.status === 'inProgress'),
          completed: fetchedTasks.filter((task) => task.status === 'completed'),
        };

        setTasks(groupedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  // Handle drag and drop
  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceColumn = tasks[source.droppableId];
    const destinationColumn = tasks[destination.droppableId];

    const sourceTasks = Array.from(sourceColumn);
    const destinationTasks = Array.from(destinationColumn);

    const [movedTask] = sourceTasks.splice(source.index, 1);
    movedTask.status = destination.droppableId;
    destinationTasks.splice(destination.index, 0, movedTask);

    setTasks({
      ...tasks,
      [source.droppableId]: sourceTasks,
      [destination.droppableId]: destinationTasks,
    });

    // Update the task status in the backend
    try {
      await axios.put(`/api/tasks/${movedTask._id}`, { status: movedTask.status });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Add new task
  const handleAddTask = async (columnId) => {
    if (!newTask.title.trim()) {
      alert("Task title is required!");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const status = columnId; // Set the status based on the columnId
      const response = await axios.post("/api/tasks", {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        deadline: newTask.deadline,
        assigned: newTask.assigned,
        status: status, // Set the status based on the columnId
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const createdTask = response.data;

      setTasks((prevTasks) => ({
        ...prevTasks,
        [columnId]: [...prevTasks[columnId], createdTask],
      }));

      setIsAddingTask(false);
      setNewTask({
        title: "",
        description: "",
        priority: "Medium",
        deadline: "",
        assigned: "",
      });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4 p-4">
        <HomeComponent />
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
                  <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        {/* Render TaskCard */}
                        <TaskCard
                          task={task}
                          onEdit={(_id) => console.log("Edit Task", _id)}
                          onDelete={(_id) => console.log("Delete Task", _id)}
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
