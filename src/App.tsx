import { BiTask } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";

function App() {

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="flex gap-4 font-extrabold items-center">
        <BiTask style={{ color: '#C191C2' }} />
        <p style={{ color: '#C191C2' }}>TaskBuddy</p>
      </div>
      <p>Streamline your workflow and track progress effortlessly <br /> with out all-in-one task management app.</p>
      <div className="flex items-center gap-2 p-4 text-4xl rounded-2xl mt-12" style={{ backgroundColor: "#292929" }}>
        <FcGoogle />
        <p className="text-white">Continue with Google</p>
      </div>
      
    </div>
  )
}

export default App
