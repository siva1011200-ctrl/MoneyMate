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


<div className="mb-8">

<h1 className="
text-3xl
font-bold
">

Good Morning, {user?.name || "User"} 👋

</h1>


<p className="text-gray-500 mt-2">

Here is your financial overview

</p>

</div>





<div className="
grid
md:grid-cols-4
gap-6
mb-8
">


<Card>
<h3 className="text-gray-500">
Total Income
</h3>

<p className="
text-3xl
font-bold
mt-3
text-green-600
">

₹{totalIncome}

</p>

</Card>




<Card>

<h3 className="text-gray-500">
Total Expenses
</h3>

<p className="
text-3xl
font-bold
mt-3
text-red-600
">

₹{totalExpense}

</p>

</Card>




<Card>

<h3 className="text-gray-500">
Total Savings
</h3>

<p className="
text-3xl
font-bold
mt-3
text-blue-600
">

₹{totalSavings}

</p>

</Card>




<Card>

<h3 className="text-gray-500">
Savings Percentage
</h3>

<p className="
text-3xl
font-bold
mt-3
">

{savingsPercentage}%

</p>

</Card>



</div>





<Card>

<h2 className="
text-xl
font-bold
mb-4
">

Monthly Summary

</h2>


<div className="
grid
md:grid-cols-3
gap-5
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





<div className="mt-8">


<Card>

<h2 className="
text-xl
font-bold
mb-5
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