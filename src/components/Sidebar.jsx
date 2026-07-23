import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
Home,
Wallet,
Receipt,
PiggyBank,
ChartBar,
List,
User,
Menu,
X
} from "lucide-react";


function Sidebar(){


const [open,setOpen]=useState(false);



const menu=[

{
name:"Dashboard",
path:"/dashboard",
icon:<Home/>
},

{
name:"Income",
path:"/income",
icon:<Wallet/>
},

{
name:"Expenses",
path:"/expenses",
icon:<Receipt/>
},

{
name:"Budget",
path:"/budget",
icon:<PiggyBank/>
},

{
name:"Savings Goals",
path:"/savings-goals",
icon:<PiggyBank/>
},

{
name:"Analytics",
path:"/analytics",
icon:<ChartBar/>
},

{
name:"Transactions",
path:"/transactions",
icon:<List/>
},

{
name:"Profile",
path:"/profile",
icon:<User/>
}

];



return(

<>

{/* Mobile Button */}

<button

onClick={()=>setOpen(!open)}

className="
md:hidden
fixed
top-4
left-4
z-50
glass
p-3
rounded-xl
"

>

{
open
?
<X/>
:
<Menu/>
}

</button>





{/* Sidebar */}

<aside

className={

`

fixed
md:static
top-0
left-0
h-screen
w-64
glass
p-5
z-40
transition-transform
duration-300

${open
?
"translate-x-0"
:
"-translate-x-full md:translate-x-0"
}

`

}

>



<h1 className="
text-2xl
font-bold
mb-8
">

💰 MoneyMate

</h1>



<nav className="space-y-3">


{

menu.map((item)=>(


<NavLink

key={item.path}

to={item.path}

onClick={()=>setOpen(false)}

className={({isActive})=>

`

flex
items-center
gap-3
p-3
rounded-xl
transition

${isActive
?
"bg-blue-600 text-white"
:
"hover:bg-blue-100"
}

`

}

>


{item.icon}

<span>
{item.name}
</span>


</NavLink>


))

}


</nav>


</aside>


</>

)

}


export default Sidebar;