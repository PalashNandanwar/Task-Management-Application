// /* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */

const TaskCard = ({ task, onEdit, onDelete }) => {
  // Color codes for priority levels
  const priorityColors = {
    High: "bg-red-500",
    Medium: "bg-yellow-500",
    Low: "bg-green-500",
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
          className={`text-sm font-medium ${
            new Date(task.deadline) < new Date() ? "text-red-500" : "text-gray-500"
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
          onClick={() => onEdit(task.id)}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
