# CVKU - Your Digital CV Portfolio

CVKU is a powerful web application that helps you create, manage, and share your CV with ease. It allows users to build personalized portfolios, complete with interactive features, and provides a seamless experience for managing your professional information.

---

## Features

- **Create and Manage Your CV**: Build your professional CV with ease.
- **Share Your Portfolio**: Generate a unique URL for your portfolio to share with recruiters, potential clients, or anyone interested in your work.
- **Easy-to-use Editor**: An intuitive editor that lets you add sections like education, skills, work experience, and more.
- **CV Templates**: Customize your CV with pre-designed templates.
- **Multi-language Support**: Switch between multiple languages for your CV.
- **Subscription-based**: Various subscription tiers with exclusive features.

---

## Table of Contents

1. [Installation](#installation)
2. [Technologies Used](#technologies-used)
3. [Features](#features)
4. [Deployment](#deployment)
5. [Contributing](#contributing)
6. [License](#license)

---

## Installation

To set up CVKU locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/dimasgusti/cvku.git

	2.	Navigate to the project directory:

cd cvku


	3.	Install the dependencies:

npm install


	4.	Set up the environment variables:
Create a .env.local file in the root of the project and configure the necessary variables like database URLs, API keys, etc.
	5.	Start the development server:

npm run dev


	6.	Open your browser and navigate to http://localhost:3000.

Technologies Used
	•	Frontend: React, Next.js, TypeScript, TailwindCSS
	•	Backend: Node.js, Express (for APIs)
	•	Database: MongoDB
	•	Authentication: NextAuth.js (with Google and GitHub OAuth for login)
	•	Payment Gateway: Mayar (for subscription and manual payments)
	•	Storage: Firebase Storage (for media uploads)

Deployment

To deploy CVKU to production, follow these steps:
	1.	Create a production build:

npm run build


	2.	Deploy to your chosen hosting provider (e.g., Vercel, Netlify, or your custom server).
	3.	Set up the environment variables in the production environment.

Contributing

We welcome contributions to CVKU! If you’d like to help improve this project, feel free to:
	1.	Fork the repository.
	2.	Create a new branch (git checkout -b feature/your-feature).
	3.	Make your changes.
	4.	Commit your changes (git commit -am 'Add new feature').
	5.	Push to your branch (git push origin feature/your-feature).
	6.	Open a pull request.

License

CVKU is open-source and available under the MIT License. See the LICENSE file for more details.

Contact

If you have any questions or suggestions, feel free to reach out to me at [dimasgustiwork@gmail.com].

Thank you for using CVKU!

### Explanation:

- **Introduction**: Describes what CVKU is and its key features.
- **Installation**: Step-by-step guide on how to set up the project locally.
- **Technologies Used**: A list of key technologies used in the project.
- **API Documentation**: Overview of some basic API routes that interact with the backend.
- **Deployment**: Instructions for deploying the project to production.
- **Contributing**: Guidelines on how others can contribute to the project.
- **License**: Specifies the license used for the project.
