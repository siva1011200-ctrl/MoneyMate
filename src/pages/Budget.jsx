import { useContext, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import Card from "../components/Card";

import FinanceContext from "../context/FinanceContext";


function Budget(){


const { budgetList, addBudget } = useContext(FinanceContext);


const [form, setForm] = useState({
  category: "",
  limit: "",
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear()
});


const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value
  });
};


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const result = await addBudget({
      category: form.category,
      limit: Number(form.limit),
      month: Number(form.month),
      year: Number(form.year)
    });

    if (result.success) {
      setForm({
        category: "",
        limit: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      });
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.log(error);
    alert("Failed to add budget");
  }
};



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



<div className="mt-6">

<Card>

<h2 className="
text-xl
font-bold
mb-4
">

Add Budget

</h2>



<form onSubmit={handleSubmit}>

<input
name="category"
value={form.category}
onChange={handleChange}
className="border p-3 rounded-xl w-full mb-3"
placeholder="Budget Category"
/>



<input
name="limit"
value={form.limit}
onChange={handleChange}
type="number"
className="border p-3 rounded-xl w-full mb-3"
placeholder="Budget Limit"
/>



<input
name="month"
value={form.month}
onChange={handleChange}
type="number"
min="1"
max="12"
className="border p-3 rounded-xl w-full mb-3"
placeholder="Month (1-12)"
/>



<input
name="year"
value={form.year}
onChange={handleChange}
type="number"
min="2000"
max="2100"
className="border p-3 rounded-xl w-full mb-3"
placeholder="Year"
/>



<button
type="submit"
className="
bg-blue-600
text-white
px-6
py-3
rounded-xl
"

>

Add Budget

</button>



</form>



</Card>


</div>



</MainLayout>

)

}


export default Budget;