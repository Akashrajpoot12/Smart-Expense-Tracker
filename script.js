// Smart Personal Expense Tracker - JavaScript

class ExpenseTracker {
    constructor() {
        this.expenses = [];
        this.loans = [];
        this.monthlyBudget = 15000;
        this.currentFilter = '';
        this.currentSort = 'date-desc';
        this.currentLoanFilter = '';
        this.currentLoanStatusFilter = '';
        this.userProfile = {
            name: '',
            phone: '',
            email: '',
            smsEnabled: 'yes',
            exportEnabled: 'yes',
            photo: null
        };
        
        this.init();
    }

    init() {
        this.loadData();
        this.setCurrentDate();
        this.updateUI();
        this.setupEventListeners();
        this.updateProfileButtonImage(); // Update profile button image on load
        // this.loadSampleData(); // Commented out - No more auto sample data
    }

    // Load data from localStorage
    loadData() {
        const savedExpenses = localStorage.getItem('expenses');
        const savedLoans = localStorage.getItem('loans');
        const savedBudget = localStorage.getItem('monthlyBudget');
        const savedProfile = localStorage.getItem('userProfile');
        
        if (savedExpenses) {
            this.expenses = JSON.parse(savedExpenses);
        }
        
        if (savedLoans) {
            this.loans = JSON.parse(savedLoans);
        }
        
        if (savedBudget) {
            this.monthlyBudget = parseFloat(savedBudget);
            document.getElementById('monthlyBudget').value = this.monthlyBudget;
        }
        
        if (savedProfile) {
            this.userProfile = JSON.parse(savedProfile);
        }
    }

    // Save data to localStorage
    saveData() {
        localStorage.setItem('expenses', JSON.stringify(this.expenses));
        localStorage.setItem('loans', JSON.stringify(this.loans));
        localStorage.setItem('monthlyBudget', this.monthlyBudget.toString());
        localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
    }

    // Set current date
    setCurrentDate() {
        const today = new Date();
        const dateString = today.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('currentDate').textContent = dateString;
        
        // Set today's date as default in add expense form
        document.getElementById('expenseDate').value = today.toISOString().split('T')[0];
    }

    // Load sample data for demonstration (Optional - Only when needed)
    loadSampleData() {
        if (this.expenses.length === 0) {
            const sampleExpenses = [
                { id: 1, date: '2024-01-15', category: 'Groceries', description: 'Weekly grocery shopping at Big Bazaar', amount: 1250.50 },
                { id: 2, date: '2024-01-16', category: 'Transportation', description: 'Petrol for bike', amount: 450.00 },
                { id: 3, date: '2024-01-17', category: 'Entertainment', description: 'Movie tickets and snacks', amount: 750.00 },
                { id: 4, date: '2024-01-18', category: 'Dining', description: 'Restaurant dinner with friends', amount: 1200.00 },
                { id: 5, date: '2024-01-19', category: 'Shopping', description: 'New clothes from Reliance Trends', amount: 2500.00 },
                { id: 6, date: '2024-01-20', category: 'Utilities', description: 'Electricity bill', amount: 850.00 },
                { id: 7, date: '2024-01-21', category: 'Healthcare', description: 'Pharmacy medicines', amount: 450.00 },
                { id: 8, date: '2024-01-22', category: 'Transportation', description: 'Ola ride to airport', amount: 650.00 }
            ];
            
            this.expenses = sampleExpenses;
            this.saveData();
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Add expense form submission
        document.getElementById('addExpenseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addExpense();
        });

        // Search form submission
        document.getElementById('searchModal').addEventListener('shown.bs.modal', () => {
            this.populateCategoryOptions('searchCategory');
        });

        // Reports modal
        document.getElementById('reportsModal').addEventListener('shown.bs.modal', () => {
            this.generateReports();
        });

        // Loan modal
        document.getElementById('loanModal').addEventListener('shown.bs.modal', () => {
            this.updateLoansTable();
        });

        // Profile modal
        document.getElementById('profileModal').addEventListener('shown.bs.modal', () => {
            this.populateProfileForm();
        });
    }

    // Add new expense
    addExpense() {
        const date = document.getElementById('expenseDate').value;
        const categorySelect = document.getElementById('expenseCategory').value;
        const customCategory = document.getElementById('customCategory').value;
        const description = document.getElementById('expenseDescription').value;
        const amount = parseFloat(document.getElementById('expenseAmount').value);

        if (!date || !description || !amount) {
            this.showAlert('Please fill in all fields', 'danger');
            return;
        }

        // Handle custom category
        let category = categorySelect;
        if (categorySelect === 'write') {
            if (!customCategory.trim()) {
                this.showAlert('Please enter a custom category', 'danger');
                return;
            }
            category = customCategory.trim();
        }

        const newExpense = {
            id: Date.now(),
            date: date,
            category: category,
            description: description,
            amount: amount
        };

        this.expenses.push(newExpense);
        this.saveData();
        this.updateUI();
        
        // Close modal and reset form
        const modal = bootstrap.Modal.getInstance(document.getElementById('addExpenseModal'));
        modal.hide();
        document.getElementById('addExpenseForm').reset();
        document.getElementById('customCategory').style.display = 'none';
        this.setCurrentDate();
        
        this.showAlert('Expense added successfully!', 'success');
    }

