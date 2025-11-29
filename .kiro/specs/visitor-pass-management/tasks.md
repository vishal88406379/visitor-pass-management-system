# Implementation Plan

- [x] 1. Set up project structure and dependencies



  - Initialize Node.js backend with Express
  - Initialize React frontend with Create React App or Vite
  - Install core dependencies (mongoose, bcrypt, jsonwebtoken, cors, dotenv)
  - Install frontend dependencies (react-router-dom, axios)
  - Create directory structure for backend (routes, controllers, models, middleware, services, utils)
  - Create directory structure for frontend (components, pages, services, context, hooks, utils)
  - Set up environment configuration files (.env.example)
  - _Requirements: 15.1, 15.2, 15.5_

- [ ] 2. Implement database models and schemas
- [x] 2.1 Create User model with validation


  - Define User schema with email, password, firstName, lastName, role, phone, department, isActive
  - Add email uniqueness constraint and validation
  - Add role enum validation (admin, security, employee, visitor)
  - Add timestamps
  - _Requirements: 5.5, 14.1_



- [ ] 2.2 Create Visitor model with validation
  - Define Visitor schema with firstName, lastName, email, phone, company, photo, idType, idNumber, purpose
  - Add reference to User (createdBy)
  - Add validation for required fields
  - Add timestamps


  - _Requirements: 2.1, 14.1_


- [ ] 2.3 Create Appointment model with validation
  - Define Appointment schema with visitor, host, scheduledDate, scheduledTime, purpose, status, location, notes


  - Add references to Visitor and User
  - Add status enum validation (pending, approved, rejected, cancelled, completed)
  - Add timestamps
  - _Requirements: 3.1, 14.1_



- [ ] 2.4 Create Pass model with validation
  - Define Pass schema with passNumber, visitor, appointment, qrCode, qrCodeImage, validFrom, validUntil, isActive, issuedBy
  - Add references to Visitor, Appointment, and User
  - Add unique constraint on passNumber
  - Add timestamps
  - _Requirements: 2.4, 14.1_

- [ ] 2.5 Create CheckLog model with validation
  - Define CheckLog schema with visitor, pass, checkInTime, checkOutTime, checkInBy, checkOutBy, location, notes
  - Add references to Visitor, Pass, and User
  - Add timestamps
  - _Requirements: 10.1, 10.2, 14.1_



- [ ]* 2.6 Write property test for referential integrity
  - **Property 39: Referential Integrity**
  - **Validates: Requirements 14.2**

- [ ]* 2.7 Write property test for document population
  - **Property 41: Document Population**
  - **Validates: Requirements 14.5**



- [ ] 3. Implement authentication and authorization
- [ ] 3.1 Create password hashing utilities
  - Implement password hashing function using bcrypt
  - Implement password comparison function


  - Set salt rounds to 10 or higher
  - _Requirements: 5.5_

- [x]* 3.2 Write property test for password security


  - **Property 2: Password Security**
  - **Validates: Requirements 5.5**

- [ ] 3.3 Create JWT token generation and verification
  - Implement JWT token generation with user ID and role
  - Implement JWT token verification middleware
  - Set token expiration to 1 hour
  - _Requirements: 5.2, 5.3_



- [ ] 3.4 Create authentication middleware
  - Implement middleware to verify JWT tokens
  - Extract user information from token
  - Handle expired and invalid tokens
  - _Requirements: 5.3, 5.4_

- [ ] 3.5 Create role-based authorization middleware
  - Implement middleware to check user roles
  - Create role checking functions (isAdmin, isSecurity, isEmployee)

  - Return 403 for insufficient permissions
  - _Requirements: 5.3_

- [ ]* 3.6 Write property test for authentication and JWT generation
  - **Property 1: Authentication and JWT Generation**


  - **Validates: Requirements 1.1, 5.1, 5.2, 5.3**

