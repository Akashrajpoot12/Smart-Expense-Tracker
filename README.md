# 🚀 Smart Personal Expense Tracker

A comprehensive, feature-rich personal expense tracking application built in C++ with a beautiful console UI, designed to be your financial guardian.

## ✨ Features

### 🎯 Core Features
- **Add Expenses**: Date, description, category, and amount tracking
- **View All Expenses**: Beautifully formatted tables with totals
- **Search Expenses**: Search by date, category, or keyword
- **Monthly & Weekly Reports**: Comprehensive spending analysis
- **File Storage**: Automatic CSV file management

### 🧠 Smart Features
- **Auto-Date Detection**: Automatically uses today's date if none provided
- **Spending Alerts**: Warns when approaching or exceeding monthly budget
- **Category Insights**: Shows top 3 spending categories
- **Trend Analysis**: Compares spending with previous months
- **Smart Search**: Case-insensitive and partial match search
- **Auto-Sort**: Displays expenses sorted by date (newest first)

### 🎨 UI Features
- **Colorful Console**: Uses ANSI color codes for better readability
- **Professional Tables**: Perfectly aligned using `<iomanip>`
- **Beautiful Borders**: Clean, structured menu design
- **ASCII Art**: Stylish title and welcome screen
- **Loading Animation**: Smooth initialization experience

### 🔧 Management Features
- **Edit Expenses**: Modify existing expense details
- **Delete Expenses**: Remove unwanted entries
- **Export Reports**: Generate CSV reports for external analysis
- **Budget Management**: Set and monitor monthly spending limits

## 🛠️ Installation & Compilation

### Prerequisites
- Windows OS (uses `<windows.h>` for console features)
- C++ compiler (GCC, MSVC, or Clang)
- Make sure your compiler supports C++11 or later

### Compilation Commands

#### Using GCC (MinGW):
```bash
g++ -o expense_tracker main.cpp -std=c++11
```

#### Using MSVC:
```bash
cl main.cpp /Fe:expense_tracker.exe
```

#### Using Clang:
```bash
clang++ -o expense_tracker main.cpp -std=c++11
```

## 🚀 Usage

### Starting the Application
1. Compile the source code
2. Run the executable: `./expense_tracker` or `expense_tracker.exe`
3. Enjoy the beautiful welcome screen!

### Main Menu Options
```
╔══════════════════════════════════════════════════════════════╗
║                         MAIN MENU                           ║
╠══════════════════════════════════════════════════════════════╣
║  1. ➕ Add New Expense                                      ║
║  2. 👁️  View All Expenses                                   ║
║  3. 🔍 Search Expenses                                     ║
║  4. 📅 Monthly Report                                      ║
║  5. 📊 Weekly Report                                       ║
║  6. 📈 Trend Analysis                                      ║
║  7. ✏️  Edit Expense                                        ║
║  8. 🗑️  Delete Expense                                      ║
║  9. 💾 Export Report                                       ║
║ 10. 💰 Set Monthly Budget                                  ║
║  0. 🚪 Exit                                                ║
╚══════════════════════════════════════════════════════════════╝
```

### Adding Expenses
- **Date**: Enter YYYY-MM-DD format or press Enter for today
- **Category**: Choose meaningful categories (e.g., Groceries, Transportation)
- **Description**: Detailed description of the expense
- **Amount**: Positive dollar amount

### File Management
- **Automatic Saving**: Data is saved automatically after each operation
- **CSV Format**: Standard comma-separated values for easy import/export
- **Backup**: Original data is preserved in `expenses.csv`

## 📊 Sample Data

The application comes with a sample `expenses.csv` file containing realistic expense data across various categories:
- Groceries
- Transportation
- Entertainment
- Dining
- Shopping
- Utilities
- Healthcare

## 🎨 Color Scheme

- **🟢 Green**: Success messages and positive indicators
- **🔴 Red**: Error messages and budget warnings
- **🟡 Yellow**: Warning messages and approaching budget alerts
- **🔵 Blue**: Information and status updates
- **🟣 Magenta**: Titles and headers
- **🔵 Cyan**: General information

## 🏗️ Code Structure

### Main Components
- **`Expense` struct**: Holds expense data (date, category, description, amount)
- **`ExpenseManager` class**: Core functionality and data management
- **Helper functions**: Color printing, table formatting, date handling

### Key Methods
- `addExpense()`: Add new expenses with validation
- `viewAllExpenses()`: Display formatted expense table
- `searchExpenses()`: Multiple search options
- `monthlyReport()`: Comprehensive monthly analysis
- `weeklyReport()`: Weekly spending breakdown
- `trendAnalysis()`: Month-over-month comparison
- `editExpense()`: Modify existing expenses
- `deleteExpense()`: Remove expenses
- `exportReport()`: Generate external reports

## 🔒 Data Security

- **Local Storage**: All data is stored locally on your machine
- **Automatic Backup**: Data is automatically saved after each operation
- **No Internet**: No external data transmission or cloud storage

## 🚧 System Requirements

- **OS**: Windows 10/11 (uses Windows-specific console APIs)
- **Memory**: Minimal memory requirements
- **Storage**: Small disk space for CSV files
- **Display**: Console/terminal with ANSI color support

## 🎯 Best Practices

### Expense Categories
Use consistent, meaningful categories:
- **Groceries**: Food and household items
- **Transportation**: Gas, public transit, rideshares
- **Entertainment**: Movies, games, streaming services
- **Dining**: Restaurants, cafes, takeout
- **Shopping**: Clothes, electronics, home goods
- **Utilities**: Electricity, water, internet, phone
- **Healthcare**: Medical expenses, prescriptions

### Data Entry Tips
- **Consistent Dates**: Use YYYY-MM-DD format
- **Detailed Descriptions**: Include vendor names and item details
- **Regular Updates**: Enter expenses daily or weekly
- **Category Consistency**: Use the same category names consistently

## 🐛 Troubleshooting

### Common Issues
1. **Colors not displaying**: Ensure your terminal supports ANSI color codes
2. **File not found**: Check if `expenses.csv` exists in the same directory
3. **Compilation errors**: Ensure C++11 support and Windows headers are available

### Performance Tips
- Large expense files (>1000 entries) may slow down search operations
- Regular CSV exports help maintain performance
- Consider archiving old data periodically

## 🔮 Future Enhancements

Potential features for future versions:
- **Password Protection**: Secure access to expense data
- **Data Visualization**: Charts and graphs for spending patterns
- **Multiple Accounts**: Track expenses for different accounts
- **Receipt Storage**: Link receipts to expense entries
- **Budget Categories**: Set budgets for specific categories
- **Export Formats**: PDF, Excel, and other export options

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## 📞 Support

For questions or support, please check the code comments or create an issue in the project repository.

---

##Demo Image 
<img width="1890" height="912" alt="Screenshot 2025-08-14 182754" src="https://github.com/user-attachments/assets/5a162eb1-de43-4a01-81d8-e33aac384473" />
<img width="1896" height="921" alt="Screenshot 2025-08-14 183632" src="https://github.com/user-attachments/assets/91b94660-c4e1-4e7c-991f-776f1989b405" />

**Happy Expense Tracking! 💰📊** 
