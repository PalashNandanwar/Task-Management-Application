/* eslint-disable no-unused-vars */
import { useState } from "react";

const TeamManagement = () => {
    // Sample Team Data
    const [team, setTeam] = useState([
        { id: 1, name: "Alice Johnson", role: "Manager", email: "alice@email.com" },
        { id: 2, name: "Bob Smith", role: "Developer", email: "bob@email.com" },
        { id: 3, name: "Charlie Brown", role: "Designer", email: "charlie@email.com" },
    ]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-4">Team Management</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Role</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {team.map((member) => (
                            <tr key={member.id} className="border-b hover:bg-gray-100">
                                <td className="p-3">{member.name}</td>
                                <td className="p-3">{member.role}</td>
                                <td className="p-3">{member.email}</td>
                                <td className="p-3">
                                    <button className="text-blue-500 hover:underline mr-4">
                                        Edit
                                    </button>
                                    <button className="text-red-500 hover:underline">
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeamManagement;
