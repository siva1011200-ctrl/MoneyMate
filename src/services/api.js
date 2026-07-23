const API_URL = "http://localhost:8000";


// Authentication

export const registerUser = async(data)=>{

const response = await fetch(
`${API_URL}/register`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(data)
}
);

return response.json();

};



export const loginUser = async(data)=>{

const response = await fetch(
`${API_URL}/login`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(data)
}
);

return response.json();

};





// Dashboard

export const getDashboard = async()=>{

const response = await fetch(
`${API_URL}/dashboard`
);

return response.json();

};





// Income

export const getIncome = async()=>{

const response = await fetch(
`${API_URL}/income`
);

return response.json();

};



export const addIncome = async(data)=>{

const response = await fetch(
`${API_URL}/income`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(data)
}
);

return response.json();

};





// Expenses

export const getExpenses = async()=>{

const response = await fetch(
`${API_URL}/expenses`
);

return response.json();

};



export const addExpense = async(data)=>{

const response = await fetch(
`${API_URL}/expenses`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(data)
}
);

return response.json();

};





// Transactions

export const getTransactions = async()=>{

const response = await fetch(
`${API_URL}/transactions`
);

return response.json();

};