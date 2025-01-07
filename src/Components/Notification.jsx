import { useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";

const Notification = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Sample notifications
    const notifications = [
        { id: 1, message: "New task assigned to you." },
        { id: 2, message: "Deadline approaching for 'Fix Login Issue'." },
        { id: 3, message: "Team meeting scheduled for tomorrow." },
    ];

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            {/* Notification Icon */}
            <div
                className="cursor-pointer text-2xl text-gray-700 hover:text-[#2196f3]"
                onClick={toggleDropdown}
            >
                <IoMdNotificationsOutline />
            </div>

            {/* Dropdown Card */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg overflow-hidden z-10">
                    <div className="p-4 border-b text-lg font-semibold">
                        Notifications
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className="p-3 border-b hover:bg-gray-100 transition"
                                >
                                    {notification.message}
                                </div>
                            ))
                        ) : (
                            <div className="p-3 text-center text-gray-500">
                                No notifications
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notification;