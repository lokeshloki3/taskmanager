import { useEffect, useState } from "react";
import { auth, db } from "../components/firebaseConfig";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { BiTask, BiLogOut } from "react-icons/bi";
import NewModal from "../components/NewModal";
import EditTaskModal from "../components/EditTaskModal";

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

    setFilteredTasks(filtered);
  }, [tasks, categoryFilter, dateFilter]);

  const getUserTasks = async (user) => {
    if (user) {
      const displayName = user.displayName || "default";
      const tasksRef = collection(db, "tasks", user.uid, displayName);
      const taskSnapshot = await getDocs(tasksRef);
      const taskList = taskSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTasks(taskList);
    }
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
      <tr key={task.id}>
        <td className="border px-4 py-2">
          <div className="flex gap-4 justify-start">
            <input type="checkbox" />
            <div>{task.task}</div>
          </div>
        </td>
        <td className="border px-4 py-2 text-center">
          {task.dueDate?.seconds
            ? new Date(task.dueDate.seconds * 1000).toLocaleDateString()
            : "No Due Date"}
        </td>
        <td className="border px-4 py-2 text-center">
          <span
            className={`px-2 py-1 rounded-full ${task.status === "todo"
              ? "bg-yellow-300"
              : task.status === "inprogress"
                ? "bg-blue-300"
                : "bg-green-300"
              }`}
          >
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
        </td>
        <td className="border px-4 py-2 text-center">{task.category}</td>
        <td className="border px-4 py-2 text-center">
          <button
            onClick={() => openEditModal(task)}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </td>
      </tr>
    ));
  };

  const countTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status).length;
  }

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
    <div className="mr-4 ml-4">
      {userDetails ? (
        <>
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
        </>
      ) : (
        <p>Loading...</p>
      )}

      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Task Name</th>
            <th className="border px-4 py-2 cursor-pointer" onClick={handleSortByDate}>Due On {sortOrder === "asc" ? "↑" : "↓"}</th>
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
          {renderTaskRows("complete")}
        </tbody>
      </table>

      {showModal && <NewModal isOpen={showModal} onClose={closeModal} onTaskAdded={onTaskEditAdded} />}
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
  );
};

export default Profile;
