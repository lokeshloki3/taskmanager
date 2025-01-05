import { BiTask } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../components/firebaseConfig";
import mainimg from "../assets/mainimg.png"

const Home = () => {
    console.log(mainimg)

    const handleClick = () => {
        signInWithPopup(auth, provider).then(async (data) => {
            console.log(data);
            if (data.user) {
                window.location.href = "/dashboard";
            }
        })
    }

    return (
        <div className="flex justify-around">
            <div className="flex flex-col justify-center items-center h-screen gap-4">
                <div className="flex gap-4 font-extrabold ml-0">
                    <BiTask style={{ color: '#C191C2' }} className="text-6xl"/>
                    <p style={{ color: '#C191C2' }} className="text-6xl">TaskBuddy</p>
                </div>
                <p>Streamline your workflow and track progress effortlessly <br /> with out all-in-one task management app.</p>
                <div className="flex items-center gap-2 p-4 text-4xl rounded-2xl mt-12" style={{ backgroundColor: "#292929" }}>
                    <button className="text-white flex gap-2 items-center" onClick={handleClick}> <FcGoogle /> Continue with Google</button>
                </div>
            </div>
            <img src={mainimg} alt="main image" className=" max-w-[600px] w-full h-auto"/>
        </div>
    )
}

export default Home;