- [ ] 4. Implement authentication API endpoints
- [x] 4.1 Create user registration endpoint


  - Implement POST /api/auth/register (admin only)
  - Validate user input
  - Hash password before storing
  - Return created user (without password)
  - _Requirements: 1.2_

- [ ]* 4.2 Write property test for user creation and role assignment
  - **Property 3: User Creation and Role Assignment**
  - **Validates: Requirements 1.2**

- [ ] 4.3 Create login endpoint
  - Implement POST /api/auth/login
  - Validate credentials
  - Generate and return JWT token
  - _Requirements: 1.1, 5.1_

- [ ] 4.4 Create current user endpoint
  - Implement GET /api/auth/me
  - Return current user profile from token
  - _Requirements: 1.1_



- [ ] 5. Implement input validation middleware
- [ ] 5.1 Create validation utilities
  - Implement email format validation
  - Implement phone number format validation


  - Implement required fields validation
  - Implement file type and size validation
  - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [ ]* 5.2 Write property test for email format validation
  - **Property 33: Email Format Validation**
  - **Validates: Requirements 11.2**

- [ ]* 5.3 Write property test for phone number format validation
  - **Property 34: Phone Number Format Validation**
  - **Validates: Requirements 11.3**

- [ ]* 5.4 Write property test for required fields validation
  - **Property 32: Input Validation - Required Fields**
  - **Validates: Requirements 11.1, 11.5**

- [ ]* 5.5 Write property test for file upload validation
  - **Property 35: File Upload Validation**
  - **Validates: Requirements 11.4**

- [ ] 5.6 Create validation middleware for routes
  - Implement middleware to validate request bodies
  - Return 400 with clear error messages for validation failures
  - _Requirements: 11.5_

- [ ] 6. Implement visitor management
- [ ] 6.1 Create file upload middleware for photos
  - Configure multer for image uploads
  - Set file size limits
  - Set allowed file types (jpg, png, jpeg)
  - Store files in uploads directory
  - _Requirements: 6.2_

- [ ]* 6.2 Write property test for image validation
  - **Property 20: Image Validation**
  - **Validates: Requirements 6.2**

- [ ] 6.3 Create visitor registration endpoint
  - Implement POST /api/visitors
  - Accept visitor details and photo
  - Validate input data
  - Store visitor record
  - Return created visitor
  - _Requirements: 2.1_

- [ ] 6.4 Create visitor photo upload endpoint
  - Implement POST /api/visitors/:id/photo
  - Accept and validate image file
  - Update visitor record with photo path
  - _Requirements: 6.2, 6.3_

- [ ]* 6.5 Write property test for photo storage and retrieval
  - **Property 18: Photo Storage and Retrieval**
  - **Validates: Requirements 6.3, 6.5**

- [ ] 6.6 Create visitor list endpoint with search and filters
  - Implement GET /api/visitors
  - Support search by name, email, phone
  - Support date range filters
  - Support pagination
  - _Requirements: 1.4, 8.1_

- [ ]* 6.7 Write property test for search and filter correctness
  - **Property 13: Search and Filter Correctness**
  - **Validates: Requirements 1.4, 8.1, 8.2, 8.3**

- [ ] 6.8 Create visitor details endpoint
  - Implement GET /api/visitors/:id
  - Populate related data
  - Return visitor with photo
  - _Requirements: 6.5_

- [ ] 6.9 Create visitor update endpoint
  - Implement PUT /api/visitors/:id
  - Validate updated data
  - Update visitor record
  - _Requirements: 2.1_

- [ ] 7. Implement appointment management
- [ ] 7.1 Create appointment creation endpoint
  - Implement POST /api/appointments
  - Accept appointment details
  - Set status to pending
  - Create appointment record
  - _Requirements: 3.1, 4.1_

- [ ]* 7.2 Write property test for appointment creation and status
  - **Property 9: Appointment Creation and Status**
  - **Validates: Requirements 3.1, 4.1**

