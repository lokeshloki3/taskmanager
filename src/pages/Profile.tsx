import { useEffect, useState } from "react";
import { auth, db } from "../components/firebaseConfig";
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import NewModal from "../components/NewModal";
import EditTaskModal from "../components/EditTaskModal";
import UserProfile from "../components/UserProfile";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchEmpty, setIsSearchEmpty] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserDetails(user);
        getUserTasks(user);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = tasks;

    if (categoryFilter) {
      filtered = filtered.filter(
        (task) => task.category?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    if (dateFilter) {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + parseInt(dateFilter));

      filtered = filtered.filter((task) => {
        if (task.dueDate?.seconds) {
          const taskDate = new Date(task.dueDate.seconds * 1000);
          return taskDate >= today && taskDate <= futureDate;
        }
        return false;
      });
    }
    if (searchQuery) {
      filtered = filtered.filter((task) =>
        task.task.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
    setIsSearchEmpty(filtered.length === 0);
  }, [tasks, categoryFilter, dateFilter, searchQuery]);

  const getUserTasks = async (user) => {
    if (user) {
      const displayName = user.displayName || "default";
      const tasksRef = collection(db, "tasks", user.uid, displayName);
      const taskSnapshot = await getDocs(tasksRef);
      const taskList = taskSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        isChecked: doc.data().isChecked || false,
      }));
      setTasks(taskList);
    }
  };


  const handleCheckboxChange = async (taskId) => {
    const task = tasks.find((task) => task.id === taskId);
    const newCheckedState = !task.isChecked;

    const taskRef = doc(db, "tasks", userDetails.uid, userDetails.displayName || "default", taskId);
    await updateDoc(taskRef, {
      isChecked: newCheckedState,
    });

    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, isChecked: newCheckedState } : task
      )
    );
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = "/";
    } catch (error) {
      console.log("Error in logging out:", error.message);
    }
  };

  const onTaskEditAdded = () => {
    if (auth.currentUser) {
      getUserTasks(auth.currentUser);
    }
  };

  const deleteTask = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this task?");
    if (isConfirmed) {
      try {
        const user = auth.currentUser;
        const displayName = user.displayName || "default";
        const taskDocRef = doc(db, "tasks", user.uid, displayName, id);
        await deleteDoc(taskDocRef);
        setTasks(tasks.filter((task) => task.id !== id));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const openEditModal = (task) => {
    setTaskToEdit(task);
    setEditModalOpen(true);
  };
  const closeEditModal = () => setEditModalOpen(false);

  const renderTaskRows = (status) => {
    const filteredByStatus = filteredTasks.filter(
      (task) => task.status === status
    );

    if (filteredByStatus.length === 0) {
      return (
        <tr>
          <td colSpan="5" className="text-center text-gray-500 py-4">
            No Tasks in {status.charAt(0).toUpperCase() + status.slice(1)}
          </td>
        </tr>
      );
    }

    return filteredByStatus.map((task) => (
      <tr key={task.id} className="bg-gray-100">
        <td className="border px-4 py-2">
          <div className="flex gap-4 justify-start">
            <input
              type="checkbox"
              checked={task.isChecked}
              onChange={() => handleCheckboxChange(task.id)}
            />
            <div className={`${task.status === "completed" ? "line-through text-gray-500" : ""}`}>
              {task.task}
            </div>
          </div>
        </td>
        <td className="border px-4 py-2 text-center">
          {task.dueDate?.seconds
            ? new Date(task.dueDate.seconds * 1000).toLocaleDateString()
            : "No Due Date"}
        </td>
        <td className="border px-4 py-2 text-center">
          <span
            className={`px-2 py-1 rounded-lg ${task.status === "todo"
              ? "bg-pink-100"
              : task.status === "inprogress"
                ? "bg-sky-100"
                : "bg-green-100"
              }`}
          >
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
        </td>
        <td className="border px-4 py-2 text-center">{task.category}</td>
        <td className="border px-4 py-2 text-center">
          <button
            onClick={() => openEditModal(task)}
            className="bg-gray-500 text-white px-4 py-1 rounded-lg mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="bg-red-500 text-white px-4 py-1 rounded-lg"
          >
            Delete
          </button>
        </td>
      </tr>
    ));
  };

  const countTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status).length;
  };

  const handleSortByDate = () => {
    const sortedTasks = [...tasks].sort((a, b) => {
      const dateA = a.dueDate?.seconds || 0;
      const dateB = b.dueDate?.seconds || 0;
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setTasks(sortedTasks);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleDateFilter = (days) => {
    setDateFilter(days);
  };

  return (
    <div>
      {/* for large screens */}
      <div className="mr-4 ml-4 hidden lg:block">
        {userDetails ? (
          <>
            <UserProfile
              userDetails={userDetails}
              setCategoryFilter={setCategoryFilter}
              handleLogout={handleLogout}
              openModal={openModal}
              handleDateFilter={handleDateFilter}
              tasks={tasks}
              filteredTasks={filteredTasks}
              sortOrder={sortOrder}
              handleSortByDate={handleSortByDate}
              renderTaskRows={renderTaskRows}
              countTasksByStatus={countTasksByStatus}
              openEditModal={openEditModal}
              deleteTask={deleteTask}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isSearchEmpty={isSearchEmpty}
            />
          </>
        ) : (
          <p>Loading...</p>
        )}

        {showModal &&
          <NewModal
            isOpen={showModal}
            onClose={closeModal}
            onTaskAdded={onTaskEditAdded}
          />}

        {editModalOpen && taskToEdit && (
          <EditTaskModal
            isOpen={editModalOpen}
            onClose={closeEditModal}
            taskId={taskToEdit.id}
            initialTaskData={taskToEdit}
            onEdit={onTaskEditAdded}
          />
        )}
      </div>

      {/* For Small Screens */}
      <div className="block lg:hidden">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">TaskBuddy</h1>
          <img
            src={userDetails?.photoURL}
            alt="User"
            className="w-10 h-10 rounded-full"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={openModal}
            className="text-white px-10 py-2 rounded-3xl"
            style={{ backgroundColor: "#7B1A84" }}
          >
            Add Task
          </button>
        </div>

        {/* Filter and Search */}
        <div className="space-y-4">
          <div>
            <label htmlFor="filter" className="block text-sm font-medium">
              Filter by
            </label>
            <select
              id="filter"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              onChange={(e) => console.log(e.target.value)}
            >
              <option value="">All</option>
              <option value="todo">To-Do</option>
              <option value="inprogress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label htmlFor="search" className="block text-sm font-medium">
              Search
            </label>
            <input
              type="text"
              className="p-3 rounded-lg w-full focus:outline-none"
              placeholder="Search Tasks"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Task Groups */}
        <div className="space-y-6">
          {["todo", "inprogress", "completed"].map((status) => (
            <div key={status} className="space-y-2">
              <h2 className="text-lg font-semibold capitalize">{status}</h2>
              <div className="space-y-2">
                {tasks
                  .filter((task) => task.status === status) // Filter tasks by status
                  .map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-2 bg-gray-100 rounded-lg"
                    >
                      <input
                        type="checkbox"
                        checked={task.isChecked}
                        onChange={() => handleCheckboxChange(task.id)}
                      />
                      <span>{task.task}</span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
        {showModal && (
          <NewModal
            isOpen={showModal}
            onClose={closeModal}
            onTaskAdded={onTaskEditAdded}
          />
        )}
      </div>
    </div >
  );
};

export default Profile;
