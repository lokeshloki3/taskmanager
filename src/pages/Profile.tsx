import { useEffect, useState } from "react";
import { auth } from "../components/firebaseConfig";
import { db } from "../components/firebaseConfig";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { BiTask, BiLogOut } from "react-icons/bi";
import NewModal from "../components/newModal";
import EditTaskModal from "../components/EditTaskModal";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [tasks, setTasks] = useState([]);
  const collectionRef = collection(db, "tasks");
  const [showModal, setShowModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    const getTasks = async () => {
      await getDocs(collectionRef).then((task) => {
        let tasksData = task.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        setTasks(tasksData);
      }).catch((err) => {
        console.log(err);
      })
    }
    getTasks();
  }, [])

  // console.log("tasks", tasks);

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      // console.log(user);
      // console.log(user?.photoURL);
      setUserDetails(user);
    });
  }

  useEffect(() => {
    fetchUserData();
  }, []);


  async function handleLogout() {
    try {
      await auth.signOut();
      window.location.href = "/";
      console.log("User logout");
    } catch (error) {
      console.log("error in logging out", error.message);
    }
  }

  // const submitTask = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await addDoc(collectionRef, {
  //       task: createTask,
  //       isChecked: false
  //     })
  //     window.location.reload()
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const deleteTask = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this task?");

    if (isConfirmed) {
      try {
        const documentRef = doc(db, "tasks", id);
        await deleteDoc(documentRef);
        setTasks(tasks.filter(task => task.id !== id));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openEditModal = (task, id) => {
    setTaskToEdit({ task, id });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setTaskToEdit(null);
  };

  const onEdit = () => {
    setEditModalOpen(false);
    window.location.reload();
  };

  return (
    <div>
      {userDetails ? (
        <>
          <div className="flex justify-between m-10">
            <div>
              <div className="flex gap-4 justify-center items-center text-4xl">
                <BiTask />
                <p>TaskBuddy</p>
              </div>

            </div>
            <div className="flex flex-col gap-2 items-center">
              <div className="flex justify-center items-center gap-2">
                <img src={userDetails.photoURL} className="rounded-full w-16 h-auto" />
                <h3>{userDetails.displayName}</h3>
              </div>
              <div className="flex justify-center items-center text-sm p-2 gap-1 rounded-lg w-24 cursor-pointer border border-red-200" onClick={handleLogout} style={{ backgroundColor: "#F8F3F3" }}>
                <BiLogOut />
                <p>Logout</p>
              </div>
              <button onClick={openModal} className="text-white px-10 py-2 rounded-3xl" style={{ backgroundColor: "#7B1A84" }}>
                Add Task
              </button>
            </div>
          </div>
          <div>
            <p>Email: {userDetails.email}</p>
          </div>

        </>
      ) : (
        <p>Loading...</p>
      )}

      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Task</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(({ task, id }) => (
            <tr key={id}>
              <td className="border px-4 py-2">
                <span>
                  <input type="checkbox" />
                  {task}
                </span>
              </td>
              <td className="border px-4 py-2">
                {/* Edit button */}
                <button
                  onClick={() => openEditModal(task, id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  Edit
                </button>

                {/* Delete button */}
                <button
                  onClick={() => deleteTask(id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {/* <form onSubmit={submitTask}>
        <input type="text" placeholder="please add task" onChange={e => setCreateTask(e.target.value)} />
        <button type="submit">Add Task</button>
      </form> */}

      {showModal && (
        <NewModal
          isOpen={showModal}
          onClose={closeModal}
        />
      )}

      {editModalOpen && taskToEdit && (
        <EditTaskModal
          isOpen={editModalOpen}
          onClose={closeEditModal}
          taskId={taskToEdit.id}
          initialTask={taskToEdit.task}
          onEdit={onEdit}
        />
      )}
    </div>
  )
}

export default Profile