- [ ] 7.3 Create appointment list endpoint with filters
  - Implement GET /api/appointments
  - Support filtering by status, date, host
  - Support pagination
  - Populate visitor and host details
  - _Requirements: 3.3_

- [ ]* 7.4 Write property test for appointment filtering by host
  - **Property 12: Appointment Filtering by Host**
  - **Validates: Requirements 3.3**



- [ ] 7.5 Create appointment details endpoint
  - Implement GET /api/appointments/:id
  - Populate all related data
  - _Requirements: 3.3_

- [ ] 7.6 Create my appointments endpoint
  - Implement GET /api/appointments/my-appointments


  - Return appointments for current user
  - _Requirements: 3.3_

- [ ] 7.7 Create appointment approval endpoint
  - Implement PATCH /api/appointments/:id/approve
  - Update status to approved
  - Trigger pass generation
  - Send notification to visitor
  - _Requirements: 3.2, 3.4_

- [ ] 7.8 Create appointment cancellation endpoint
  - Implement PATCH /api/appointments/:id/cancel
  - Update status to cancelled
  - Send cancellation notification
  - _Requirements: 3.5_

- [ ] 8. Implement QR code generation and pass management
- [ ] 8.1 Install QR code library
  - Install qrcode npm package
  - _Requirements: 2.4_

- [ ] 8.2 Create QR code generation service
  - Implement function to generate QR code from pass data
  - Return QR code as base64 image
  - _Requirements: 2.4_

- [ ]* 8.3 Write property test for QR code round-trip
  - **Property 5: QR Code Round-Trip**
  - **Validates: Requirements 12.2**

- [ ] 8.4 Create pass generation service
  - Implement function to generate unique pass number
  - Create pass record with QR code
  - Set validity period
  - _Requirements: 2.4, 4.2_

- [ ]* 8.5 Write property test for visitor registration and pass generation
  - **Property 4: Visitor Registration and Pass Generation**
  - **Validates: Requirements 2.1, 2.4, 4.2**

- [ ] 8.6 Create pass issuance endpoint
  - Implement POST /api/passes
  - Generate pass with QR code
  - Link to visitor and appointment
  - Return pass details
  - _Requirements: 2.1, 2.4_

- [ ]* 8.7 Write property test for pass photo inclusion
  - **Property 19: Pass Photo Inclusion**
  - **Validates: Requirements 6.4**

- [ ] 8.8 Create pass details endpoint
  - Implement GET /api/passes/:id
  - Populate visitor and appointment data


  - Return pass with QR code
  - _Requirements: 4.3_

- [ ]* 8.9 Write property test for digital pass display completeness
  - **Property 27: Digital Pass Display Completeness**
  - **Validates: Requirements 4.3**

- [ ] 8.10 Create QR code image endpoint
  - Implement GET /api/passes/qr/:passId
  - Return QR code image
  - _Requirements: 2.4_

- [ ] 8.11 Create pass verification endpoint
  - Implement POST /api/passes/verify
  - Decode QR code data
  - Validate pass
  - Return pass details if valid
  - _Requirements: 12.2_

- [ ]* 8.12 Write property test for QR code scan processing
  - **Property 36: QR Code Scan Processing**
  - **Validates: Requirements 12.3**

- [ ]* 8.13 Write property test for invalid QR code rejection
  - **Property 37: Invalid QR Code Rejection**
  - **Validates: Requirements 12.4**

- [ ] 9. Implement PDF badge generation
- [ ] 9.1 Install PDF generation library
  - Install pdfkit npm package
  - _Requirements: 9.1_

- [ ] 9.2 Create PDF badge generation service
  - Implement function to generate PDF badge
  - Include QR code, visitor photo, visit details
  - Include organization branding
  - Format for standard paper printing
  - _Requirements: 9.2, 9.3, 9.4, 9.5_

- [ ]* 9.3 Write property test for PDF badge generation and content
  - **Property 25: PDF Badge Generation and Content**
  - **Validates: Requirements 9.1, 9.2, 9.4, 9.5**

