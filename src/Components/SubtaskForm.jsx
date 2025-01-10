// SubtaskForm.jsx
import React, { useState } from 'react';

const SubtaskForm = ({ onAddSubtask, taskId, setShowSubtaskForm }) => {
  const [subtaskTitle, setSubtaskTitle] = useState('');


  
  const handleInputChange = (e) => {
    setSubtaskTitle(e.target.value);
  };

  const handleAddSubtask = () => {
    if (!subtaskTitle.trim()) {
      alert('Subtask title is required!');
      return;
    }

    onAddSubtask(taskId, subtaskTitle);
    setShowSubtaskForm(false); // Close the form after adding the subtask
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Add Subtask</h2>
        <input
          type="text"
          placeholder="Subtask Title"
          value={subtaskTitle}
          onChange={handleInputChange}
          className="w-full p-2 border rounded mb-4"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleAddSubtask}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Subtask
          </button>
          <button
            onClick={() => setShowSubtaskForm(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubtaskForm;
