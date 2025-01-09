// /* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */

import axios from "axios";

const TaskCard = ({ task, onTaskUpdated }) => {
  // Color codes for priority levels
  const priorityColors = {
    High: "bg-red-500",
    Medium: "bg-yellow-500",
    Low: "bg-green-500",
  };

  // Handle Delete Task
  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      alert("Task deleted successfully!");
      onTaskUpdated(); // Notify parent to refresh tasks
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete the task. Please try again.");
    }
  };

  // Handle Edit Task
  const handleEdit = async (taskId) => {
    const updatedFields = prompt(
      "Enter updated fields in JSON format, e.g., {\"title\": \"New Title\"}:"
    );

    if (!updatedFields) return;

    try {
      const parsedFields = JSON.parse(updatedFields);
      await axios.put(`/api/tasks/${taskId}`, parsedFields);
      alert("Task updated successfully!");
      onTaskUpdated(); // Notify parent to refresh tasks
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update the task. Ensure the input is valid JSON.");
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-4">
      {/* Task Title */}
      <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>

      {/* Task Description */}
      <p className="text-sm text-gray-600 mt-2">{task.description}</p>

      {/* Priority & Deadline */}
      <div className="flex items-center justify-between mt-4">
        <span
          className={`text-sm font-semibold text-white px-3 py-1 rounded ${priorityColors[task.priority]}`}
        >
          {task.priority}
        </span>
        <span
          className={`text-sm font-medium ${new Date(task.deadline) < new Date() ? "text-red-500" : "text-gray-500"
            }`}
        >
          {task.deadline}
        </span>
      </div>

      {/* Assigned Member */}
      <p className="text-sm text-gray-500 mt-2">
        Assigned to: <span className="font-medium text-gray-700">{task.assigned}</span>
      </p>

      {/* Buttons for Actions */}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => handleEdit(task.id)}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(task.id)}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