- [ ]* 9.4 Write property test for PDF format for printing
  - **Property 26: PDF Format for Printing**
  - **Validates: Requirements 9.3**

- [ ] 9.5 Create PDF download endpoint
  - Implement GET /api/passes/:id/pdf
  - Generate PDF badge
  - Return PDF file for download
  - _Requirements: 4.5, 9.1_

- [ ]* 9.6 Write property test for PDF download availability
  - **Property 28: PDF Download Availability**
  - **Validates: Requirements 4.5**

- [ ] 10. Implement check-in and check-out functionality
- [ ] 10.1 Create check-in endpoint
  - Implement POST /api/checklogs/checkin
  - Verify pass validity
  - Create check log entry with timestamp
  - Record security user who performed scan
  - Trigger host notification
  - _Requirements: 2.2, 10.1, 10.4_

- [ ]* 10.2 Write property test for check-in logging
  - **Property 6: Check-In Logging**
  - **Validates: Requirements 2.2, 10.1, 10.4**

- [ ] 10.3 Create check-out endpoint
  - Implement POST /api/checklogs/checkout
  - Find existing check-in log
  - Update with check-out timestamp
  - Record security user who performed scan
  - _Requirements: 2.3, 10.2_



- [ ]* 10.4 Write property test for check-out logging
  - **Property 7: Check-Out Logging**
  - **Validates: Requirements 2.3, 10.2**

- [ ] 10.5 Create active visitors endpoint
  - Implement GET /api/checklogs/active
  - Return visitors currently checked in (no check-out time)
  - _Requirements: 2.5_

- [ ]* 10.6 Write property test for active visitors list accuracy
  - **Property 8: Active Visitors List Accuracy**
  - **Validates: Requirements 2.5**

- [ ] 10.7 Create check logs list endpoint
  - Implement GET /api/checklogs
  - Support filtering by date range, visitor name
  - Support pagination
  - _Requirements: 10.3, 10.5_

- [ ]* 10.8 Write property test for check log filtering
  - **Property 30: Check Log Filtering**
  - **Validates: Requirements 10.5**

- [ ] 10.9 Create visitor check history endpoint
  - Implement GET /api/checklogs/visitor/:visitorId
  - Return all check logs for a visitor
  - _Requirements: 10.3_

- [ ] 11. Implement notification services
- [ ] 11.1 Install notification libraries
  - Install nodemailer for email
  - Install twilio for SMS (optional)
  - _Requirements: 7.1_

- [ ] 11.2 Create email notification service
  - Configure nodemailer with SMTP settings
  - Implement function to send emails
  - Create email templates for different notification types
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 11.3 Create SMS notification service (optional)
  - Configure Twilio with credentials
  - Implement function to send SMS
  - _Requirements: 7.5_

- [ ] 11.4 Create notification service for appointment events
  - Implement notification for appointment creation
  - Implement notification for appointment approval
  - Implement notification for appointment cancellation
  - Include appointment details in notifications
  - _Requirements: 7.2, 7.4_

- [ ]* 11.5 Write property test for notification content accuracy
  - **Property 21: Notification Content Accuracy**
  - **Validates: Requirements 7.2, 7.4**

- [ ]* 11.6 Write property test for appointment approval workflow
  - **Property 10: Appointment Approval Workflow**
  - **Validates: Requirements 3.2, 3.4, 4.2, 7.1**

- [ ]* 11.7 Write property test for appointment cancellation workflow
  - **Property 11: Appointment Cancellation Workflow**
  - **Validates: Requirements 3.5, 7.3**

- [ ] 11.8 Create notification service for visitor arrival
  - Implement notification to host when visitor checks in
  - Include visitor name and check-in time
  - _Requirements: 13.1, 13.2_

- [ ]* 11.9 Write property test for host notification on visitor arrival
  - **Property 22: Host Notification on Visitor Arrival**
  - **Validates: Requirements 13.1, 13.2**

