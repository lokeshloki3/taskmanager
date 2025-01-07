const TaskBoard = ({ tasks, filteredTasks, countTasksByStatus, openEditModal, deleteTask }) => {
  const taskStatuses = ['todo', 'inprogress', 'completed'];

  return (
    <div className="flex gap-8">
      {taskStatuses.map((status) => (
        <div key={status} className="w-1/3">
          <div className="bg-pink-100 p-4 font-bold text-left">
            <h4>{`${status.charAt(0).toUpperCase() + status.slice(1)} (${countTasksByStatus(status)})`}</h4>
          </div>
          <div className="bg-gray-100 p-4">
            {filteredTasks.filter(task => task.status === status).map((task) => (
              <div key={task.id} className="border p-4 mb-4 rounded-lg bg-white flex flex-col justify-between">
                <h5 className="text-xl font-semibold">{task.task}</h5>
                <div className="flex justify-between">
                  <p>Status: {task.status}</p>
                  <p>Category: {task.category}</p>
                </div>
                <div className="mt-2 flex justify-between">
                  <p>Due on: {task.dueDate.toDate().toLocaleDateString()}</p>
                  <div className="flex justify-start gap-4">
                    <button
                      className="text-blue-500"
                      onClick={() => openEditModal(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
