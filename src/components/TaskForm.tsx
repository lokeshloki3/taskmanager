import React from 'react';

const TaskForm = ({
  taskTitle,
  setTaskTitle,
  taskDesc,
  setTaskDesc,
  category,
  setCategory,
  dueDate,
  setDueDate,
  status,
  setStatus,
  handleTextAreaChange,
}) => (
  <div className="mb-2 mt-4">
    <input
      type="text"
      value={taskTitle}
      onChange={(e) => setTaskTitle(e.target.value)}
      required
      className="border border-gray-300 p-2 w-full rounded-lg bg-gray-100"
      placeholder="Task title"
    />
    <textarea
      value={taskDesc}
      onChange={handleTextAreaChange}
      placeholder="Task description"
      className="border border-gray-300 p-2 w-full rounded-lg mt-4 bg-gray-100 h-36"
    />
    <div className="text-right text-sm mt-1">
      <span>{taskDesc.length}/300</span>
    </div>
    <div className="flex justify-between mt-3">
      <div className="flex flex-col gap-2">
        <p>Task Category*</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCategory('work')}
            className={`border border-black p-1 pr-5 pl-5 text-sm rounded-xl ${
              category === 'work' ? 'bg-[#CBABCE] text-white' : ''
            }`}
          >
            Work
          </button>
          <button
            type="button"
            onClick={() => setCategory('professional')}
            className={`border border-black p-1 pr-5 pl-5 text-sm rounded-xl ${
              category === 'professional' ? 'bg-[#CBABCE] text-white' : ''
            }`}
          >
            Professional
          </button>
        </div>
      </div>
      <div>
        <p className="mb-2">Due on*</p>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          className="border border-gray-300 p-1 pr-5 pl-5 text-sm rounded-xl bg-gray-100"
        />
      </div>
      <div>
        <p className="mb-2">Task Status*</p>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
          className="border border-gray-300 bg-gray-100 p-1 pr-5 pl-5 text-sm rounded-xl cursor-pointer"
        >
          <option value="" disabled>
            Choose
          </option>
          <option value="todo">Todo</option>
          <option value="inprogress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  </div>
);

export default TaskForm;
