import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard"; // Import TaskCard component
import { v4 as uuidv4 } from "uuid";
import HomeComponent from "./HomeComponent";
import TaskForm from "./TaskForm"; // Import TaskForm
import mockData from "../mockData"; // Import mock data


const KanbanBoard = () => {
  const [tasks, setTasks] = useState(mockData); // Use mock data
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    deadline: "",
    assigned: "",
    status: "todo",
  });


  const [isAddingTask, setIsAddingTask] = useState(false);

  const onDragEnd = (result) => {
    const { source, destination } = result;
  
    // If dropped outside the board, do nothing
    if (!destination) return;
  
    // If the task is dropped in the same column and position, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
  
    // Get source and destination columns
    const sourceColumn = tasks[source.droppableId];
    const destinationColumn = tasks[destination.droppableId];
  
    // Make copies of the source and destination columns to avoid mutating state directly
    const sourceTasks = Array.from(sourceColumn);
    const destinationTasks = Array.from(destinationColumn);
  
    // Remove the task from the source column
    const [movedTask] = sourceTasks.splice(source.index, 1);
  
    // If the task is moved to the same column, reorder within the column
    if (source.droppableId === destination.droppableId) {
      sourceTasks.splice(destination.index, 0, movedTask); // Move the task within the same column
      setTasks({
        ...tasks,
        [source.droppableId]: sourceTasks, // Update the column with the reordered tasks
      });
    } else {
      // If the task is moved to a different column, add it to the destination column
      destinationTasks.splice(destination.index, 0, movedTask);
      setTasks({
        ...tasks,
        [source.droppableId]: sourceTasks, // Update the source column with the task removed
        [destination.droppableId]: destinationTasks, // Update the destination column with the moved task
      });
    }
  };

// handle sub tasks
const handleAddSubtask = (taskId, subtaskTitle) => {
  const columnId = Object.keys(tasks).find((columnId) => {
    const columnIndex = tasks[columnId].findIndex((task) => task.id === taskId);
    if (columnIndex !== -1) {
      return true;
    }
    return false;
  });

  if (columnId) {
    const columnIndex = tasks[columnId].findIndex((task) => task.id === taskId);
    if (tasks[columnId] && tasks[columnId][columnIndex]) {
      const newSubtask = {
        id: uuidv4(),
        title: subtaskTitle,
        completed: false,
      };

      if (!tasks[columnId][columnIndex].subtasks) {
        tasks[columnId][columnIndex].subtasks = [];
      }

      tasks[columnId][columnIndex].subtasks.push(newSubtask);
      setTasks({ ...tasks });
    }
  }
};
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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
  
  const onDeleteSubtask = (task, index) => {
    const columnId = Object.keys(tasks).find((columnId) => {
      const columnIndex = tasks[columnId].findIndex((t) => t.id === task.id);
      if (columnIndex !== -1) {
        return true;
      }
      return false;
    });
  
    if (columnId) {
      const columnIndex = tasks[columnId].findIndex((t) => t.id === task.id);
      const updatedTask = { ...task };
      updatedTask.subtasks.splice(index, 1);
      tasks[columnId][columnIndex] = updatedTask;
      setTasks({ ...tasks });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4 p-4">
        <HomeComponent />
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
                        <TaskCard
                          task={task}
                          onEdit={(id) => console.log("Edit Task", id)}
                          onDelete={(id) => console.log("Delete Task", id)}
                          onAddSubtask={(taskId, subtaskTitle) => handleAddSubtask(taskId, subtaskTitle)}
                          onDeleteSubtask={(task, index) => onDeleteSubtask(task, index)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}

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

      {isAddingTask && (
        <TaskForm
          newTask={newTask}
          handleInputChange={handleInputChange}
          handleAddTask={handleAddTask}
          setIsAddingTask={setIsAddingTask}
        />
      )}
    </DragDropContext>
  );
};

export default KanbanBoard;
