import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Card from "../components/Card";


function Landing(){

return(

<div className="
min-h-screen
bg-gradient-to-br
from-blue-50
to-indigo-100
p-4 sm:p-6
">


{/* Hero Section */}

<section className="
max-w-6xl
mx-auto
grid
grid-cols-1
md:grid-cols-2
gap-6 md:gap-10
items-center
py-12 md:py-20
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
text-3xl sm:text-4xl md:text-5xl
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
mt-4 md:mt-6
text-base md:text-lg
text-gray-600
">

Manage income, expenses, savings,
budgets and financial goals in one
powerful platform.

</p>



<div className="
flex
flex-col sm:flex-row
gap-3 sm:gap-4
mt-6 md:mt-8
">


<Link to="/register">

<button className="
bg-blue-600
text-white
px-6 sm:px-8
py-3
rounded-xl
hover:scale-105
transition
w-full sm:w-auto
">

Get Started

</button>

</Link>



<Link to="/login">

<button className="
border
border-blue-600
px-6 sm:px-8
py-3
rounded-xl
w-full sm:w-auto
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
p-6 sm:p-8 md:p-10
text-center
"

>


<div className="
text-5xl sm:text-6xl md:text-7xl
">

💰

</div>


<h2 className="
text-xl sm:text-2xl
font-bold
mt-4 md:mt-5
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
py-8 md:py-10
">


<h2 className="
text-2xl sm:text-3xl
font-bold
text-center
mb-6 md:mb-10
">

Powerful Features

</h2>



<div className="
grid
grid-cols-1
sm:grid-cols-2
md:grid-cols-3
gap-4 md:gap-6
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
py-8 md:py-10
">


<h2 className="
text-2xl sm:text-3xl
font-bold
text-center
mb-6 md:mb-10
">

Built For Everyone

</h2>



<div className="
grid
grid-cols-1
sm:grid-cols-2
md:grid-cols-3
gap-4 md:gap-6
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
py-12 md:py-20
text-center
">


<div className="
glass
rounded-3xl
p-6 sm:p-8 md:p-10
">


<h2 className="
text-2xl sm:text-3xl md:text-4xl
font-bold
">

Start Managing Your Money Today

</h2>


<Link to="/register">


<button className="
mt-4 md:mt-6
bg-blue-600
text-white
px-6 sm:px-8 md:px-10
py-3
rounded-xl
w-full sm:w-auto
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