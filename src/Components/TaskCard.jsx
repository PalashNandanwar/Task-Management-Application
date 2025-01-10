// /* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import SubtaskForm from './SubtaskForm';
import { FaTrashAlt } from 'react-icons/fa';

const TaskCard = ({ task, onEdit, onDelete, onAddSubtask, onDeleteSubtask }) => {
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);

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
      <p className="text-sm text-gray-600 mt-4">{task.description}</p>

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

      {/* Subtasks */}
      {Array.isArray(task.subtasks) && task.subtasks.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold">Subtasks</h4>
          <div className="grid grid-cols-1 gap-4">
  {task.subtasks.map((subtask, index) => (
    <div
      key={index}
      className="flex justify-between p-4 rounded-lg shadow-md w-60"
    >
      <h5 className="text-lg font-semibold">{subtask.title}</h5>
      <button
        onClick={() => onDeleteSubtask(task, index)}
        className="text-red-500 hover:text-red-700"
      >
        <FaTrashAlt />
      </button>
    </div>
  ))}
</div>
        </div>
      )}

      {/* Buttons for Actions */}
      <div className="flex justify-end mt-2 space-x-2">
        <button
          onClick={() => onEdit(task.id)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded"
        >
          Delete
        </button>
        
        {/* Add Subtask Button */}
        <button
        onClick={() => setShowSubtaskForm(true)}
        className="text-blue-500 "
      >
        + 
      </button>
      </div>

      {/* Subtask Form */}
      {showSubtaskForm && (
        <SubtaskForm
          onAddSubtask={onAddSubtask}
          taskId={task.id}
          setShowSubtaskForm={setShowSubtaskForm}
        />
      )}
    </div>
  );
};

const handleDeleteSubtask = (task, index) => {
  const updatedTask = { ...task };
  updatedTask.subtasks.splice(index, 1);
  onEdit(updatedTask);
};

export default TaskCard;
