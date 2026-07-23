import { useState, useContext } from "react";

import MainLayout from "../layouts/MainLayout";
import Card from "../components/Card";

import FinanceContext from "../context/FinanceContext";


function Transactions(){


const {
  incomeList,
  expenseList
} = useContext(FinanceContext);




const [search,setSearch] = useState("");

const [filter,setFilter] = useState("All");




// Create real transaction list

const transactionList = [

...incomeList.map((item)=>(

{
id:item.id,
date:item.date,
type:"Income",
category:item.category || "Income",
amount:item.amount,
description:item.description || "Income added"

}

)),


...expenseList.map((item)=>(

{
id:item.id,
date:item.date,
type:"Expense",
category:item.category || "Expense",
amount:item.amount,
description:item.description || "Expense added"

}

))

];



// Sort latest first

transactionList.sort(
(a,b)=>
new Date(b.date)-new Date(a.date)
);





const filteredTransactions = transactionList.filter((item)=>{


const searchMatch =

item.category
.toLowerCase()
.includes(search.toLowerCase())

||

item.description
.toLowerCase()
.includes(search.toLowerCase());



const filterMatch =

filter === "All"

||

item.type === filter;



return searchMatch && filterMatch;


});





return(

<MainLayout>


<h1 className="
text-3xl
font-bold
mb-6
">

Transaction History

</h1>



<Card>


<div className="
flex
flex-col
md:flex-row
gap-4
mb-6
">


<input

className="
border
p-3
rounded-xl
flex-1
"

placeholder="Search transactions..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>




<select

className="
border
p-3
rounded-xl
"

value={filter}

onChange={(e)=>setFilter(e.target.value)}

>


<option value="All">
All
</option>


<option value="Income">
Income
</option>


<option value="Expense">
Expense
</option>


</select>


</div>





<div className="overflow-x-auto">


<table className="w-full">


<thead>

<tr className="border-b">


<th className="p-3 text-left">
Date
</th>


<th className="p-3 text-left">
Type
</th>


<th className="p-3 text-left">
Category
</th>


<th className="p-3 text-left">
Amount
</th>


<th className="p-3 text-left">
Description
</th>


</tr>


</thead>




<tbody>


{
filteredTransactions.map((item)=>(


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
{item.category}
</td>


<td className="
p-3
font-bold
">

₹{item.amount}

</td>


<td className="p-3">
{item.description}
</td>


</tr>


))

}



</tbody>


</table>


</div>



</Card>



</MainLayout>

)

}


export default Transactions;