- [ ]* 11.10 Write property test for multiple visitor notifications
  - **Property 23: Multiple Visitor Notifications**
  - **Validates: Requirements 13.3**

- [ ] 11.11 Create invitation notification service
  - Implement notification with registration link
  - _Requirements: 4.4_

- [ ]* 11.12 Write property test for invitation notification with registration link
  - **Property 29: Invitation Notification with Registration Link**
  - **Validates: Requirements 4.4**

- [ ] 12. Implement analytics and reporting
- [ ] 12.1 Create analytics dashboard endpoint
  - Implement GET /api/analytics/dashboard
  - Calculate total visits
  - Calculate active visitors
  - Calculate visitor trends
  - _Requirements: 1.3_

- [ ]* 12.2 Write property test for analytics accuracy
  - **Property 16: Analytics Accuracy**
  - **Validates: Requirements 1.3**

- [ ] 12.3 Create data export endpoint
  - Implement GET /api/analytics/export
  - Support filtering by date range, status
  - Generate CSV file with visitor data
  - _Requirements: 1.5_

- [ ]* 12.4 Write property test for data export completeness
  - **Property 17: Data Export Completeness**
  - **Validates: Requirements 1.5**

- [ ] 13. Implement user management endpoints (admin)
- [ ] 13.1 Create user list endpoint
  - Implement GET /api/users (admin only)
  - Support pagination
  - _Requirements: 1.2_

- [ ] 13.2 Create user details endpoint
  - Implement GET /api/users/:id (admin only)
  - Return user without password
  - _Requirements: 1.2_

- [ ] 13.3 Create user update endpoint
  - Implement PUT /api/users/:id (admin only)
  - Validate updated data
  - Update user record
  - _Requirements: 1.2_



- [ ] 13.4 Create user delete endpoint
  - Implement DELETE /api/users/:id (admin only)
  - Handle cascading updates to related records
  - _Requirements: 1.2_


- [ ]* 13.5 Write property test for cascade delete handling
  - **Property 40: Cascade Delete Handling**
  - **Validates: Requirements 14.4**

- [ ] 13.6 Create user role update endpoint
  - Implement PATCH /api/users/:id/role (admin only)
  - Validate role value
  - Update user role
  - _Requirements: 1.2_

- [ ] 14. Implement sorting and pagination utilities
- [ ] 14.1 Create pagination helper function
  - Implement function to calculate skip and limit
  - Return pagination metadata



  - _Requirements: 8.5_

- [ ]* 14.2 Write property test for pagination correctness
  - **Property 15: Pagination Correctness**
  - **Validates: Requirements 8.5**

- [ ] 14.3 Create sorting helper function
  - Implement function to parse sort parameters
  - Apply sorting to queries
  - _Requirements: 8.4_

- [ ]* 14.4 Write property test for sort order correctness
  - **Property 14: Sort Order Correctness**
  - **Validates: Requirements 8.4**

- [ ] 15. Implement error handling middleware
- [ ] 15.1 Create global error handler
  - Implement middleware to catch all errors
  - Format error responses consistently
  - Log errors for debugging
  - Return appropriate HTTP status codes
  - _Requirements: 11.5_

- [ ] 15.2 Create 404 handler
  - Implement middleware for undefined routes
  - Return 404 Not Found
  - _Requirements: 11.5_

- [ ] 16. Set up database connection and initialization
- [ ] 16.1 Create database connection module
  - Implement MongoDB connection using mongoose
  - Handle connection errors
  - _Requirements: 14.1_

- [ ] 16.2 Create database initialization script
  - Create collections if they don't exist
  - Create indexes for performance
  - _Requirements: 14.1, 14.3_

- [ ] 16.3 Create seed data script
  - Create sample admin user
  - Create sample security user
  - Create sample employee user
  - Create sample visitors and appointments
  - _Requirements: 1.2_

