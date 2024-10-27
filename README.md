# Job Application Tracker

This is a full-stack job application tracking system built with [Next.js](https://nextjs.org), Firebase, and MySQL. The application helps users track their job applications while providing admin functionality for managing users and applications.

## Features

- User Authentication (Firebase Authentication)
- Role-based Access Control (User and Admin roles)
- CRUD operations for Job Applications
- Admin Dashboard to manage users and job applications
- Firebase Admin SDK integration
- Responsive UI with Tailwind CSS

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes, Firebase Admin SDK
- **Database**: MySQL with Sequelize ORM
- **Authentication**: Firebase Authentication (Google and Email sign-in)

## Getting Started

First, clone the repository and install the dependencies:

```bash
# Clone the repository
git clone https://github.com/your-username/job-application-tracker.git

# Navigate to the project directory
cd job-application-tracker

# Install dependencies
npm install
```

Next, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment Variables

Create a `.env.local` file in the root of your project and add the following environment variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

### Running the Application

- **Development**: Run `npm run dev` to start the development server.
- **Production**: Run `npm run build` to build the application, followed by `npm start` to start the server.

## Project Structure

- `app/`: Contains the main application logic, pages, and components.
- `lib/`: Contains utility files and Firebase configuration.
- `models/`: Sequelize models for MySQL database.
- `context/`: React context for managing authentication state.

## API Endpoints

- `/api/users/[uid]`: Get user details by UID.
- `/api/admin/jobs`: Fetch all job applications (admin only).
- `/api/admin/users`: Fetch all users (admin only).

## How to Use

1. **Sign Up**: Create an account using email/password or Google.
2. **Track Job Applications**: Add, edit, or delete job applications.
3. **Admin Features**: Admin users can view and manage all users and job applications.

## Learn More

To learn more about the technologies used in this project, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Firebase Documentation](https://firebase.google.com/docs) - Learn how to use Firebase for authentication and backend services.
- [Sequelize Documentation](https://sequelize.org/docs/v6/) - Learn about Sequelize for interacting with MySQL.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

This project is licensed under the MIT License.
