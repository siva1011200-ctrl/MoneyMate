import { useContext } from "react";

import MainLayout from "../layouts/MainLayout";
import Card from "../components/Card";

import FinanceContext from "../context/FinanceContext";


function SavingsGoals(){


const { savingsGoalList } = useContext(FinanceContext);



return(

<MainLayout>


<h1 className="
text-3xl
font-bold
mb-6
">

Savings Goals

</h1>





<div className="
grid
md:grid-cols-2
gap-6
">


{

savingsGoalList.map((goal)=>(


<Card key={goal.id}>


<h2 className="
text-xl
font-bold
mb-3
">

{goal.goal}

</h2>



<p>

Saved: ₹{goal.saved}

</p>



<p>

Target: ₹{goal.target}

</p>





<div className="
w-full
bg-gray-200
rounded-full
h-3
mt-4
">


<div

className="
bg-green-600
h-3
rounded-full
"

style={{

width:`${(goal.saved / goal.target) * 100}%`

}}

>

</div>


</div>




<p className="
mt-3
font-bold
">

{
Math.round(
(goal.saved / goal.target) * 100
)
}%

Completed

</p>



</Card>


))


}


</div>




</MainLayout>

)

}


export default SavingsGoals;