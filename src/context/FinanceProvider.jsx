import { useState, useEffect, useContext } from "react";
import FinanceContext from "./FinanceContext";
import AuthContext from "./AuthContext";
import { incomeAPI, expenseAPI, budgetAPI, savingsAPI, dashboardAPI } from "../services/api-service";
import { handleApiError } from "../utils/apiErrorHandler";

function FinanceProvider({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [transactionList, setTransactionList] = useState([]);
  const [budgetList, setBudgetList] = useState([]);
  const [savingsGoalList, setSavingsGoalList] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [operationLoading, setOperationLoading] = useState({});

  // Fetch all data when user authenticates
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    } else {
      // Clear data when user logs out
      setIncomeList([]);
      setExpenseList([]);
      setTransactionList([]);
      setBudgetList([]);
      setSavingsGoalList([]);
    }
  }, [isAuthenticated]);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [incomeRes, expenseRes, budgetRes, savingsRes] = await Promise.all([
        incomeAPI.list(1, 100),
        expenseAPI.list(1, 100),
        budgetAPI.list(),
        savingsAPI.list()
      ]);

      setIncomeList(incomeRes.data?.items || []);
      setExpenseList(expenseRes.data?.items || []);
      setBudgetList(budgetRes.data || []);
      setSavingsGoalList(savingsRes.data || []);
      
      // Combine income and expenses for transactions
      const transactions = [
        ...(incomeRes.data?.items || []).map(item => ({ ...item, type: 'Income' })),
        ...(expenseRes.data?.items || []).map(item => ({ ...item, type: 'Expense' }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactionList(transactions);
      
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error("Error fetching financial data:", err);
    }
    setLoading(false);
  };

  const setOpLoading = (operation, isLoading) => {
    setOperationLoading(prev => ({ ...prev, [operation]: isLoading }));
  };

  // INCOME OPERATIONS
  const addIncome = async (incomeData) => {
    setOpLoading('addIncome', true);
    try {
      const res = await incomeAPI.create(incomeData);
      setIncomeList([...incomeList, res.data]);
      return { success: true, data: res.data };
    } catch (err) {
      const errorMessage = handleApiError(err);
      return { success: false, error: errorMessage };
    } finally {
      setOpLoading('addIncome', false);
    }
  };

  const updateIncome = async (id, data) => {
    setOpLoading('updateIncome', true);
    try {
      const res = await incomeAPI.update(id, data);
      setIncomeList(incomeList.map(item => item.id === id ? res.data : item));
      return { success: true, data: res.data };
    } catch (err) {
      const errorMessage = handleApiError(err);
      return { success: false, error: errorMessage };
    } finally {
      setOpLoading('updateIncome', false);
    }
  };

  const deleteIncome = async (id) => {
    setOpLoading('deleteIncome', true);
    try {
      await incomeAPI.delete(id);
      setIncomeList(incomeList.filter(item => item.id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = handleApiError(err);
      return { success: false, error: errorMessage };
    } finally {
      setOpLoading('deleteIncome', false);
    }
  };

  // EXPENSE OPERATIONS
  const addExpense = async (expenseData) => {
    setOpLoading('addExpense', true);
    try {
      const res = await expenseAPI.create(expenseData);
      setExpenseList([...expenseList, res.data]);
      return { success: true, data: res.data };
    } catch (err) {
      const errorMessage = handleApiError(err);
      return { success: false, error: errorMessage };
    } finally {
      setOpLoading('addExpense', false);
    }
  };

  const updateExpense = async (id, data) => {
    setOpLoading('updateExpense', true);
    try {
      const res = await expenseAPI.update(id, data);
      setExpenseList(expenseList.map(item => item.id === id ? res.data : item));
      return { success: true, data: res.data };
    } catch (err) {
      const errorMessage = handleApiError(err);
      return { success: false, error: errorMessage };
    } finally {
      setOpLoading('updateExpense', false);
    }
  };

  const deleteExpense = async (id) => {
    setOpLoading('deleteExpense', true);
    try {
      await expenseAPI.delete(id);
      setExpenseList(expenseList.filter(item => item.id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = handleApiError(err);
      return { success: false, error: errorMessage };
    } finally {
      setOpLoading('deleteExpense', false);
    }
  };

  // BUDGET OPERATIONS
  const addBudget = async (budgetData) => {
    setOpLoading('addBudget', true);
    try {
      const res = await budgetAPI.create(budgetData);
      setBudgetList([...budgetList, res.data]);
      return { success: true, data: res.data };
    } catch (err) {
      const errorMessage = handleApiError(err);
      return { success: false, error: errorMessage };
    } finally {
      setOpLoading('addBudget', false);
    }
  };

  const updateBudget = async (id, data) => {
    setOpLoading('updateBudget', true);
    try {
      const res = await budgetAPI.update(id, data);
      setBudgetList(budgetList.map(item => item.id === id ? res.data : item));
      return { success: true, data: res.data };
    } catch (err) {
      const errorMessage = handleApiError(err);
      return { success: false, error: errorMessage };
    } finally {
      setOpLoading('updateBudget', false);
    }
  };

  const deleteBudget = async (id) => {
    setOpLoading('deleteBudget', true);
    try {
      await budgetAPI.delete(id);
      setBudgetList(budgetList.filter(item => item.id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = handleApiError(err);
      return { success: false, error: errorMessage };
    } finally {
      setOpLoading('deleteBudget', false);
    }
  };

  // SAVINGS GOALS OPERATIONS
  const addSavingsGoal = async (goalData) => {
    setOpLoading('addSavingsGoal', true);
    try {
      const res = await savingsAPI.create(goalData);
      setSavingsGoalList([...savingsGoalList, res.data]);
      return { success: true, data: res.data };
    } catch (err) {
      const errorMessage = handleApiError(err);
      return { success: false, error: errorMessage };
    } finally {
      setOpLoading('addSavingsGoal', false);
    }
  };

  const updateSavingsGoal = async (id, data) => {
    setOpLoading('updateSavingsGoal', true);
    try {
      const res = await savingsAPI.update(id, data);
      setSavingsGoalList(savingsGoalList.map(item => item.id === id ? res.data : item));
      return { success: true, data: res.data };
    } catch (err) {
      const errorMessage = handleApiError(err);
      return { success: false, error: errorMessage };
    } finally {
      setOpLoading('updateSavingsGoal', false);
    }
  };

  const deleteSavingsGoal = async (id) => {
    setOpLoading('deleteSavingsGoal', true);
    try {
      await savingsAPI.delete(id);
      setSavingsGoalList(savingsGoalList.filter(item => item.id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = handleApiError(err);
      return { success: false, error: errorMessage };
    } finally {
      setOpLoading('deleteSavingsGoal', false);
    }
  };

  const value = {
    // Data
    incomeList,
    expenseList,
    transactionList,
    budgetList,
    savingsGoalList,
    loading,
    error,
    operationLoading,
    
    // Income operations
    addIncome,
    updateIncome,
    deleteIncome,
    
    // Expense operations
    addExpense,
    updateExpense,
    deleteExpense,
    
    // Budget operations
    addBudget,
    updateBudget,
    deleteBudget,
    
    // Savings goals operations
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    
    // Utilities
    fetchAllData
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export default FinanceProvider;
