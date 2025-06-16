# URL Shortener Backend

A secure, authenticated URL shortener API built with Node.js, Express, and TypeScript following MVC architecture patterns.

## 🚀 Features

- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **URL Shortening**: Generate short URLs using NanoID for authenticated users
- **MVC Architecture**: Clean, maintainable code structure
- **TypeScript**: Full type safety and enhanced developer experience
- **RESTful API**: Well-structured API endpoints
- **Input Validation**: Comprehensive request validation and error handling

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **ID Generation**: NanoID
- **Database**: MongoDB



## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- [Database system] installed and running

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/url-shortener-backend.git
   cd url-shortener-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`


## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with configurable salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: All inputs are validated and sanitized
- **Error Handling**: Comprehensive error handling without exposing sensitive information
- **Rate Limiting**: [If implemented] API rate limiting to prevent abuse

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📝 Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start           # Start production server
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint issues
npm test            # Run tests
```


## 🤖 AI-Assisted Development

This project was developed with assistance from AI tools including ChatGPT and other AI coding assistants. These tools significantly enhanced:

- **Development Speed**: AI assistance helped rapidly scaffold the MVC architecture and implement authentication patterns
- **Code Quality**: AI suggestions improved error handling, security practices, and TypeScript type definitions
- **Best Practices**: AI guidance ensured adherence to Node.js and Express.js best practices
- **Documentation**: AI assistance in creating comprehensive API documentation and README structure

The use of AI tools allowed for faster prototyping while maintaining high code quality standards and security best practices.

## 🔄 Changelog

### v1.0.0
- Initial release with full authentication and URL shortening functionality
- JWT-based authentication
- MVC architecture implementation
- TypeScript integration

**Note**: This project was completed as part of a 96-hour development challenge, demonstrating rapid full-stack development capabilities with modern web technologies.