- [ ] 17. Checkpoint - Ensure all backend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 18. Build React frontend structure
- [ ] 18.1 Set up React Router
  - Configure routes for all pages
  - Implement protected routes
  - _Requirements: 15.2_

- [ ] 18.2 Create authentication context
  - Implement context for user authentication state
  - Provide login, logout, and token management functions
  - _Requirements: 5.3_

- [ ] 18.3 Create API service module
  - Implement axios instance with base URL
  - Add request interceptor to include JWT token
  - Add response interceptor for error handling
  - _Requirements: 5.3_

- [ ] 18.4 Create authentication service functions
  - Implement login API call
  - Implement register API call
  - Implement get current user API call
  - _Requirements: 1.1, 1.2_

- [ ] 19. Build authentication pages
- [ ] 19.1 Create Login page
  - Build login form with email and password
  - Implement form validation
  - Handle login submission
  - Store JWT token
  - Redirect to dashboard on success
  - _Requirements: 1.1_

- [ ] 19.2 Create visitor pre-registration page
  - Build registration form for visitors
  - Include fields for visitor details
  - Implement form validation
  - Handle form submission
  - _Requirements: 4.1_

- [ ] 20. Build dashboard pages
- [ ] 20.1 Create admin dashboard
  - Display visitor statistics
  - Display active visitors count
  - Display recent activity
  - _Requirements: 1.3_

- [ ] 20.2 Create security dashboard
  - Display active visitors list
  - Provide quick access to check-in/out
  - Display recent check logs
  - _Requirements: 2.5_

- [ ] 20.3 Create employee dashboard
  - Display user's appointments
  - Display pending approvals
  - Display recent visitor arrivals
  - _Requirements: 3.3_

- [ ] 21. Build visitor management pages
- [ ] 21.1 Create visitor list page
  - Display visitors in table format
  - Implement search functionality
  - Implement filters (date, status)
  - Implement pagination
  - _Requirements: 1.4, 8.1, 8.2, 8.3, 8.5_

- [ ] 21.2 Create visitor registration page
  - Build form for new visitor registration
  - Include photo capture/upload
  - Implement form validation
  - Handle form submission
  - _Requirements: 2.1, 6.2_

- [ ] 21.3 Create visitor details page
  - Display visitor information
  - Display visitor photo
  - Display appointment history
  - Display check-in/out history
  - _Requirements: 6.5_

- [ ] 22. Build appointment management pages
- [ ] 22.1 Create appointment list page
  - Display appointments in table format
  - Implement filters (status, date, host)
  - Implement pagination
  - _Requirements: 3.3_

- [ ] 22.2 Create appointment creation page
  - Build form for new appointment
  - Select visitor (or create new)
  - Set date, time, purpose
  - Handle form submission
  - _Requirements: 3.1_

- [ ] 22.3 Create appointment details page
  - Display appointment information
  - Display visitor details
  - Provide approve/reject buttons (for employees)
  - Provide cancel button
  - _Requirements: 3.2, 3.5_

- [ ] 23. Build pass and QR code pages
- [ ] 23.1 Create digital pass view page
  - Display QR code
  - Display visitor photo
  - Display visit details
  - Display validity period
  - Provide PDF download button
  - _Requirements: 4.3, 4.5_

- [ ] 23.2 Create QR scanner page
  - Integrate html5-qrcode library
  - Implement camera access
  - Implement QR code scanning
  - Handle scan results (check-in/out)
  - Display confirmation messages
  - _Requirements: 12.2, 12.3, 12.4, 12.5_

- [ ]* 23.3 Write property test for QR scan confirmation
  - **Property 38: QR Scan Confirmation**
  - **Validates: Requirements 12.5**

- [ ] 24. Build check-in/out management pages
- [ ] 24.1 Create check logs page
  - Display check logs in table format
  - Implement filters (date range, visitor name)
  - Implement pagination
  - _Requirements: 10.3, 10.5_

- [ ] 24.2 Create active visitors page
  - Display currently checked-in visitors
  - Provide quick check-out functionality
  - _Requirements: 2.5_

