import { useContext } from "react";

import MainLayout from "../layouts/MainLayout";
import Card from "../components/Card";

import FinanceContext from "../context/FinanceContext";


import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";



function Analytics(){


const {

incomeList,
expenseList

} = useContext(FinanceContext);





// ===============================
// Income vs Expense Monthly Data
// ===============================


const monthlyData = {};



incomeList.forEach((item)=>{


const month =
new Date(item.date)
.toLocaleString(
"default",
{
month:"short"
}
);



if(!monthlyData[month]){

monthlyData[month]={
month,
income:0,
expense:0
};

}


monthlyData[month].income +=
Number(item.amount);


});





expenseList.forEach((item)=>{


const month =
new Date(item.date)
.toLocaleString(
"default",
{
month:"short"
}
);



if(!monthlyData[month]){

monthlyData[month]={
month,
income:0,
expense:0
};

}



monthlyData[month].expense +=
Number(item.amount);


});




const monthlyAnalytics =
Object.values(monthlyData);







// ===============================
// Expense Category Data
// ===============================


const categoryData={};



expenseList.forEach((item)=>{


if(!categoryData[item.category]){

categoryData[item.category]=0;

}


categoryData[item.category]+=Number(item.amount);


});




const expenseCategoryData =
Object.keys(categoryData)
.map((category)=>(

{
name:category,
value:categoryData[category]
}

));





return(

<MainLayout>


<h1 className="
text-3xl
font-bold
mb-6
">

Financial Analytics

</h1>





<div className="
grid
md:grid-cols-2
gap-6
">





{/* Income Expense Chart */}

<Card>

<h2 className="
text-xl
font-bold
mb-5
">

Income vs Expense

</h2>



<ResponsiveContainer
width="100%"
height={300}
>


<BarChart data={monthlyAnalytics}>


<XAxis dataKey="month"/>

<YAxis/>

<Tooltip/>


<Bar
dataKey="income"
/>


<Bar
dataKey="expense"
/>


</BarChart>


</ResponsiveContainer>


</Card>







{/* Savings Growth */}


<Card>


<h2 className="
text-xl
font-bold
mb-5
">

Savings Growth

</h2>



<ResponsiveContainer
width="100%"
height={300}
>


<LineChart data={monthlyAnalytics}>


<XAxis dataKey="month"/>

<YAxis/>

<Tooltip/>


<Line

type="monotone"

dataKey="income"

/>


</LineChart>


</ResponsiveContainer>


</Card>








{/* Expense Category */}



<Card>


<h2 className="
text-xl
font-bold
mb-5
">

Expense Categories

</h2>




<ResponsiveContainer
width="100%"
height={300}
>


<PieChart>


<Pie

data={expenseCategoryData}

dataKey="value"

nameKey="name"

outerRadius={100}

label

>


{

expenseCategoryData.map(
(item,index)=>(

<Cell key={index}/>

)

)

}


</Pie>


<Tooltip/>


</PieChart>


</ResponsiveContainer>


</Card>





</div>


</MainLayout>

)


}



export default Analytics;