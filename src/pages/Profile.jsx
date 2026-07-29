import { useState, useContext, useEffect } from "react";

import MainLayout from "../layouts/MainLayout";
import Card from "../components/Card";

import AuthContext from "../context/AuthContext";
import { userAPI } from "../services/api-service";


function Profile(){


const { user, setUser } = useContext(AuthContext);



const [edit,setEdit]=useState(false);
const [saving, setSaving] = useState(false);
const [saveError, setSaveError] = useState("");


const [profile,setProfile]=useState({

name:user?.name || "",

email:user?.email || "",

type:user?.type || "Student"

});

// Sync profile state when user changes
useEffect(() => {
  if (user) {
    setProfile({
      name: user.name || "",
      email: user.email || "",
      type: user.type || "Student"
    });
  }
}, [user]);





const handleChange=(e)=>{

setProfile({

...profile,

[e.target.name]:e.target.value

});

};





return(

<MainLayout>


<h1 className="
text-2xl sm:text-3xl
font-bold
mb-4 md:mb-6
">

Profile

</h1>





<Card>


<h2 className="
text-xl sm:text-2xl
font-bold
mb-4 md:mb-5
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
type="button"
onClick={async () => {
  if (!edit) {
    setEdit(true);
    return;
  }
  setSaving(true);
  setSaveError("");
  try {
    const res = await userAPI.updateProfile({
      name: profile.name,
      email: profile.email,
      type: profile.type.toLowerCase(),
    });
    // Update local user state and AuthContext
    const updatedUser = res.data;
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setEdit(false);
  } catch (err) {
    const detail = err.response?.data?.detail;
    setSaveError(Array.isArray(detail) ? detail[0]?.msg : detail || "Failed to save profile");
  } finally {
    setSaving(false);
  }
}}

className="
mt-4 md:mt-6
bg-blue-600
text-white
px-6 py-3
rounded-xl
w-full sm:w-auto
"

>

{ saveError && <p className="text-red-500 mb-2">{saveError}</p> }

{

edit
?
(saving ? "Saving..." : "Save Profile")
:
"Edit Profile"

}


</button>



</Card>






<div className="mt-4 md:mt-6">


<Card>


<h2 className="
text-lg sm:text-xl
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