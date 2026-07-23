import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

import ThemeContext from "../context/ThemeContext";
import AuthContext from "../context/AuthContext";


function Navbar(){


const {
darkMode,
toggleTheme
}=useContext(ThemeContext);



const {
user,
logout
}=useContext(AuthContext);



const navigate = useNavigate();



const handleLogout = ()=>{

logout();

navigate("/login");

};



return(

<nav className="
p-4
flex
justify-between
items-center
glass
rounded-xl
">


<Link to="/dashboard">

<h2 className="
text-xl
font-bold
">

MoneyMate

</h2>

</Link>




<div className="
flex
items-center
gap-4
">


{
user &&

<span className="font-semibold">

Hi, {user.name}

</span>

}




<button

onClick={toggleTheme}

className="
px-4
py-2
rounded-xl
bg-blue-600
text-white
"

>

{
darkMode
?
"☀ Light"
:
"🌙 Dark"
}

</button>




{
user &&

<button

onClick={handleLogout}

className="
px-4
py-2
rounded-xl
bg-red-600
text-white
"

>

Logout

</button>

}



</div>


</nav>


)

}


export default Navbar;