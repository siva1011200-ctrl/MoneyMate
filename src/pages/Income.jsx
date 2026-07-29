import { useState, useContext } from "react";

import MainLayout from "../layouts/MainLayout";
import Card from "../components/Card";

import FinanceContext from "../context/FinanceContext";


function Income(){


const { incomeList, addIncome } = useContext(FinanceContext);


const [form,setForm] = useState({

source:"",
amount:"",
date:"",
description:""

});







// Input change

const handleChange=(e)=>{

setForm({

...form,

[e.target.name]:e.target.value

});

};




// Add income

const handleSubmit=async(e)=>{

e.preventDefault();


try{

const result = await addIncome({
  source: form.source,
  amount: Number(form.amount),
  date: form.date ? new Date(form.date + 'T00:00:00').toISOString() : new Date().toISOString(),
  description: form.description
});

if (result.success) {
  setForm({
    source:"",
    amount:"",
    date:"",
    description:""
  });
} else {
  alert(result.error);
}

}

catch(error){

console.error("Add income error:", error);
alert("Failed to add income");

}


};





return(

<MainLayout>


<h1 className="
text-2xl sm:text-3xl
font-bold
mb-4 md:mb-6
">

Income Management

</h1>





<Card>

<h2 className="
text-lg sm:text-xl
font-bold
mb-4 md:mb-5
">

Income Records

</h2>



<div className="overflow-x-auto">


<table className="w-full">


<thead>

<tr className="border-b">


<th className="p-3 text-left">
Date
</th>


<th className="p-3 text-left">
Source
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
incomeList.map((item)=>(


<tr
key={item.id}
className="border-b"
>


<td className="p-3">
{new Date(item.date).toLocaleDateString()}
</td>


<td className="p-3">
{item.source}
</td>


<td className="p-3 text-green-600 font-bold">
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





<div className="mt-4 md:mt-6">


<Card>


<h2 className="
text-lg sm:text-xl
font-bold
mb-4
">

Add Income

</h2>




<form onSubmit={handleSubmit}>


<input

name="source"

value={form.source}

onChange={handleChange}

className="border p-3 rounded-xl w-full mb-3"

placeholder="Income Source"

/>




<input

name="amount"

value={form.amount}

onChange={handleChange}

className="border p-3 rounded-xl w-full mb-3"

placeholder="Amount"

/>




<input

name="date"

type="date"

value={form.date}

onChange={handleChange}

className="border p-3 rounded-xl w-full mb-3"

placeholder="Date"

required

/>




<textarea

name="description"

value={form.description}

onChange={handleChange}

className="border p-3 rounded-xl w-full mb-3"

placeholder="Description"

/>




<button
type="submit"

className="
bg-blue-600
text-white
px-6 py-3
rounded-xl
w-full sm:w-auto
"

>

Add Income

</button>


</form>



</Card>


</div>




</MainLayout>

)

}


export default Income;
