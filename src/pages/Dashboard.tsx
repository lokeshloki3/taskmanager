import { useEffect, useState } from "react";
import { auth } from "../components/firebaseConfig";

const Dashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      console.log(user);
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

  return (
    <div>
      {userDetails ? (
        <>
          <img src={userDetails.photoURL} />
          <h3>Welcome {userDetails.displayName}</h3>
          <div>
            <p>Email: {userDetails.email}</p>
          </div>
          <button className="bg-orange-600" onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
      <div>
        <div>
          <span>
            <input type="checkbox" />
            Learn
          </span>
        </div>
        <button>Edit</button>
        <br/>
        <button>Delete</button>
      </div>
    </div>
  )
}

export default Dashboard