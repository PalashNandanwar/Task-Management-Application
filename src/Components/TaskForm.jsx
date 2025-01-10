// TaskForm.jsx
import React from "react";

const TaskForm = ({
  newTask,
  handleInputChange,
  handleAddTask,
  setIsAddingTask,
}) => {
  return (
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
  );
};

export default TaskForm;
