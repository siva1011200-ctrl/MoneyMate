import { useContext, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import Card from "../components/Card";

import FinanceContext from "../context/FinanceContext";


function SavingsGoals(){


const { savingsGoalList, addSavingsGoal } = useContext(FinanceContext);


const [form, setForm] = useState({
  goal: "",
  target: "",
  saved: "0"
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
    const result = await addSavingsGoal({
      goal: form.goal,
      target: Number(form.target),
      saved: Number(form.saved)
    });

    if (result.success) {
      setForm({
        goal: "",
        target: "",
        saved: "0"
      });
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.log(error);
    alert("Failed to add savings goal");
  }
};



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




<div className="mt-6">

<Card>

<h2 className="
text-xl
font-bold
mb-4
">

Add Savings Goal

</h2>



<form onSubmit={handleSubmit}>

<input
name="goal"
value={form.goal}
onChange={handleChange}
className="border p-3 rounded-xl w-full mb-3"
placeholder="Savings Goal Name"
/>



<input
name="target"
value={form.target}
onChange={handleChange}
type="number"
className="border p-3 rounded-xl w-full mb-3"
placeholder="Target Amount"
/>



<input
name="saved"
value={form.saved}
onChange={handleChange}
type="number"
className="border p-3 rounded-xl w-full mb-3"
placeholder="Already Saved (optional)"
/>



<button
type="submit"
className="
bg-green-600
text-white
px-6
py-3
rounded-xl
"

>

Add Savings Goal

</button>



</form>



</Card>


</div>




</MainLayout>

)

}


export default SavingsGoals;