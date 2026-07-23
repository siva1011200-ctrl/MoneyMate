import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Card from "../components/Card";


function Landing(){

return(

<div className="
min-h-screen
bg-linear-to-br
from-blue-50
to-indigo-100
p-6
">


{/* Hero Section */}

<section className="
max-w-6xl
mx-auto
grid
md:grid-cols-2
gap-10
items-center
py-20
">


<motion.div

initial={{
opacity:0,
x:-50
}}

animate={{
opacity:1,
x:0
}}

transition={{
duration:0.6
}}

>


<h1 className="
text-5xl
font-bold
leading-tight
">

Take Control of Your Money with

<span className="
text-blue-600
">
 MoneyMate
</span>

</h1>


<p className="
mt-6
text-lg
text-gray-600
">

Manage income, expenses, savings,
budgets and financial goals in one
powerful platform.

</p>



<div className="
flex
gap-4
mt-8
">


<Link to="/register">

<button className="
bg-blue-600
text-white
px-8
py-3
rounded-xl
hover:scale-105
transition
">

Get Started

</button>

</Link>



<Link to="/login">

<button className="
border
border-blue-600
px-8
py-3
rounded-xl
">

Login

</button>

</Link>


</div>


</motion.div>





<motion.div

animate={{
y:[0,-20,0]
}}

transition={{
duration:3,
repeat:Infinity
}}

className="
glass
rounded-3xl
p-10
text-center
"

>


<div className="
text-7xl
">

💰

</div>


<h2 className="
text-2xl
font-bold
mt-5
">

Smart Finance Dashboard

</h2>


<p className="mt-3">

Track every rupee easily.

</p>


</motion.div>


</section>





{/* Features */}

<section className="
max-w-6xl
mx-auto
py-10
">


<h2 className="
text-3xl
font-bold
text-center
mb-10
">

Powerful Features

</h2>



<div className="
grid
md:grid-cols-3
gap-6
">


<Card>

<h3 className="text-xl font-bold">
Income Tracking
</h3>

<p>
Monitor all income sources.
</p>

</Card>



<Card>

<h3 className="text-xl font-bold">
Expense Control
</h3>

<p>
Understand your spending habits.
</p>

</Card>




<Card>

<h3 className="text-xl font-bold">
Financial Analytics
</h3>

<p>
Visualize your money growth.
</p>

</Card>



</div>


</section>






{/* User Categories */}

<section className="
max-w-6xl
mx-auto
py-10
">


<h2 className="
text-3xl
font-bold
text-center
mb-10
">

Built For Everyone

</h2>



<div className="
grid
md:grid-cols-3
gap-6
">


<Card>

<h3 className="text-xl font-bold">
🎓 Students
</h3>

<p>
Manage allowance and savings.
</p>

</Card>



<Card>

<h3 className="text-xl font-bold">
💼 Employees
</h3>

<p>
Track salary and expenses.
</p>

</Card>



<Card>

<h3 className="text-xl font-bold">
🚀 Freelancers
</h3>

<p>
Manage projects and income.
</p>

</Card>



</div>


</section>







{/* CTA */}

<section className="
max-w-6xl
mx-auto
py-20
text-center
">


<div className="
glass
rounded-3xl
p-10
">


<h2 className="
text-4xl
font-bold
">

Start Managing Your Money Today

</h2>


<Link to="/register">


<button className="
mt-6
bg-blue-600
text-white
px-10
py-3
rounded-xl
">

Create Free Account

</button>


</Link>


</div>


</section>




</div>


)

}


export default Landing;