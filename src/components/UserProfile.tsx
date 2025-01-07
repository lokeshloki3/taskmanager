import { BiTask, BiLogOut } from "react-icons/bi";
import { useState } from "react";
import TaskTable from './TaskTable';
import TaskBoard from './TaskBoard';
import { IoSearchOutline } from "react-icons/io5";
import notfound from "../assets/notfound.png";
import { CiViewList } from "react-icons/ci";
import { CiViewBoard } from "react-icons/ci";

const UserProfile = ({ userDetails, setCategoryFilter, handleLogout, openModal, handleDateFilter, tasks, filteredTasks, sortOrder, handleSortByDate, renderTaskRows, countTasksByStatus, openEditModal, deleteTask, searchQuery, setSearchQuery, isSearchEmpty }) => {
    const [view, setView] = useState('list');

    return (
        <div>
            <div className="flex justify-between m-10">
                <div className="flex flex-col gap-4">
                    <div className="flex gap-4 justify-center items-center text-4xl">
                        <BiTask />
                        <p>TaskBuddy</p>
                    </div>
                    <div className="flex gap-4">
                        <div className={`cursor-pointer flex justify-center items-center gap-1 ${view === 'list' ? 'font-bold underline' : ''}`}
                            onClick={() => setView('list')}>
                            <CiViewList />
                            <p>List</p>
                        </div>
                        <div className={`cursor-pointer flex justify-center items-center gap-1 ${view === 'board' ? 'font-bold underline' : ''}`}
                            onClick={() => setView('board')}>
                            <CiViewBoard />
                            <p>Board</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-center">
                        <p className="text-sm text-gray-500">Filter By:</p>
                        <select
                            className="border rounded-lg p-2 cursor-pointer text-sm"
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            <option value="work">Work</option>
                            <option value="professional">Professional</option>
                        </select>
                        <select
                            className="border rounded-lg p-2 cursor-pointer text-sm"
                            onChange={(e) => handleDateFilter(e.target.value)}
                        >
                            <option value="">All Due Dates</option>
                            <option value="3">Next 3 Days</option>
                            <option value="7">Next 7 Days</option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <div className="flex justify-center items-center gap-2">
                        <img src={userDetails.photoURL} className="rounded-full w-16 h-auto" />
                        <h3>{userDetails.displayName}</h3>
                    </div>
                    <div
                        className="flex justify-center items-center text-sm p-2 gap-1 rounded-lg w-24 cursor-pointer border border-red-200"
                        onClick={handleLogout}
                        style={{ backgroundColor: "#F8F3F3" }}
                    >
                        <BiLogOut />
                        <p>Logout</p>
                    </div>
                    <div className="flex gap-6 mb-4 mt-4">
                        <div className="flex items-center w-[50%] mx-auto bg-white rounded-lg border border-blue-800 ">
                            <IoSearchOutline className="text-3xl pl-2" />
                            <input
                                type="text"
                                className="p-3 rounded-lg w-full focus:outline-none"
                                placeholder="Search Tasks"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={openModal}
                            className="text-white px-10 py-2 rounded-3xl"
                            style={{ backgroundColor: "#7B1A84" }}
                        >
                            Add Task
                        </button>
                    </div>
                </div>
            </div>
            <div>
                {filteredTasks.length > 0 && !isSearchEmpty ?
                    (view === 'list' ? (
                        <TaskTable
                            tasks={tasks}
                            filteredTasks={filteredTasks}
                            sortOrder={sortOrder}
                            handleSortByDate={handleSortByDate}
                            renderTaskRows={renderTaskRows}
                            countTasksByStatus={countTasksByStatus}
                        />
                    ) : (
                        <TaskBoard
                            tasks={tasks}
                            filteredTasks={filteredTasks}
                            countTasksByStatus={countTasksByStatus}
                            openEditModal={openEditModal}
                            deleteTask={deleteTask}
                        />
                    )
                    ) : (
                        <div className="flex flex-col gap-4 justify-center items-center">
                            <img src={notfound} alt="Not found image" className="w-80 h-auto" />
                            <p className="text-center text-gray-500">It looks like we can't find any results that match.</p>
                        </div>)
                }
            </div>
        </div>
    );
};

export default UserProfile;
