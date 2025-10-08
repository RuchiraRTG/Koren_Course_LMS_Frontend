# Korean LMS Platform 🇰🇷

A modern, full-featured Learning Management System for Korean language education built with React, Tailwind CSS, and React Router.

## 🌟 Features

### Authentication System
- **Sign Up Page**: Complete registration with first name, last name, NIC number, phone number, email, and password
- **Sign In Page**: Secure login with automatic redirection to appropriate dashboards
- **Form Validation**: Client-side validation for all input fields

### Student Dashboard (Home Page)
- Personalized welcome with Korean greeting (안녕하세요!)
- Learning progress overview with statistics
- Continue learning section with course progress bars
- Announcements and notifications
- Quick action buttons for common tasks
- Mobile-responsive design

### Admin Dashboard
- **Sidebar Navigation**: Easy access to all admin features
  - Dashboard Overview
  - Student Management
  - Courses (Coming soon)
  - Question Bank
  - Settings (Coming soon)
  
- **Student Management**:
  - Add new students with Korean name (한글 이름) and batch number
  - View all students in a responsive table
  - Search and filter functionality
  - Edit student details
  - Delete students with confirmation
  - Display NIC number, phone, email, and batch information

- **Question Management**:
  - Create multiple-choice and text-based questions
  - Categorize by difficulty (Beginner, Intermediate, Advanced)
  - Add topic categories
  - Edit existing questions
  - Delete questions with confirmation
  - Visual display of correct answers
  - Search and filter questions

- **Dashboard Overview**:
  - Real-time statistics (students, courses, questions, enrollments)
  - Recent activity feed
  - Upcoming events calendar
  - Learning progress metrics

## 🎨 Design Features

- **Modern UI**: Clean, professional design using Tailwind CSS
- **Custom Color Scheme**: Primary blue theme with Korean-inspired orange accents
- **Korean Font**: Noto Sans KR for proper Korean character display
- **Mobile Responsive**: Fully responsive design for all screen sizes
- **Smooth Animations**: Transitions and hover effects for better UX
- **Accessible**: Proper contrast ratios and semantic HTML

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 18.0.0)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd Koren_Lms
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## 🔐 Demo Accounts

### Admin Access
- **Email**: admin@korean-lms.com
- **Password**: password123
- **Redirects to**: Admin Dashboard

### Student Access
- **Email**: student@korean-lms.com
- **Password**: password123
- **Redirects to**: Student Home Page

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🛠️ Technology Stack

- **Frontend Framework**: React 19.1.1
- **Styling**: Tailwind CSS 3.x
- **Routing**: React Router DOM 6.x
- **Icons**: Lucide React
- **Build Tool**: Vite 5.x
- **UI Components**: Headless UI

## 📁 Project Structure

```
Koren_Lms/
├── src/
│   ├── pages/
│   │   ├── SignUp.jsx           # User registration
│   │   ├── SignIn.jsx           # User login
│   │   ├── Home.jsx             # Student dashboard
│   │   ├── AdminDashboard.jsx   # Admin layout with sidebar
│   │   ├── DashboardOverview.jsx # Admin home
│   │   ├── Students.jsx         # Student management
│   │   └── Questions.jsx        # Question bank
│   ├── components/              # Reusable components
│   ├── App.jsx                  # Main app with routing
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles with Tailwind
├── public/
├── index.html
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
├── vite.config.js               # Vite configuration
└── package.json
```

## 🎯 Key Components

### Student Management
- **Fields**: First Name, Last Name, Korean Name (한글 이름), Batch Number, Email, Phone, NIC Number
- **Actions**: Add, Edit, Delete, Search
- **Display**: Responsive table with mobile optimization

### Question Bank
- **Types**: Multiple Choice, Text Answer
- **Attributes**: Question text, Options (for MC), Correct Answer, Difficulty, Category
- **Actions**: Create, Edit, Delete, Search/Filter
- **Visual Feedback**: Color-coded difficulty levels and correct answer highlighting

### Navigation
- **Public Routes**: /, /signup, /signin
- **Student Routes**: /home
- **Admin Routes**: /admin, /admin/students, /admin/questions, /admin/courses, /admin/settings

## 🌐 Features Summary

✅ Complete authentication system (Sign Up / Sign In)  
✅ Student dashboard with learning progress  
✅ Admin dashboard with sidebar navigation  
✅ Student management (CRUD operations)  
✅ Question bank management (CRUD operations)  
✅ Korean language support (한글)  
✅ Batch number tracking  
✅ Mobile-responsive design  
✅ Modern, clean UI with Tailwind CSS  
✅ Form validation  
✅ Search and filter functionality  

## 🔮 Future Enhancements

- Backend API integration
- User authentication with JWT
- Course management system
- Quiz and assessment features
- Student progress tracking
- File upload for course materials
- Real-time notifications
- User profile management
- Advanced analytics and reporting
- Multi-language support

## 📄 License

This project is built for educational purposes.

## 👨‍💻 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide React for beautiful icons
- Noto Sans KR font by Google Fonts

---

**Happy Learning Korean! 화이팅! 🇰🇷**