# 🌐 Smart Personal Expense Tracker - Web App

A beautiful, modern web application for tracking personal expenses with an intuitive interface and powerful features.

## 🚀 Features

### 💰 Expense Management
- **Add Expenses**: Add new expenses with date, category, description, and amount (in ₹)
- **Edit & Delete**: Modify or remove existing expenses
- **Sort & Filter**: Sort by date, amount, or category; filter by category
- **Search**: Search expenses by keyword, date, or category

### 📊 Reports & Analytics
- **Monthly Reports**: View spending patterns and budget status
- **Category Analysis**: Visual charts showing spending by category
- **Trend Analysis**: Track spending trends over time
- **Budget Tracking**: Monitor monthly budget with visual progress bar

### 🤝 Loan Management
- **Add Loans**: Track money given or taken with person details
- **Loan Status**: Mark loans as Active, Returned, or Partial
- **Loan Summary**: View total given, taken, and net amounts
- **Filter & Sort**: Filter loans by type and status

### 👤 User Profile & SMS Export
- **Profile Management**: Create and manage your personal profile
- **Contact Details**: Store name, phone number, and email
- **SMS Export**: Automatically send expense summaries via SMS
- **Export Settings**: Enable/disable SMS and CSV export features
- **Profile Summary**: View profile status in the sidebar

### 📱 SMS Export Feature
- **Automatic SMS**: When you export data, get SMS summary automatically
- **Smart Summary**: Includes total expenses, monthly spending, loan status
- **Multiple Options**: Uses Web Share API or SMS app integration
- **Preview Modal**: Review SMS content before sending
- **Budget Remaining**: Shows how much budget is left for the month

## 🎯 How to Use

### Setting Up Your Profile
1. Click the **"Profile"** button in the action bar
2. Fill in your **Name** and **Phone Number** (required)
3. Add your **Email** (optional)
4. Choose **SMS Export** and **Export CSV** preferences
5. Click **"Save Profile"**

### Using SMS Export
1. Set up your profile with phone number
2. Enable SMS export in profile settings
3. Click **"Export"** button to download CSV
4. SMS summary will be sent automatically to your number
5. Review and send the SMS from your default SMS app

### Profile Summary
- View your profile status in the sidebar
- See SMS and CSV export settings
- Quick access to edit profile
- Shows contact information when set up

## 🔧 Technical Details

### SMS Export Implementation
- **Web Share API**: Uses native sharing on supported devices
- **SMS Fallback**: Creates SMS links for unsupported devices
- **Preview Modal**: Shows SMS content before sending
- **Smart Formatting**: Optimized message length for SMS

### Data Persistence
- **localStorage**: All data saved locally in browser
- **Profile Data**: User details, preferences, and settings
- **Export History**: Tracks export preferences and settings

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Support**: Responsive design for mobile devices
- **SMS Integration**: Works with default SMS apps 