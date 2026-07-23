import { useState, useContext } from "react";

import MainLayout from "../layouts/MainLayout";
import Card from "../components/Card";

import AuthContext from "../context/AuthContext";


function Profile(){


const { user } = useContext(AuthContext);



const [edit,setEdit]=useState(false);



const [profile,setProfile]=useState({

name:user?.name || "",

email:user?.email || "",

type:user?.type || "Student"

});





const handleChange=(e)=>{

setProfile({

...profile,

[e.target.name]:e.target.value

});

};





return(

<MainLayout>


<h1 className="
text-3xl
font-bold
mb-6
">

Profile

</h1>





<Card>


<h2 className="
text-2xl
font-bold
mb-5
">

User Information

</h2>





<div className="space-y-4">



<div>

<label
htmlFor="name"
className="font-semibold"
>

Full Name

</label>


<input

id="name"

name="name"

autoComplete="name"

disabled={!edit}

className="
border
p-3
rounded-xl
w-full
mt-2
"

value={profile.name}

onChange={handleChange}

/>

</div>






<div>

<label
htmlFor="email"
className="font-semibold"
>

Email

</label>


<input

id="email"

name="email"

type="email"

autoComplete="email"

disabled={!edit}

className="
border
p-3
rounded-xl
w-full
mt-2
"

value={profile.email}

onChange={handleChange}

/>


</div>







<div>

<label
htmlFor="type"
className="font-semibold"
>

User Type

</label>



<select

id="type"

name="type"

disabled={!edit}

className="
border
p-3
rounded-xl
w-full
mt-2
"

value={profile.type}

onChange={handleChange}

>


<option>
Student
</option>


<option>
Employee
</option>


<option>
Freelancer
</option>


</select>


</div>



</div>






<button

onClick={()=>setEdit(!edit)}

className="
mt-6
bg-blue-600
text-white
px-6
py-3
rounded-xl
"

>

{

edit
?
"Save Profile"
:
"Edit Profile"

}


</button>



</Card>






<div className="mt-6">


<Card>


<h2 className="
text-xl
font-bold
mb-4
">

Account Settings

</h2>



<p>
✓ Email notifications enabled
</p>


<p>
✓ Secure account
</p>


<p>
✓ Data backup ready
</p>


</Card>


</div>





</MainLayout>

)

}


export default Profile;