    // Add expense from bill upload
    addExpenseFromBill(expense) {
        this.expenses.push(expense);
        this.saveData();
        this.updateUI();
        
        // Close modal and reset form
        const modal = bootstrap.Modal.getInstance(document.getElementById('billUploadModal'));
        modal.hide();
        document.getElementById('billImage').value = '';
        document.getElementById('billDate').value = '';
        document.getElementById('billAmount').value = '';
        document.getElementById('billDescription').value = '';
        document.getElementById('billCategory').value = '';
        document.getElementById('billPreviewContainer').style.display = 'none';
        
        this.showAlert('Bill expense added successfully!', 'success');
    }

    // Update monthly budget
    updateBudget() {
        const newBudget = parseFloat(document.getElementById('monthlyBudget').value);
        if (newBudget >= 0) {
            this.monthlyBudget = newBudget;
            this.saveData();
            this.updateUI();
            this.showAlert('Budget updated successfully!', 'success');
        }
    }

    // Update UI
    updateUI() {
        this.updateStats();
        this.updateExpensesTable();
        this.updateCategorySummary();
        this.updateLoanSummary();
        this.updateProfileSummary();
        this.updateBudgetProgress();
        this.populateCategoryOptions('filterCategory');
    }

    // Update statistics
    updateStats() {
        const totalExpenses = this.expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyExpenses = this.expenses.filter(exp => {
            const expDate = new Date(exp.date);
            return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
        }).reduce((sum, exp) => sum + exp.amount, 0);

        document.getElementById('totalExpenses').textContent = `₹${totalExpenses.toFixed(2)}`;
        document.getElementById('monthlySpent').textContent = `₹${monthlyExpenses.toFixed(2)}`;
    }

