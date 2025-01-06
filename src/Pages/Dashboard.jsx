/* eslint-disable react/prop-types */
// import React from 'react'

import { useState } from "react";
import HomeComponent from "../Components/HomeComponent";

const Dashboard = ({ userData }) => {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState('');
    const [taskId, setTaskId] = useState(0);

    const handleAddTask = () => {
        if (task) {
            setTasks([
                ...tasks,
                { id: taskId, name: task, completed: false },
            ]);
            setTask('');
            setTaskId(taskId + 1);
        }
    };

    const handleToggleTask = (id) => {
        setTasks(tasks.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        ));
    };

    const handleDeleteTask = (id) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    return (
        <div className="container mx-auto p-6">
            <HomeComponent />
            {console.log(userData)}
            <div className="flex justify-between items-center mt-[4rem] mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Task Dashboard</h1>
                <input
                    type="text"
                    className="p-2 border border-gray-300 rounded"
                    placeholder="New task"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                />
                <button
                    className="ml-2 bg-blue-500 text-white p-2 rounded"
                    onClick={handleAddTask}
                >
                    Add Task
                </button>
            </div>

            <ul className="space-y-4">
                {tasks.map((task) => (
                    <li key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleToggleTask(task.id)}
                                className="mr-4"
                            />
                            <span className={task.completed ? 'line-through text-gray-500' : ''}>
                                {task.name}
                            </span>
                        </div>
                        <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard