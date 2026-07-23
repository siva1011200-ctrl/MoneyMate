import API from "../api/axios";

// ==================== USERS ====================
export const userAPI = {
  login: (data) => API.post("/users/login", data),
  register: (data) => API.post("/users/register", data),
  getProfile: () => API.get("/users/me"),
  updateProfile: (data) => API.put("/users/me", data),
  changePassword: (data) => API.post("/users/change-password", data),
};

// ==================== DASHBOARD ====================
export const dashboardAPI = {
  getSummary: (month, year) => {
    const params = {};
    if (month) params.month = month;
    if (year) params.year = year;
    return API.get("/dashboard/summary", { params });
  },
};

// ==================== INCOME ====================
export const incomeAPI = {
  list: (page = 1, pageSize = 20, dateFrom = null, dateTo = null) => {
    const params = { page, page_size: pageSize };
    if (dateFrom) params.date_from = dateFrom;
    if (dateTo) params.date_to = dateTo;
    return API.get("/income", { params });
  },
  create: (data) => API.post("/income", data),
  get: (id) => API.get(`/income/${id}`),
  update: (id, data) => API.put(`/income/${id}`, data),
  delete: (id) => API.delete(`/income/${id}`),
};

// ==================== EXPENSES ====================
export const expenseAPI = {
  categories: () => API.get("/expenses/categories"),
  list: (page = 1, pageSize = 20, dateFrom = null, dateTo = null, category = null) => {
    const params = { page, page_size: pageSize };
    if (dateFrom) params.date_from = dateFrom;
    if (dateTo) params.date_to = dateTo;
    if (category) params.category = category;
    return API.get("/expenses", { params });
  },
  create: (data) => API.post("/expenses", data),
  get: (id) => API.get(`/expenses/${id}`),
  update: (id, data) => API.put(`/expenses/${id}`, data),
  delete: (id) => API.delete(`/expenses/${id}`),
};

// ==================== BUDGET ====================
export const budgetAPI = {
  list: (month, year) => {
    const params = {};
    if (month) params.month = month;
    if (year) params.year = year;
    return API.get("/budgets", { params });
  },
  create: (data) => API.post("/budgets", data),
  get: (id) => API.get(`/budgets/${id}`),
  update: (id, data) => API.put(`/budgets/${id}`, data),
  delete: (id) => API.delete(`/budgets/${id}`),
};

// ==================== SAVINGS GOALS ====================
export const savingsAPI = {
  list: () => API.get("/savings-goals"),
  create: (data) => API.post("/savings-goals", data),
  get: (id) => API.get(`/savings-goals/${id}`),
  update: (id, data) => API.put(`/savings-goals/${id}`, data),
  delete: (id) => API.delete(`/savings-goals/${id}`),
};
