import { useContext } from "react";

import MainLayout from "../layouts/MainLayout";
import Card from "../components/Card";

import AuthContext from "../context/AuthContext";
import FinanceContext from "../context/FinanceContext";


function Dashboard(){


const {user}=useContext(AuthContext);


const {

transactionList,
incomeList,
expenseList

}=useContext(FinanceContext);



const totalIncome = incomeList.reduce(
(sum,item)=>sum + Number(item.amount),
0
);



const totalExpense = expenseList.reduce(
(sum,item)=>sum + Number(item.amount),
0
);



const totalSavings = totalIncome - totalExpense;



const savingsPercentage = totalIncome
?
Math.round(
(totalSavings / totalIncome) * 100
)
:
0;



return(

<MainLayout>


<div className="mb-6 md:mb-8">

<h1 className="
text-2xl sm:text-3xl
font-bold
">

{user?.name || "User"} 👋

</h1>


<p className="text-gray-500 mt-2">

Here is your financial overview

</p>

</div>





<div className="
grid
grid-cols-2
sm:grid-cols-3
md:grid-cols-4
gap-4 md:gap-6
mb-6 md:mb-8
">


<Card>
<h3 className="text-gray-500 text-sm md:text-base">
Total Income
</h3>

<p className="
text-2xl md:text-3xl
font-bold
mt-2 md:mt-3
text-green-600
">

₹{totalIncome}

</p>

</Card>




<Card>

<h3 className="text-gray-500 text-sm md:text-base">
Total Expenses
</h3>

<p className="
text-2xl md:text-3xl
font-bold
mt-2 md:mt-3
text-red-600
">

₹{totalExpense}

</p>

</Card>




<Card>

<h3 className="text-gray-500 text-sm md:text-base">
Total Savings
</h3>

<p className="
text-2xl md:text-3xl
font-bold
mt-2 md:mt-3
text-blue-600
">

₹{totalSavings}

</p>

</Card>




<Card>

<h3 className="text-gray-500 text-sm md:text-base">
Savings Percentage
</h3>

<p className="
text-2xl md:text-3xl
font-bold
mt-2 md:mt-3
">

{savingsPercentage}%

</p>

</Card>



</div>





<Card>

<h2 className="
text-lg sm:text-xl
font-bold
mb-3 md:mb-4
">

Monthly Summary

</h2>


<div className="
grid
grid-cols-1
sm:grid-cols-2
md:grid-cols-3
gap-4 md:gap-5
">


<div>

<p className="text-gray-500">
Income
</p>

<h3 className="text-2xl font-bold">
₹{totalIncome}
</h3>

</div>


<div>

<p className="text-gray-500">
Expenses
</p>

<h3 className="text-2xl font-bold">
₹{totalExpense}
</h3>

</div>


<div>

<p className="text-gray-500">
Saved
</p>

<h3 className="text-2xl font-bold">
₹{totalSavings}
</h3>

</div>


</div>

</Card>





<div className="mt-6 md:mt-8">


<Card>

<h2 className="
text-lg sm:text-xl
font-bold
mb-4 md:mb-5
">

Recent Transactions

</h2>



<div className="overflow-x-auto">


<table className="w-full">


<thead>

<tr className="border-b">

<th className="text-left p-3">
Date
</th>

<th className="text-left p-3">
Type
</th>

<th className="text-left p-3">
Category
</th>

<th className="text-left p-3">
Amount
</th>

</tr>

</thead>




<tbody>


{

transactionList.map((item)=>(

<tr
key={item.id}
className="border-b"
>


<td className="p-3">
{item.date}
</td>


<td className="p-3">
{item.type}
</td>


<td className="p-3">
{item.category || item.source}
</td>


<td className="p-3">
₹{item.amount}
</td>


</tr>

))

}


</tbody>


</table>


</div>


</Card>


</div>




</MainLayout>

)

}


export default Dashboard;