- [ ] 25. Build analytics and reporting pages (admin)
- [ ] 25.1 Create analytics dashboard page
  - Display visitor statistics
  - Display visitor trends chart
  - Display peak hours analysis
  - _Requirements: 1.3_

- [ ] 25.2 Create export functionality
  - Provide export button
  - Allow selection of date range and filters
  - Download CSV file
  - _Requirements: 1.5_

- [ ] 26. Build user management pages (admin)
- [ ] 26.1 Create user list page
  - Display users in table format
  - Implement pagination
  - Provide add user button
  - _Requirements: 1.2_

- [ ] 26.2 Create user registration page (admin)
  - Build form for new user
  - Include role selection
  - Implement form validation
  - Handle form submission
  - _Requirements: 1.2_

- [ ] 26.3 Create user details/edit page
  - Display user information
  - Allow editing of user details
  - Allow role changes
  - Provide delete button
  - _Requirements: 1.2_

- [ ] 27. Build notification components
- [ ] 27.1 Create notification list component
  - Display recent notifications
  - Mark notifications as read
  - _Requirements: 13.5_

- [ ]* 27.2 Write property test for notification history accuracy
  - **Property 24: Notification History Accuracy**
  - **Validates: Requirements 13.5**

- [ ] 27.2 Create notification badge component
  - Display unread notification count
  - Update in real-time
  - _Requirements: 13.1_

- [ ] 28. Implement responsive UI and styling
- [ ] 28.1 Set up CSS framework
  - Install and configure Tailwind CSS or Material-UI
  - _Requirements: 15.2_

- [ ] 28.2 Style all pages and components
  - Apply consistent styling
  - Ensure responsive design for mobile
  - Implement loading states
  - Implement error states
  - _Requirements: 15.2_

- [ ] 29. Implement form validation on frontend
- [ ] 29.1 Create validation utilities
  - Implement email validation
  - Implement phone validation
  - Implement required field validation
  - _Requirements: 11.1, 11.2, 11.3_

- [ ] 29.2 Add validation to all forms
  - Display validation errors inline
  - Prevent submission with invalid data
  - _Requirements: 11.5_

- [ ] 30. Add error handling and user feedback
- [ ] 30.1 Create error display components
  - Implement toast notifications for errors
  - Implement toast notifications for success
  - _Requirements: 11.5_

- [ ] 30.2 Add error boundaries
  - Implement React error boundaries
  - Display friendly error messages
  - _Requirements: 11.5_

- [ ] 31. Checkpoint - Ensure all frontend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 32. Integration and end-to-end testing
- [ ] 32.1 Write integration tests for complete user flows
  - Test registration to login flow
  - Test visitor registration to pass generation flow
  - Test appointment creation to approval to check-in flow
  - _Requirements: 1.1, 2.1, 3.1, 3.2_

- [ ] 33. Create documentation
- [ ] 33.1 Write README.md
  - Include project overview
  - Include setup instructions
  - Include environment variables documentation
  - Include API documentation
  - Include screenshots
  - _Requirements: 15.5_

- [ ] 33.2 Create API documentation
  - Document all endpoints
  - Include request/response examples
  - Document authentication requirements
  - _Requirements: 15.4_

- [ ] 33.3 Add code comments and documentation
  - Add JSDoc comments to functions
  - Document complex logic
  - _Requirements: 15.3_

- [ ] 34. Final testing and deployment preparation
- [ ] 34.1 Run all tests
  - Run backend unit tests
  - Run backend property tests
  - Run frontend tests
  - Run integration tests
  - _Requirements: All_

- [ ] 34.2 Test application manually
  - Test all user flows
  - Test on different browsers
  - Test on mobile devices
  - _Requirements: All_

- [ ] 34.3 Prepare for deployment
  - Create production build
  - Set up environment variables for production
  - Create deployment guide
  - _Requirements: 15.5_

- [ ] 35. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
