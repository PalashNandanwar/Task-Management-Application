
import KanbanBoard from "../Components/KanbanBoard";

const TaskBoard = () => {
    return (
        <div>
            <h1 className="text-4xl font-bold text-center mb-8 font-cursive bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
                Kanban Board
            </h1>
            <KanbanBoard />
        </div>
    );
};

export default TaskBoard;
