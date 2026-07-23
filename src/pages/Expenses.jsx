import { useState, useContext } from "react";

import MainLayout from "../layouts/MainLayout";
import Card from "../components/Card";

import FinanceContext from "../context/FinanceContext";


function Expenses(){


const {

expenseList,
addExpense

}=useContext(FinanceContext);



const [form,setForm]=useState({

category:"",
amount:"",
date:"",
description:""

});



const handleChange=(e)=>{

setForm({

...form,

[e.target.name]:e.target.value

});

};





const handleSubmit = async (e) => {
  e.preventDefault();

  const newExpense = {
    date: form.date,
    category: form.category,
    amount: Number(form.amount),
    description: form.description
  };

  try {
    await addExpense(newExpense);
    setForm({
      category: "",
      amount: "",
      date: "",
      description: ""
    });
  } catch (err) {
    console.error("Failed to add expense:", err);
    alert("Failed to add expense");
  }
};




return(

<MainLayout>


<h1 className="
text-3xl
font-bold
mb-6
">

Expense Management

</h1>





<Card>


<h2 className="
text-xl
font-bold
mb-5
">

Expense Records

</h2>




<div className="overflow-x-auto">


<table className="w-full">


<thead>

<tr className="border-b">


<th className="p-3 text-left">
Date
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

expenseList.map((item)=>(


<tr

key={item.id}

className="border-b"

>


<td className="p-3">
{new Date(item.date).toLocaleDateString()}
</td>


<td className="p-3">
{item.category}
</td>


<td className="
p-3
text-red-600
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






<div className="mt-6">


<Card>


<h2 className="
text-xl
font-bold
mb-4
">

Add Expense

</h2>




<form onSubmit={handleSubmit}>



<label
htmlFor="category"
className="font-semibold"
>
Expense Category
</label>


<input

id="category"

name="category"

value={form.category}

onChange={handleChange}

className="
border
p-3
rounded-xl
w-full
mb-3
"

placeholder="Expense Category"

/>





<label
htmlFor="amount"
className="font-semibold"
>
Amount
</label>


<input

id="amount"

name="amount"

type="number"

value={form.amount}

onChange={handleChange}

className="
border
p-3
rounded-xl
w-full
mb-3
"

placeholder="Amount"

/>





<label
htmlFor="date"
className="font-semibold"
>
Date
</label>


<input

id="date"

name="date"

type="date"

value={form.date}

onChange={handleChange}

className="
border
p-3
rounded-xl
w-full
mb-3
"

/>





<label
htmlFor="description"
className="font-semibold"
>
Description
</label>


<textarea

id="description"

name="description"

value={form.description}

onChange={handleChange}

className="
border
p-3
rounded-xl
w-full
mb-3
"

placeholder="Description"

/>





<button

type="submit"

className="
bg-red-600
text-white
px-6
py-3
rounded-xl
"

>

Add Expense

</button>


</form>



</Card>


</div>




</MainLayout>

)

}


export default Expenses;