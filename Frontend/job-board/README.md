# Wazafny-Style Job Board

A modern, fully responsive job board web application built with React, Tailwind CSS, and JSON Server for mock API.

## Features

### For Job Seekers
- Browse and search thousands of job listings
- Advanced filtering (location, category, job type, remote, experience level)
- Apply for jobs with cover letter and resume
- Track application status
- Personal dashboard to manage applications
- User-friendly interface with modern design

### For Employers
- Post unlimited job listings
- Edit and delete job postings
- View and manage applications
- Company profile
- Employer dashboard

### General Features
- Modern, clean UI inspired by Wazafny
- Fully responsive design (mobile, tablet, desktop)
- Real-time search and filtering
- Mock REST API with JSON Server
- Authentication system (simulated)
- Floating animated info cards
- Company showcase section

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context API
- **API**: Fetch API with JSON Server (mock backend)
- **Icons**: Heroicons (via Tailwind)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd Frontend/job-board
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

You need to run two servers:

1. **Start the JSON Server (Mock API)** - Terminal 1:
```bash
npm run server
```
This will start the API server on `http://localhost:5000`

2. **Start the React Development Server** - Terminal 2:
```bash
npm run dev
```
This will start the app on `http://localhost:3000`

3. Open your browser and visit `http://localhost:3000`

## Demo Credentials

### Job Seeker Account
- Email: `seeker@example.com`
- Password: `password123`

### Employer Account
- Email: `employer@google.com`
- Password: `password123`

## Project Structure

```
job-board/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable components
│   │   └── layout/      # Layout components (Navbar, Footer)
│   ├── context/         # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── JobContext.jsx
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── JobListings.jsx
│   │   ├── JobDetails.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── EmployerDashboard.jsx
│   │   ├── JobSeekerDashboard.jsx
│   │   ├── Companies.jsx
│   │   └── Services.jsx
│   ├── services/        # API service layer
│   │   └── api.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── db.json              # Mock database
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## API Endpoints

The JSON Server provides the following endpoints:

- `GET /jobs` - Get all jobs
- `GET /jobs/:id` - Get job by ID
- `POST /jobs` - Create new job
- `PUT /jobs/:id` - Update job
- `DELETE /jobs/:id` - Delete job
- `GET /companies` - Get all companies
- `GET /users` - Get all users
- `POST /users` - Create new user
- `GET /applications` - Get all applications
- `POST /applications` - Create new application

## Features in Detail

### Search & Filter
- Search by job title, keywords, or company name
- Filter by location, category, job type, remote/on-site, and experience level
- Real-time filtering with instant results

### Job Application
- Apply with cover letter and resume link
- Track application status (pending, accepted, rejected)
- View all applications in dashboard

### Employer Features
- Create detailed job postings with requirements and benefits
- Edit existing job listings
- Delete job postings
- View all applicants with their details
- Manage multiple job postings

### Authentication
- Separate login for employers and job seekers
- Registration with role selection
- Protected routes for dashboards
- Session persistence with localStorage

## Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
colors: {
  wazafny: {
    blue: '#2557a7',
    darkBlue: '#164081',
    lightBlue: '#e7f0fa',
  }
}
```

### Mock Data
Edit `db.json` to add more jobs, companies, or users.

## Building for Production

```bash
npm run build
```

The build files will be in the `dist/` directory.

## Future Enhancements

- Real backend integration (Node.js/Express or Django)
- Database integration (MongoDB or PostgreSQL)
- Email notifications
- Advanced search with AI recommendations
- Video interviews
- Chat system between employers and candidates
- Resume parser
- Dark mode
- Multi-language support

## License

MIT License

## Author

Created with ❤️ using React and Tailwind CSS
