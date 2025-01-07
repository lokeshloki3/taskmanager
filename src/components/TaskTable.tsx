const TaskTable = ({ tasks, filteredTasks, sortOrder, handleSortByDate, renderTaskRows, countTasksByStatus }) => {
    return (
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Task Name</th>
            <th className="border px-4 py-2 cursor-pointer" onClick={handleSortByDate}>
              Due On {sortOrder === "asc" ? "↑" : "↓"}
            </th>
            <th className="border px-4 py-2">Task Status</th>
            <th className="border px-4 py-2">Task Category</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="5" className="text-left bg-pink-100 font-bold px-4 py-2">
              To-Do ({countTasksByStatus("todo")})
            </td>
          </tr>
          {renderTaskRows("todo")}
  
          <tr>
            <td colSpan="5" className="text-left bg-pink-100 font-bold px-4 py-2">
              In Progress ({countTasksByStatus("inprogress")})
            </td>
          </tr>
          {renderTaskRows("inprogress")}
  
          <tr>
            <td colSpan="5" className="text-left bg-pink-100 font-bold px-4 py-2">
              Completed ({countTasksByStatus("complete")})
            </td>
          </tr>
          {renderTaskRows("completed")}
        </tbody>
      </table>
    );
  };
  
  export default TaskTable;
  