    // Update expenses table
    updateExpensesTable() {
        const tbody = document.getElementById('expensesTableBody');
        
        if (this.expenses.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted">
                        <i class="fas fa-inbox fa-2x mb-2"></i><br>
                        No expenses recorded yet.<br>
                        <button class="btn btn-primary btn-sm mt-2" onclick="showAddExpenseModal()">
                            Add Your First Expense
                        </button>
                    </td>
                </tr>
            `;
            return;
        }

        let filteredExpenses = [...this.expenses];
        
        // Apply filter
        if (this.currentFilter) {
            filteredExpenses = filteredExpenses.filter(exp => exp.category === this.currentFilter);
        }
        
        // Apply sorting
        this.sortExpensesArray(filteredExpenses);
        
        tbody.innerHTML = filteredExpenses.map(exp => `
            <tr class="fade-in">
                <td>${this.formatDate(exp.date)}</td>
                <td><span class="category-badge category-${exp.category.toLowerCase()}">${exp.category}</span></td>
                <td>${exp.description}</td>
                <td class="fw-bold">₹${exp.amount.toFixed(2)}</td>
                <td>
                    ${exp.billImage ? 
                        `<button class="btn btn-info btn-sm" onclick="viewBillImage('${exp.billImage}')" title="View Bill">
                            <i class="fas fa-file-image"></i>
                        </button>` : 
                        '<span class="text-muted">-</span>'
                    }
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-warning btn-sm" onclick="expenseTracker.editExpense(${exp.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="expenseTracker.deleteExpense(${exp.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Update category summary
    updateCategorySummary() {
        const categorySummary = document.getElementById('categorySummary');
        const categoryTotals = {};
        
        this.expenses.forEach(exp => {
            categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
        });
        
        if (Object.keys(categoryTotals).length === 0) {
            categorySummary.innerHTML = '<p class="text-muted text-center">No expenses yet</p>';
            return;
        }
        
        const sortedCategories = Object.entries(categoryTotals)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
        
        categorySummary.innerHTML = sortedCategories.map(([category, amount]) => `
            <div class="category-item">
                <span class="category-name">${category}</span>
                <span class="category-amount">₹${amount.toFixed(2)}</span>
            </div>
        `).join('');
    }

    // Update loan summary
    updateLoanSummary() {
        const totalGiven = this.loans
            .filter(loan => loan.type === 'Given' && loan.status !== 'Returned')
            .reduce((sum, loan) => sum + loan.amount, 0);
        
        const totalTaken = this.loans
            .filter(loan => loan.type === 'Taken' && loan.status !== 'Returned')
            .reduce((sum, loan) => sum + loan.amount, 0);
        
        const netAmount = totalTaken - totalGiven;
        
        document.getElementById('totalGiven').textContent = `₹${totalGiven.toFixed(2)}`;
        document.getElementById('totalTaken').textContent = `₹${totalTaken.toFixed(2)}`;
        document.getElementById('netLoan').textContent = `Net: ₹${netAmount.toFixed(2)}`;
        
        // Color coding for net amount
        const netElement = document.getElementById('netLoan');
        if (netAmount > 0) {
            netElement.className = 'text-danger';
        } else if (netAmount < 0) {
            netElement.className = 'text-success';
        } else {
            netElement.className = 'text-primary';
        }
    }

    // Update budget progress
    updateBudgetProgress() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyExpenses = this.expenses.filter(exp => {
            const expDate = new Date(exp.date);
            return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
        }).reduce((sum, exp) => sum + exp.amount, 0);
        
        const progressBar = document.getElementById('budgetProgress');
        const budgetStatus = document.getElementById('budgetStatus');
        
        const percentage = Math.min((monthlyExpenses / this.monthlyBudget) * 100, 100);
        progressBar.style.width = `${percentage}%`;
        
        if (monthlyExpenses > this.monthlyBudget) {
            progressBar.className = 'progress-bar bg-danger';
            budgetStatus.textContent = 'Over Budget!';
            budgetStatus.className = 'text-danger fw-bold';
        } else if (monthlyExpenses > this.monthlyBudget * 0.8) {
            progressBar.className = 'progress-bar bg-warning';
            budgetStatus.textContent = 'Approaching Budget';
            budgetStatus.className = 'text-warning fw-bold';
        } else {
            progressBar.className = 'progress-bar bg-success';
            budgetStatus.textContent = 'Under Budget';
            budgetStatus.className = 'text-success';
        }
    }

    // Populate category options
    populateCategoryOptions(selectId) {
        const select = document.getElementById(selectId);
        const categories = [...new Set(this.expenses.map(exp => exp.category))];
        
        // Clear existing options except the first one
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            select.appendChild(option);
        });
    }

    // Sort expenses
    sortExpenses() {
        this.currentSort = document.getElementById('sortBy').value;
        this.updateExpensesTable();
    }

    // Filter expenses
    filterExpenses() {
        this.currentFilter = document.getElementById('filterCategory').value;
        this.updateExpensesTable();
    }

    // Sort expenses array
    sortExpensesArray(expenses) {
        switch (this.currentSort) {
            case 'date-desc':
                expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'date-asc':
                expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'amount-desc':
                expenses.sort((a, b) => b.amount - a.amount);
                break;
            case 'amount-asc':
                expenses.sort((a, b) => a.amount - b.amount);
                break;
            case 'category':
                expenses.sort((a, b) => a.category.localeCompare(b.category));
                break;
        }
    }

    // Search expenses
    searchExpenses() {
        const keyword = document.getElementById('searchKeyword').value.toLowerCase();
        const date = document.getElementById('searchDate').value;
        const category = document.getElementById('searchCategory').value;
        
        let results = this.expenses.filter(exp => {
            let match = true;
            
            if (keyword) {
                match = match && (
                    exp.description.toLowerCase().includes(keyword) ||
                    exp.category.toLowerCase().includes(keyword)
                );
            }
            
            if (date) {
                match = match && exp.date === date;
            }
            
            if (category) {
                match = match && exp.category === category;
            }
            
            return match;
        });
        
        this.displaySearchResults(results);
        
        // Close search modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('searchModal'));
        modal.hide();
    }

    // Display search results
    displaySearchResults(results) {
        const tbody = document.getElementById('expensesTableBody');
        
        if (results.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted">
                        <i class="fas fa-search fa-2x mb-2"></i><br>
                        No expenses found matching your search criteria.
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = results.map(exp => `
            <tr class="fade-in">
                <td>${this.formatDate(exp.date)}</td>
                <td><span class="category-badge category-${exp.category.toLowerCase()}">${exp.category}</span></td>
                <td>${exp.description}</td>
                <td class="fw-bold">₹${exp.amount.toFixed(2)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-warning btn-sm" onclick="expenseTracker.editExpense(${exp.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="expenseTracker.deleteExpense(${exp.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Edit expense
    editExpense(id) {
        const expense = this.expenses.find(exp => exp.id === id);
        if (!expense) return;
        
        // Populate form
        document.getElementById('expenseDate').value = expense.date;
        document.getElementById('expenseCategory').value = expense.category;
        document.getElementById('expenseDescription').value = expense.description;
        document.getElementById('expenseAmount').value = expense.amount;
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('addExpenseModal'));
        modal.show();
        
        // Change save button to update
        const saveBtn = document.querySelector('#addExpenseModal .btn-primary');
        saveBtn.innerHTML = '<i class="fas fa-save me-2"></i>Update Expense';
        saveBtn.onclick = () => this.updateExpense(id);
    }

    // Update expense
    updateExpense(id) {
        const expense = this.expenses.find(exp => exp.id === id);
        if (!expense) return;
        
        expense.date = document.getElementById('expenseDate').value;
        expense.category = document.getElementById('expenseCategory').value;
        expense.description = document.getElementById('expenseDescription').value;
        expense.amount = parseFloat(document.getElementById('expenseAmount').value);
        
        this.saveData();
        this.updateUI();
        
        // Close modal and reset form
        const modal = bootstrap.Modal.getInstance(document.getElementById('addExpenseModal'));
        modal.hide();
        document.getElementById('addExpenseForm').reset();
        this.setCurrentDate();
        
        // Reset save button
        const saveBtn = document.querySelector('#addExpenseModal .btn-primary');
        saveBtn.innerHTML = '<i class="fas fa-save me-2"></i>Save Expense';
        saveBtn.onclick = () => this.addExpense();
        
        this.showAlert('Expense updated successfully!', 'success');
    }

    // Delete expense
    deleteExpense(id) {
        if (confirm('Are you sure you want to delete this expense?')) {
            this.expenses = this.expenses.filter(exp => exp.id !== id);
            this.saveData();
            this.updateUI();
            this.showAlert('Expense deleted successfully!', 'success');
        }
    }

    // Generate reports
    generateReports() {
        this.generateMonthlyReport();
        this.generateCategoryChart();
        this.generateTrendChart();
    }

    // Generate monthly report
    generateMonthlyReport() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyExpenses = this.expenses.filter(exp => {
            const expDate = new Date(exp.date);
            return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
        });
        
        const total = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const remaining = this.monthlyBudget - total;
        
        document.getElementById('monthlyStats').innerHTML = `
            <div class="row">
                <div class="col-6">
                    <div class="text-center p-3 bg-light rounded">
                        <h4 class="text-primary">₹${total.toFixed(2)}</h4>
                        <small class="text-muted">Total Spent</small>
                    </div>
                </div>
                <div class="col-6">
                    <div class="text-center p-3 bg-light rounded">
                        <h4 class="text-${remaining >= 0 ? 'success' : 'danger'}">₹${Math.abs(remaining).toFixed(2)}</h4>
                        <small class="text-muted">${remaining >= 0 ? 'Remaining' : 'Over Budget'}</small>
                    </div>
                </div>
            </div>
        `;
        
        // Monthly chart
        this.createMonthlyChart(monthlyExpenses);
    }

    // Generate category chart
    generateCategoryChart() {
        const categoryTotals = {};
        this.expenses.forEach(exp => {
            categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
        });
        
        this.createCategoryChart(categoryTotals);
        this.updateCategoryBreakdown(categoryTotals);
    }

    // Generate trend chart
    generateTrendChart() {
        const monthlyData = {};
        
        this.expenses.forEach(exp => {
            const month = exp.date.substring(0, 7); // YYYY-MM
            monthlyData[month] = (monthlyData[month] || 0) + exp.amount;
        });
        
        this.createTrendChart(monthlyData);
    }

    // Create monthly chart
    createMonthlyChart(expenses) {
        const ctx = document.getElementById('monthlyChart');
        if (ctx.chart) {
            ctx.chart.destroy();
        }
        
        const dailyData = {};
        expenses.forEach(exp => {
            const day = exp.date.substring(8, 10);
            dailyData[day] = (dailyData[day] || 0) + exp.amount;
        });
        
        ctx.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Object.keys(dailyData).sort(),
                datasets: [{
                    label: 'Daily Spending',
                    data: Object.keys(dailyData).sort().map(day => dailyData[day]),
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Daily Spending This Month'
                    }
                }
            }
        });
    }

    // Create category chart
    createCategoryChart(categoryTotals) {
        const ctx = document.getElementById('categoryChart');
        if (ctx.chart) {
            ctx.chart.destroy();
        }
        
        ctx.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categoryTotals),
                datasets: [{
                    data: Object.values(categoryTotals),
                    backgroundColor: [
                        '#28a745', '#007bff', '#fd7e14', '#6f42c1',
                        '#17a2b8', '#6c757d', '#dc3545', '#ffc107'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Spending by Category'
                    }
                }
            }
        });
    }

    // Create trend chart
    createTrendChart(monthlyData) {
        const ctx = document.getElementById('trendChart');
        if (ctx.chart) {
            ctx.chart.destroy();
        }
        
        const sortedMonths = Object.keys(monthlyData).sort();
        
        ctx.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedMonths,
                datasets: [{
                    label: 'Monthly Spending',
                    data: sortedMonths.map(month => monthlyData[month]),
                    backgroundColor: '#28a745'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Monthly Spending Trends'
                    }
                }
            }
        });
    }

    // Update category breakdown
    updateCategoryBreakdown(categoryTotals) {
        const breakdown = document.getElementById('categoryBreakdown');
        const sortedCategories = Object.entries(categoryTotals)
            .sort(([,a], [,b]) => b - a);
        
        breakdown.innerHTML = sortedCategories.map(([category, amount]) => `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="fw-bold">${category}</span>
                <span class="text-primary">₹${amount.toFixed(2)}</span>
            </div>
        `).join('');
    }

    // Generate CSV
    generateCSV() {
        const headers = ['Date', 'Category', 'Description', 'Amount (₹)'];
        const rows = this.expenses.map(exp => [
            exp.date,
            exp.category,
            exp.description,
            exp.amount.toFixed(2)
        ]);
        
        return [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
    }

    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    // Show alert
    showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 3000);
    }

    // Add new loan
    addLoan() {
        const person = document.getElementById('loanPerson').value;
        const amount = parseFloat(document.getElementById('loanAmount').value);
        const date = document.getElementById('loanDate').value;
        const type = document.getElementById('loanType').value;
        const description = document.getElementById('loanDescription').value;
        const status = document.getElementById('loanStatus').value;
        const returnDate = document.getElementById('returnDate').value;

        if (!person || !amount || !date || !type || !status) {
            this.showAlert('Please fill in all required fields', 'danger');
            return;
        }

        const newLoan = {
            id: Date.now(),
            person: person,
            amount: amount,
            date: date,
            type: type,
            description: description,
            status: status,
            returnDate: returnDate
        };

        this.loans.push(newLoan);
        this.saveData();
        this.updateUI();
        
        // Reset form
        document.getElementById('addLoanForm').reset();
        this.setCurrentDate();
        
        this.showAlert('Loan added successfully!', 'success');
    }

    // Update loans table
    updateLoansTable() {
        const tbody = document.getElementById('loansTableBody');
        
        if (this.loans.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted">
                        <i class="fas fa-handshake fa-2x mb-2"></i><br>
                        No loans recorded yet.
                    </td>
                </tr>
            `;
            return;
        }

        let filteredLoans = [...this.loans];
        
        // Apply filters
        if (this.currentLoanFilter) {
            filteredLoans = filteredLoans.filter(loan => loan.type === this.currentLoanFilter);
        }
        
        if (this.currentLoanStatusFilter) {
            filteredLoans = filteredLoans.filter(loan => loan.status === this.currentLoanStatusFilter);
        }
        
        // Sort by date (newest first)
        filteredLoans.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        tbody.innerHTML = filteredLoans.map(loan => `
            <tr class="fade-in">
                <td><strong>${loan.person}</strong></td>
                <td><span class="badge ${loan.type === 'Given' ? 'bg-danger' : 'bg-success'}">${loan.type}</span></td>
                <td class="fw-bold">₹${loan.amount.toFixed(2)}</td>
                <td><span class="badge ${this.getStatusBadgeClass(loan.status)}">${loan.status}</span></td>
                <td>${this.formatDate(loan.date)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-warning btn-sm" onclick="expenseTracker.editLoan(${loan.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="expenseTracker.deleteLoan(${loan.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Get status badge class
    getStatusBadgeClass(status) {
        switch (status) {
            case 'Active': return 'bg-warning';
            case 'Returned': return 'bg-success';
            case 'Partial': return 'bg-info';
            default: return 'bg-secondary';
        }
    }

    // Edit loan
    editLoan(id) {
        const loan = this.loans.find(l => l.id === id);
        if (!loan) return;
        
        // Populate form
        document.getElementById('loanPerson').value = loan.person;
        document.getElementById('loanAmount').value = loan.amount;
        document.getElementById('loanDate').value = loan.date;
        document.getElementById('loanType').value = loan.type;
        document.getElementById('loanDescription').value = loan.description || '';
        document.getElementById('loanStatus').value = loan.status;
        document.getElementById('returnDate').value = loan.returnDate || '';
        
        // Switch to add tab
        document.getElementById('add-loan-tab').click();
        
        // Change save button to update
        const saveBtn = document.querySelector('#loanModal .btn-primary');
        saveBtn.innerHTML = '<i class="fas fa-save me-2"></i>Update Loan';
        saveBtn.onclick = () => this.updateLoan(id);
    }

    // Update loan
    updateLoan(id) {
        const loan = this.loans.find(l => l.id === id);
        if (!loan) return;
        
        loan.person = document.getElementById('loanPerson').value;
        loan.amount = parseFloat(document.getElementById('loanAmount').value);
        loan.date = document.getElementById('loanDate').value;
        loan.type = document.getElementById('loanType').value;
        loan.description = document.getElementById('loanDescription').value;
        loan.status = document.getElementById('loanStatus').value;
        loan.returnDate = document.getElementById('returnDate').value;
        
        this.saveData();
        this.updateUI();
        
        // Reset form and button
        document.getElementById('addLoanForm').reset();
        const saveBtn = document.querySelector('#loanModal .btn-primary');
        saveBtn.innerHTML = '<i class="fas fa-save me-2"></i>Save Loan';
        saveBtn.onclick = () => this.addLoan();
        
        this.showAlert('Loan updated successfully!', 'success');
    }

    // Delete loan
    deleteLoan(id) {
        if (confirm('Are you sure you want to delete this loan?')) {
            this.loans = this.loans.filter(loan => loan.id !== id);
            this.saveData();
            this.updateUI();
            this.showAlert('Loan deleted successfully!', 'success');
        }
    }

    // Filter loans
    filterLoans() {
        this.currentLoanFilter = document.getElementById('loanFilter').value;
        this.currentLoanStatusFilter = document.getElementById('loanStatusFilter').value;
        this.updateLoansTable();
    }

    // Populate profile form
    populateProfileForm() {
        document.getElementById('profileName').value = this.userProfile.name;
        document.getElementById('profilePhone').value = this.userProfile.phone;
        document.getElementById('profileEmail').value = this.userProfile.email;
        document.getElementById('profileSms').value = this.userProfile.smsEnabled;
        document.getElementById('profileExport').value = this.userProfile.exportEnabled;
        
        // Display profile photo if exists
        const photoPreview = document.getElementById('profilePhotoPreview');
        if (this.userProfile.photo) {
            photoPreview.src = this.userProfile.photo;
        } else {
            photoPreview.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23e9ecef'/%3E%3Cpath d='M50 30c-8.284 0-15 6.716-15 15s6.716 15 15 15 15-6.716 15-15-6.716-15-15-15zm0 25c-5.514 0-10-4.486-10-10s4.486-10 10-10 10 4.486 10 10-4.486 10-10 10z' fill='%236c757d'/%3E%3C/svg%3E";
        }
    }

    // Save profile
    saveProfile() {
        const name = document.getElementById('profileName').value;
        const phone = document.getElementById('profilePhone').value;
        const email = document.getElementById('profileEmail').value;
        const smsEnabled = document.getElementById('profileSms').value;
        const exportEnabled = document.getElementById('profileExport').value;

        if (!name || !phone) {
            this.showAlert('Please fill in name and phone number', 'danger');
            return;
        }

        this.userProfile = {
            name: name,
            phone: phone,
            email: email,
            smsEnabled: smsEnabled,
            exportEnabled: exportEnabled,
            photo: this.userProfile.photo // Preserve existing photo
        };

        this.saveData();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('profileModal'));
        modal.hide();
        
        this.showAlert('Profile saved successfully!', 'success');
    }

    // Export data with SMS functionality
    exportData() {
        const csvContent = this.generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        // Send SMS if enabled and profile exists
        if (this.userProfile.smsEnabled === 'yes' && this.userProfile.phone) {
            this.sendSMSExport();
        }
        
        this.showAlert('Data exported successfully!', 'success');
    }

    // Send SMS export
    sendSMSExport() {
        const phone = this.userProfile.phone;
        const name = this.userProfile.name;
        
        // Generate summary for SMS
        const totalExpenses = this.expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyExpenses = this.expenses.filter(exp => {
            const expDate = new Date(exp.date);
            return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
        }).reduce((sum, exp) => sum + exp.amount, 0);

        const totalLoans = this.loans.length;
        const activeLoans = this.loans.filter(loan => loan.status === 'Active').length;

        const smsMessage = `Hi ${name}! Your Expense Tracker Summary:
Total Expenses: ₹${totalExpenses.toFixed(2)}
This Month: ₹${monthlyExpenses.toFixed(2)}
Total Loans: ${totalLoans}
Active Loans: ${activeLoans}
Budget Remaining: ₹${Math.max(0, this.monthlyBudget - monthlyExpenses).toFixed(2)}
Generated on: ${new Date().toLocaleDateString()}`;

        // Use Web Share API or fallback to SMS link
        if (navigator.share) {
            navigator.share({
                title: 'Expense Tracker Summary',
                text: smsMessage,
                url: window.location.href
            }).catch(err => {
                this.fallbackSMSExport(phone, smsMessage);
            });
        } else {
            this.fallbackSMSExport(phone, smsMessage);
        }
    }

    // Fallback SMS export
    fallbackSMSExport(phone, message) {
        // Create SMS link
        const smsLink = `sms:${phone}?body=${encodeURIComponent(message)}`;
        
        // Show SMS preview modal
        this.showSMSModal(phone, message, smsLink);
    }

    // Show SMS preview modal
    showSMSModal(phone, message, smsLink) {
        const modalHtml = `
            <div class="modal fade" id="smsModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title"><i class="fas fa-sms me-2"></i>SMS Export Preview</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">To:</label>
                                <input type="text" class="form-control" value="${phone}" readonly>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Message:</label>
                                <textarea class="form-control" rows="8" readonly>${message}</textarea>
                            </div>
                            <div class="alert alert-info">
                                <i class="fas fa-info-circle me-2"></i>
                                Click "Send SMS" to open your default SMS app with this message pre-filled.
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <a href="${smsLink}" class="btn btn-success">
                                <i class="fas fa-sms me-2"></i>Send SMS
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('smsModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('smsModal'));
        modal.show();

        // Remove modal from DOM after hiding
        document.getElementById('smsModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
    }

    // Update profile summary
    updateProfileSummary() {
        const profileSummary = document.getElementById('profileSummary');
        if (!profileSummary) return;

        if (!this.userProfile.name && !this.userProfile.phone) {
            profileSummary.innerHTML = `
                <div class="text-center">
                    <i class="fas fa-user-circle fa-3x text-muted mb-2"></i>
                    <p class="text-muted">No profile set</p>
                    <button class="btn btn-outline-info btn-sm" onclick="showProfileModal()">
                        <i class="fas fa-plus me-1"></i>Create Profile
                    </button>
                </div>
            `;
        } else {
            const photoHtml = this.userProfile.photo ? 
                `<img src="${this.userProfile.photo}" alt="Profile Photo" class="profile-summary-photo">` :
                `<i class="fas fa-user-circle fa-3x text-muted mb-2"></i>`;
            
            profileSummary.innerHTML = `
                <div class="text-center">
                    ${photoHtml}
                </div>
                <div class="mb-2">
                    <strong><i class="fas fa-user me-1"></i>${this.userProfile.name || 'Not set'}</strong>
                </div>
                <div class="mb-2">
                    <small class="text-muted">
                        <i class="fas fa-phone me-1"></i>${this.userProfile.phone || 'Not set'}
                    </small>
                </div>
                ${this.userProfile.email ? `
                <div class="mb-2">
                    <small class="text-muted">
                        <i class="fas fa-envelope me-1"></i>${this.userProfile.email}
                    </small>
                </div>
                ` : ''}
                <div class="row text-center mt-3">
                    <div class="col-6">
                        <small class="text-muted">
                            <i class="fas fa-sms me-1"></i>SMS: ${this.userProfile.smsEnabled === 'yes' ? 'On' : 'Off'}
                        </small>
                    </div>
                    <div class="col-6">
                        <small class="text-muted">
                            <i class="fas fa-download me-1"></i>CSV: ${this.userProfile.exportEnabled === 'yes' ? 'On' : 'Off'}
                        </small>
                    </div>
                </div>
                <div class="text-center mt-2">
                    <button class="btn btn-outline-info btn-sm" onclick="showProfileModal()">
                        <i class="fas fa-edit me-1"></i>Edit Profile
                    </button>
                </div>
            `;
        }
        
        // Also update the profile button image
        this.updateProfileButtonImage();
    }

    // Update profile button image
    updateProfileButtonImage() {
        const profileButtonImage = document.getElementById('profileButtonImage');
        if (profileButtonImage && this.userProfile.photo) {
            profileButtonImage.src = this.userProfile.photo;
        }
    }

    // Show selective export modal
    showSelectiveExportModal() {
        this.populateExportTables();
        const modal = new bootstrap.Modal(document.getElementById('selectiveExportModal'));
        modal.show();
    }

    // Populate export tables
    populateExportTables() {
        this.populateExportExpensesTable();
        this.populateExportLoansTable();
    }

    // Populate export expenses table
    populateExportExpensesTable() {
        const tbody = document.getElementById('exportExpensesTable');
        
        if (this.expenses.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted">
                        <i class="fas fa-inbox fa-2x mb-2"></i><br>
                        No expenses to export
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.expenses.map(exp => `
            <tr class="export-table-row">
                <td>
                    <input type="checkbox" class="form-check-input export-checkbox" value="${exp.id}" id="exp_${exp.id}">
                </td>
                <td>${this.formatDate(exp.date)}</td>
                <td><span class="badge bg-secondary">${exp.category}</span></td>
                <td>${exp.description}</td>
                <td class="fw-bold">₹${exp.amount.toFixed(2)}</td>
            </tr>
        `).join('');
    }

    // Populate export loans table
    populateExportLoansTable() {
        const tbody = document.getElementById('exportLoansTable');
        
        if (this.loans.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted">
                        <i class="fas fa-handshake fa-2x mb-2"></i><br>
                        No loans to export
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.loans.map(loan => `
            <tr class="export-table-row">
                <td>
                    <input type="checkbox" class="form-check-input export-checkbox" value="${loan.id}" id="loan_${loan.id}">
                </td>
                <td><strong>${loan.person}</strong></td>
                <td><span class="badge ${loan.type === 'Given' ? 'bg-danger' : 'bg-success'}">${loan.type}</span></td>
                <td class="fw-bold">₹${loan.amount.toFixed(2)}</td>
                <td><span class="badge ${this.getStatusBadgeClass(loan.status)}">${loan.status}</span></td>
                <td>${this.formatDate(loan.date)}</td>
            </tr>
        `).join('');
    }

    // Export selected data
    exportSelectedData() {
        const selectedExpenseIds = Array.from(document.querySelectorAll('#exportExpensesTable input[type="checkbox"]:checked'))
            .map(cb => parseInt(cb.value));
        
        const selectedLoanIds = Array.from(document.querySelectorAll('#exportLoansTable input[type="checkbox"]:checked'))
            .map(cb => parseInt(cb.value));

        if (selectedExpenseIds.length === 0 && selectedLoanIds.length === 0) {
            this.showAlert('Please select at least one entry to export', 'warning');
            return;
        }

        const selectedExpenses = this.expenses.filter(exp => selectedExpenseIds.includes(exp.id));
        const selectedLoans = this.loans.filter(loan => selectedLoanIds.includes(loan.id));

        // Generate CSV content
        let csvContent = '';
        
        if (selectedExpenses.length > 0) {
            csvContent += 'EXPENSES\n';
            csvContent += 'Date,Category,Description,Amount (₹)\n';
            csvContent += selectedExpenses.map(exp => 
                `"${exp.date}","${exp.category}","${exp.description}","${exp.amount.toFixed(2)}"`
            ).join('\n');
        }

        if (selectedLoans.length > 0) {
            if (csvContent) csvContent += '\n\n';
            csvContent += 'LOANS\n';
            csvContent += 'Person,Type,Amount (₹),Status,Date,Description\n';
            csvContent += selectedLoans.map(loan => 
                `"${loan.person}","${loan.type}","${loan.amount.toFixed(2)}","${loan.status}","${loan.date}","${loan.description || ''}"`
            ).join('\n');
        }

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `selected_data_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        // Send SMS if enabled
        if (this.userProfile.smsEnabled === 'yes' && this.userProfile.phone) {
            this.sendSelectiveSMSExport(selectedExpenses, selectedLoans);
        }

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('selectiveExportModal'));
        modal.hide();

        this.showAlert(`Exported ${selectedExpenses.length} expenses and ${selectedLoans.length} loans successfully!`, 'success');
    }

    // Send selective SMS export
    sendSelectiveSMSExport(selectedExpenses, selectedLoans) {
        const phone = this.userProfile.phone;
        const name = this.userProfile.name;
        
        const totalExpenses = selectedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const totalLoans = selectedLoans.reduce((sum, loan) => sum + loan.amount, 0);

        const smsMessage = `Hi ${name}! Selected Export Summary:
Selected Expenses: ${selectedExpenses.length} (₹${totalExpenses.toFixed(2)})
Selected Loans: ${selectedLoans.length} (₹${totalLoans.toFixed(2)})
Total Selected: ₹${(totalExpenses + totalLoans).toFixed(2)}
Generated on: ${new Date().toLocaleDateString()}`;

        // Use Web Share API or fallback to SMS link
        if (navigator.share) {
            navigator.share({
                title: 'Selected Data Export Summary',
                text: smsMessage,
                url: window.location.href
            }).catch(err => {
                this.fallbackSMSExport(phone, smsMessage);
            });
        } else {
            this.fallbackSMSExport(phone, smsMessage);
        }
    }
}

// Global functions for HTML onclick events
function showAddExpenseModal() {
    const modal = new bootstrap.Modal(document.getElementById('addExpenseModal'));
    modal.show();
    
    // Reset form and button
    document.getElementById('addExpenseForm').reset();
    const saveBtn = document.querySelector('#addExpenseModal .btn-primary');
    saveBtn.innerHTML = '<i class="fas fa-save me-2"></i>Save Expense';
    saveBtn.onclick = () => expenseTracker.addExpense();
    
    expenseTracker.setCurrentDate();
}

function showSearchModal() {
    const modal = new bootstrap.Modal(document.getElementById('searchModal'));
    modal.show();
}

function showReportsModal() {
    const modal = new bootstrap.Modal(document.getElementById('reportsModal'));
    modal.show();
}

function updateBudget() {
    expenseTracker.updateBudget();
}

function sortExpenses() {
    expenseTracker.sortExpenses();
}

function filterExpenses() {
    expenseTracker.filterExpenses();
}

function addExpense() {
    expenseTracker.addExpense();
}

function searchExpenses() {
    expenseTracker.searchExpenses();
}

function exportData() {
    expenseTracker.exportData();
}

function loadSampleData() {
    if (confirm('Do you want to load sample data for testing? This will add 8 sample expenses.')) {
        expenseTracker.loadSampleData();
        expenseTracker.updateUI();
        expenseTracker.showAlert('Sample data loaded successfully!', 'success');
    }
}

function clearAllData() {
    if (confirm('Are you sure you want to delete ALL expenses? This action cannot be undone!')) {
        expenseTracker.expenses = [];
        expenseTracker.saveData();
        expenseTracker.updateUI();
        expenseTracker.showAlert('All data cleared successfully!', 'success');
    }
}

function showLoanModal() {
    const modal = new bootstrap.Modal(document.getElementById('loanModal'));
    modal.show();
    
    // Reset form and button
    document.getElementById('addLoanForm').reset();
    const saveBtn = document.querySelector('#loanModal .btn-primary');
    saveBtn.innerHTML = '<i class="fas fa-save me-2"></i>Save Loan';
    saveBtn.onclick = () => expenseTracker.addLoan();
    
    expenseTracker.setCurrentDate();
    expenseTracker.updateLoansTable();
}

function addLoan() {
    expenseTracker.addLoan();
}

function filterLoans() {
    expenseTracker.filterLoans();
}

function showProfileModal() {
    const modal = new bootstrap.Modal(document.getElementById('profileModal'));
    modal.show();
}

function saveProfile() {
    expenseTracker.saveProfile();
}

function previewProfilePhoto() {
    const fileInput = document.getElementById('profilePhoto');
    const photoPreview = document.getElementById('profilePhotoPreview');
    
    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            expenseTracker.showAlert('Please select a valid image file', 'danger');
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            expenseTracker.showAlert('Image size should be less than 5MB', 'danger');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            photoPreview.src = e.target.result;
            // Save photo to user profile
            expenseTracker.userProfile.photo = e.target.result;
            // Update profile button image
            expenseTracker.updateProfileButtonImage();
        };
        reader.readAsDataURL(file);
    }
}

function showSelectiveExportModal() {
    expenseTracker.showSelectiveExportModal();
}

function toggleAllExpenses() {
    const selectAll = document.getElementById('selectAllExpenses');
    const checkboxes = document.querySelectorAll('#exportExpensesTable input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });
}

function toggleAllLoans() {
    const selectAll = document.getElementById('selectAllLoans');
    const checkboxes = document.querySelectorAll('#exportLoansTable input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });
}

function exportSelectedData() {
    expenseTracker.exportSelectedData();
}

// Handle category change for custom category input
function handleCategoryChange() {
    const categorySelect = document.getElementById('expenseCategory');
    const customCategoryInput = document.getElementById('customCategory');
    
    if (categorySelect.value === 'write') {
        customCategoryInput.style.display = 'block';
        customCategoryInput.required = true;
        customCategoryInput.focus();
    } else {
        customCategoryInput.style.display = 'none';
        customCategoryInput.required = false;
        customCategoryInput.value = '';
    }
}

// Show bill upload modal
function showBillUploadModal() {
    const modal = new bootstrap.Modal(document.getElementById('billUploadModal'));
    modal.show();
    
    // Reset form
    document.getElementById('billImage').value = '';
    document.getElementById('billDate').value = '';
    document.getElementById('billAmount').value = '';
    document.getElementById('billDescription').value = '';
    document.getElementById('billCategory').value = '';
    document.getElementById('billPreviewContainer').style.display = 'none';
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('billDate').value = today;
}

// Preview bill image
function previewBillImage() {
    const fileInput = document.getElementById('billImage');
    const previewContainer = document.getElementById('billPreviewContainer');
    const preview = document.getElementById('billPreview');
    
    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            expenseTracker.showAlert('Please select a valid image file', 'danger');
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            expenseTracker.showAlert('Image size should be less than 5MB', 'danger');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// Save bill expense
function saveBillExpense() {
    const billDate = document.getElementById('billDate').value;
    const billAmount = parseFloat(document.getElementById('billAmount').value);
    const billDescription = document.getElementById('billDescription').value;
    const billCategory = document.getElementById('billCategory').value;
    const billImage = document.getElementById('billImage').files[0];
    
    if (!billDate || !billAmount || !billDescription || !billCategory) {
        expenseTracker.showAlert('Please fill all required fields', 'danger');
        return;
    }
    
    if (billAmount <= 0) {
        expenseTracker.showAlert('Amount must be greater than 0', 'danger');
        return;
    }
    
    // Create expense object with bill image
    const expense = {
        id: Date.now(),
        date: billDate,
        category: billCategory,
        description: billDescription,
        amount: billAmount,
        billImage: null
    };
    
    // If bill image is uploaded, convert to base64
    if (billImage) {
        const reader = new FileReader();
        reader.onload = function(e) {
            expense.billImage = e.target.result;
            expenseTracker.addExpenseFromBill(expense);
        };
        reader.readAsDataURL(billImage);
    } else {
        expenseTracker.addExpenseFromBill(expense);
    }
}

// View bill image
function viewBillImage(imageData) {
    const modal = new bootstrap.Modal(document.getElementById('billViewModal'));
    document.getElementById('billViewImage').src = imageData;
    modal.show();
}

// Initialize the expense tracker when page loads
let expenseTracker;
document.addEventListener('DOMContentLoaded', () => {
    expenseTracker = new ExpenseTracker();
}); 