import { useContext } from "react";

import MainLayout from "../layouts/MainLayout";
import Card from "../components/Card";

import FinanceContext from "../context/FinanceContext";


function Budget(){


const { budgetList } = useContext(FinanceContext);



return(

<MainLayout>


<h1 className="
text-3xl
font-bold
mb-6
">

Budget Planner

</h1>




<Card>


<h2 className="
text-xl
font-bold
mb-5
">

Monthly Budgets

</h2>



<div className="
grid
md:grid-cols-3
gap-6
">


{
budgetList.map((item)=>(


<Card key={item.category}>


<h3 className="
text-xl
font-bold
mb-3
">

{item.category}

</h3>



<p>

₹{item.spent} / ₹{item.limit}

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
bg-blue-600
h-3
rounded-full
"

style={{

width:`${(item.spent/item.limit)*100}%`

}}

>

</div>


</div>





<p className="
mt-3
text-sm
"
>

{
(item.spent/item.limit)*100 >= 80

?

"⚠️ Budget limit reached"

:

"✅ Within budget"

}

</p>



</Card>


))

}


</div>



</Card>



</MainLayout>

)

}


export default Budget;