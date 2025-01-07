import { BiTask, BiLogOut } from "react-icons/bi";

const UserProfile = ({ userDetails, setCategoryFilter, handleLogout, openModal, handleDateFilter }) => {
  return (
    <div className="flex justify-between m-10">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 justify-center items-center text-4xl">
          <BiTask />
          <p>TaskBuddy</p>
        </div>
        <div className="flex gap-4">
          <p>List</p>
          <p>Board</p>
        </div>
        <div className="flex gap-4 items-center">
          <p>Filter By</p>
          <select
            className="border rounded-lg p-2 cursor-pointer"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="work">Work</option>
            <option value="professional">Professional</option>
          </select>
          <select
            className="border rounded-lg p-2 cursor-pointer"
            onChange={(e) => handleDateFilter(e.target.value)}
          >
            <option value="">All Dates</option>
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
        <button
          onClick={openModal}
          className="text-white px-10 py-2 rounded-3xl"
          style={{ backgroundColor: "#7B1A84" }}
        >
          Add Task
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
