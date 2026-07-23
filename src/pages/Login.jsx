import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import AuthContext from "../context/AuthContext";

function Login(){

const { loginWithCredentials, loading, error } = useContext(AuthContext);

const navigate = useNavigate();


const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [localError, setLocalError] = useState("");


const handleSubmit = async(e)=>{

e.preventDefault();
setLocalError("");

if (!email || !password) {
  setLocalError("Please fill in all fields");
  return;
}

const result = await loginWithCredentials(email, password);
if (result.success) {
  navigate("/dashboard");
} else {
  setLocalError(result.error);
}
};



return(

<div className="
min-h-screen
flex
items-center
justify-center
bg-linear-to-br
from-blue-100
to-indigo-200
p-6
">


<motion.div

initial={{
opacity:0,
y:40
}}

animate={{
opacity:1,
y:0
}}

className="
glass
rounded-3xl
p-8
w-full
max-w-md
"

>


<h1 className="
text-3xl
font-bold
text-center
mb-6
">

Welcome Back

</h1>



<form onSubmit={handleSubmit}>


{error && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
    {error}
  </div>
)}

{localError && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
    {localError}
  </div>
)}

<label className="font-semibold">
Email
</label>

<input

type="email"

className="w-full border p-3 rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
disabled={loading}
/>


<label className="font-semibold">
Password
</label>

<input
type="password"
className="w-full border p-3 rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
disabled={loading}
/>




<button

type="submit"

disabled={loading}

className="
w-full
bg-blue-600
text-white
py-3
rounded-xl
hover:scale-105
transition
disabled:opacity-50
disabled:cursor-not-allowed
disabled:hover:scale-100
"

>

{loading ? "Logging in..." : "Login"}

</button>



</form>




<p className="
text-center
mt-5
">

Don't have an account?


<Link

to="/register"

className="
text-blue-600
ml-2
font-bold
"

>

Register

</Link>


</p>



</motion.div>


</div>

);

}


export default Login;