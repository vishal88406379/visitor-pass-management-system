# Design Document

## Overview

The Visitor Pass Management System is a full-stack web application built using the MERN stack (MongoDB, Express.js, React, Node.js). The system provides a comprehensive digital solution for managing visitor access in organizations, replacing traditional paper-based visitor logs.

The architecture follows a client-server model with a RESTful API backend and a responsive React frontend. The system implements role-based access control (RBAC) using JWT authentication, supports QR code generation and scanning for visitor passes, and provides real-time notifications via email and SMS.

Key technical components include:
- **Backend**: Node.js with Express.js framework, MongoDB for data persistence
- **Frontend**: React with React Router for navigation, responsive UI components
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **QR Code**: QR code generation using qrcode library, scanning using html5-qrcode
- **PDF Generation**: PDFKit for generating printable visitor badges
- **Notifications**: Nodemailer for email, Twilio for SMS
- **File Storage**: Multer for handling photo uploads

## Architecture

### System Architecture

The system follows a three-tier architecture:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│    (React SPA with React Router)        │
│  - User Interface Components            │
│  - QR Scanner Interface                 │
│  - Dashboard & Reports                  │
└──────────────┬──────────────────────────┘
               │ HTTP/HTTPS (REST API)
               │ JWT Authentication
┌──────────────▼──────────────────────────┐
│         Application Layer               │
│    (Node.js + Express.js)               │
│  - Authentication Middleware            │
│  - Authorization (RBAC)                 │
│  - Business Logic Controllers           │
│  - API Routes                           │
│  - QR Code Generation                   │
│  - PDF Generation                       │
│  - Notification Services                │
└──────────────┬──────────────────────────┘
               │ Mongoose ODM
┌──────────────▼──────────────────────────┐
│         Data Layer                      │
│         (MongoDB)                       │
│  - Users Collection                     │
│  - Visitors Collection                  │
│  - Appointments Collection              │
│  - Passes Collection                    │
│  - CheckLogs Collection                 │
└─────────────────────────────────────────┘
```

### Component Architecture

**Backend Components:**
- **Routes**: Define API endpoints and map to controllers
- **Controllers**: Handle business logic and coordinate between services
- **Models**: Define data schemas using Mongoose
- **Middleware**: Authentication, authorization, error handling, validation
- **Services**: Reusable business logic (QR generation, PDF creation, notifications)
- **Utils**: Helper functions and utilities

**Frontend Components:**
- **Pages**: Top-level route components (Dashboard, Login, Visitors, etc.)
- **Components**: Reusable UI components (Forms, Tables, QR Scanner, etc.)
- **Context**: Global state management (Auth context, User context)
- **Services**: API client functions for backend communication
- **Hooks**: Custom React hooks for common functionality
- **Utils**: Helper functions and formatters

## Components and Interfaces

### Backend API Endpoints

#### Authentication Endpoints
- `POST /api/auth/register` - Register new user (admin only)
- `POST /api/auth/login` - User login, returns JWT token
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user profile

#### User Management Endpoints (Admin only)
- `GET /api/users` - List all users with pagination
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user details
- `DELETE /api/users/:id` - Delete user
- `PATCH /api/users/:id/role` - Update user role

#### Visitor Endpoints
- `POST /api/visitors` - Register new visitor (security/employee)
- `GET /api/visitors` - List visitors with search/filter
- `GET /api/visitors/:id` - Get visitor details
- `PUT /api/visitors/:id` - Update visitor information
- `POST /api/visitors/:id/photo` - Upload visitor photo

#### Appointment Endpoints
- `POST /api/appointments` - Create appointment (employee/visitor)
- `GET /api/appointments` - List appointments with filters
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id` - Update appointment
- `PATCH /api/appointments/:id/approve` - Approve appointment (employee)
- `PATCH /api/appointments/:id/cancel` - Cancel appointment
- `GET /api/appointments/my-appointments` - Get user's appointments

#### Pass Endpoints
- `POST /api/passes` - Generate visitor pass
- `GET /api/passes/:id` - Get pass details
- `GET /api/passes/qr/:passId` - Get QR code image
- `GET /api/passes/:id/pdf` - Download PDF badge
- `POST /api/passes/verify` - Verify pass by QR code

#### Check-In/Check-Out Endpoints
- `POST /api/checklogs/checkin` - Check in visitor
- `POST /api/checklogs/checkout` - Check out visitor
- `GET /api/checklogs` - List check logs with filters
- `GET /api/checklogs/active` - Get currently checked-in visitors
- `GET /api/checklogs/visitor/:visitorId` - Get visitor's check history

#### Analytics Endpoints (Admin only)
- `GET /api/analytics/dashboard` - Get dashboard statistics
- `GET /api/analytics/visitors/trends` - Get visitor trends
- `GET /api/analytics/export` - Export data as CSV/Excel

### Frontend Routes

- `/` - Landing page
- `/login` - Login page
- `/register` - Visitor pre-registration
- `/dashboard` - Role-based dashboard
- `/visitors` - Visitor list and management
- `/visitors/new` - New visitor registration
- `/visitors/:id` - Visitor details
- `/appointments` - Appointments list
- `/appointments/new` - Create appointment
- `/appointments/:id` - Appointment details
- `/passes/:id` - Digital pass view
- `/scan` - QR code scanner
- `/checklogs` - Check-in/out logs
- `/analytics` - Analytics dashboard (admin)
- `/users` - User management (admin)
- `/profile` - User profile

## Data Models

### User Model
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String (required),
  lastName: String (required),
  role: String (enum: ['admin', 'security', 'employee', 'visitor'], required),
  phone: String,
  department: String,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Visitor Model
```javascript
{
  _id: ObjectId,
  firstName: String (required),
  lastName: String (required),
  email: String (required),
  phone: String (required),
  company: String,
  photo: String (file path or URL),
  idType: String (enum: ['passport', 'driverLicense', 'nationalId']),
  idNumber: String,
  purpose: String,
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment Model
```javascript
{
  _id: ObjectId,
  visitor: ObjectId (ref: 'Visitor', required),
  host: ObjectId (ref: 'User', required),
  scheduledDate: Date (required),
  scheduledTime: String (required),
  purpose: String (required),
  status: String (enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed'], default: 'pending'),
  location: String,
  notes: String,
  approvedBy: ObjectId (ref: 'User'),
  approvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Pass Model
```javascript
{
  _id: ObjectId,
  passNumber: String (unique, required),
  visitor: ObjectId (ref: 'Visitor', required),
  appointment: ObjectId (ref: 'Appointment'),
  qrCode: String (QR code data),
  qrCodeImage: String (base64 or file path),
  validFrom: Date (required),
  validUntil: Date (required),
  isActive: Boolean (default: true),
  issuedBy: ObjectId (ref: 'User', required),
  createdAt: Date,
  updatedAt: Date
}
```

### CheckLog Model
```javascript
{
  _id: ObjectId,
  visitor: ObjectId (ref: 'Visitor', required),
  pass: ObjectId (ref: 'Pass', required),
  checkInTime: Date (required),
  checkOutTime: Date,
  checkInBy: ObjectId (ref: 'User', required),
  checkOutBy: ObjectId (ref: 'User'),
  location: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Authentication and JWT Generation

*For any* valid user credentials, authenticating should succeed and generate a JWT token that contains the correct user role information and can be used to access role-appropriate resources.

**Validates: Requirements 1.1, 5.1, 5.2, 5.3**

### Property 2: Password Security

*For any* user password, when stored in the database, the password should be hashed and never stored in plaintext.

**Validates: Requirements 5.5**

### Property 3: User Creation and Role Assignment

*For any* valid user data with a specified role, creating a user account should result in a stored user record with the correct role that can be retrieved and verified.

**Validates: Requirements 1.2**

### Property 4: Visitor Registration and Pass Generation

*For any* valid visitor data including photo, registering the visitor should create a visitor record and generate a digital pass with a unique QR code containing the pass identifier.

**Validates: Requirements 2.1, 2.4, 4.2**

### Property 5: QR Code Round-Trip

*For any* pass data, encoding it into a QR code and then decoding the QR code should return the original pass data.

**Validates: Requirements 12.2**

### Property 6: Check-In Logging

*For any* valid visitor pass, scanning the QR code for check-in should create a check log entry with timestamp, location, and the security user who performed the scan.

**Validates: Requirements 2.2, 10.1, 10.4**

### Property 7: Check-Out Logging

*For any* checked-in visitor, scanning the QR code for check-out should update the existing check log entry with the check-out timestamp and the user who performed the scan.

**Validates: Requirements 2.3, 10.2**

### Property 8: Active Visitors List Accuracy

*For any* set of check logs, the active visitors list should contain exactly those visitors who have checked in but not yet checked out.

**Validates: Requirements 2.5**

### Property 9: Appointment Creation and Status

*For any* valid appointment data, creating an appointment should result in a stored appointment record with pending status.

**Validates: Requirements 3.1, 4.1**

### Property 10: Appointment Approval Workflow

*For any* pending appointment, approving it should update the status to approved, generate a digital pass with QR code, and send a notification to the visitor containing appointment details.

**Validates: Requirements 3.2, 3.4, 4.2, 7.1**

### Property 11: Appointment Cancellation Workflow

*For any* appointment, cancelling it should update the status to cancelled and send a cancellation notification to the visitor.

**Validates: Requirements 3.5, 7.3**

### Property 12: Appointment Filtering by Host

*For any* employee user, querying their appointments should return only appointments where that employee is the host.

**Validates: Requirements 3.3**

### Property 13: Search and Filter Correctness

*For any* search criteria (text, date range, status), all returned visitor records should match the specified criteria.

**Validates: Requirements 1.4, 8.1, 8.2, 8.3**

### Property 14: Sort Order Correctness

*For any* sort parameter and dataset, the returned results should be ordered according to the sort parameter.

**Validates: Requirements 8.4**

### Property 15: Pagination Correctness

*For any* dataset larger than the page size, pagination should divide the results into pages where each page contains at most the page size number of records, and all records appear exactly once across all pages.

**Validates: Requirements 8.5**

### Property 16: Analytics Accuracy

*For any* set of visitor and check log data, the analytics dashboard statistics (total visits, active visitors) should match the actual counts from the underlying data.

**Validates: Requirements 1.3**

### Property 17: Data Export Completeness

*For any* export request with specified filters, the exported file should contain all records matching the filters.

**Validates: Requirements 1.5**

### Property 18: Photo Storage and Retrieval

*For any* visitor with a photo, saving the visitor record should store the photo, and retrieving the visitor should return the same photo.

**Validates: Requirements 6.3, 6.5**

### Property 19: Pass Photo Inclusion

*For any* visitor with a photo, generating a pass for that visitor should include the visitor photo on the digital pass.

**Validates: Requirements 6.4**

### Property 20: Image Validation

*For any* uploaded file, the system should validate that the file format is an accepted image type and the file size is within limits, rejecting invalid files.

**Validates: Requirements 6.2**

### Property 21: Notification Content Accuracy

*For any* appointment event (creation, approval, cancellation), the notification sent should include the relevant appointment details (visitor name, date, time, purpose).

**Validates: Requirements 7.2, 7.4**

### Property 22: Host Notification on Visitor Arrival

*For any* visitor check-in where the visitor has an appointment with a host, a notification should be sent to the host containing the visitor name and check-in time.

**Validates: Requirements 13.1, 13.2**

### Property 23: Multiple Visitor Notifications

*For any* employee with multiple appointments, checking in each visitor should send a separate notification to the employee for each arrival.

**Validates: Requirements 13.3**

### Property 24: Notification History Accuracy

*For any* employee, viewing their notification history should display all notifications for visitors associated with their appointments.

**Validates: Requirements 13.5**

### Property 25: PDF Badge Generation and Content

*For any* digital pass, generating a PDF badge should produce a PDF that includes the QR code at sufficient resolution, visitor photo, visit details, and organization branding.

**Validates: Requirements 9.1, 9.2, 9.4, 9.5**

### Property 26: PDF Format for Printing

*For any* generated PDF badge, the document should have dimensions suitable for standard paper printing.

**Validates: Requirements 9.3**

### Property 27: Digital Pass Display Completeness

*For any* digital pass, accessing the pass should display the QR code, visitor details, appointment details, and validity period.

**Validates: Requirements 4.3**

### Property 28: PDF Download Availability

*For any* digital pass, the system should provide an option to download the pass as a PDF.

**Validates: Requirements 4.5**

### Property 29: Invitation Notification with Registration Link

*For any* visitor invitation, a notification should be sent to the visitor containing a link to complete registration.

**Validates: Requirements 4.4**

### Property 30: Check Log Filtering

*For any* check log query with filters (date range, visitor name), all returned check logs should match the specified filters.

**Validates: Requirements 10.5**

### Property 31: Check Log Completeness

*For any* set of check-in and check-out events, viewing check logs should display all check-in and check-out records.

**Validates: Requirements 10.3**

### Property 32: Input Validation - Required Fields

*For any* form submission with missing required fields, the system should reject the submission and return an error message indicating which fields are required.

**Validates: Requirements 11.1, 11.5**

### Property 33: Email Format Validation

*For any* email address input, the system should validate that the email follows a valid email format, rejecting invalid formats.

**Validates: Requirements 11.2**

### Property 34: Phone Number Format Validation

*For any* phone number input, the system should validate that the phone number follows a valid format, rejecting invalid formats.

**Validates: Requirements 11.3**

### Property 35: File Upload Validation

*For any* file upload, the system should validate that the file type is allowed and the file size is within limits, rejecting invalid files.

**Validates: Requirements 11.4**

### Property 36: QR Code Scan Processing

*For any* valid pass QR code, scanning it should process the appropriate action (check-in or check-out) based on the current visitor status.

**Validates: Requirements 12.3**

### Property 37: Invalid QR Code Rejection

*For any* invalid or malformed QR code, scanning it should reject the code and display an error message.

**Validates: Requirements 12.4**

### Property 38: QR Scan Confirmation

*For any* successful QR code scan, the system should display a confirmation message to the user.

**Validates: Requirements 12.5**

### Property 39: Referential Integrity

*For any* visitor data with related appointments, passes, and check logs, storing and retrieving the data should maintain referential integrity between all related collections.

**Validates: Requirements 14.2**

### Property 40: Cascade Delete Handling

*For any* user with related appointments or check logs, deleting the user should appropriately handle related records (either cascade delete or set to null based on business rules).

**Validates: Requirements 14.4**

### Property 41: Document Population

*For any* query that retrieves data with references to other collections, the system should populate the referenced documents when requested.

**Validates: Requirements 14.5**

## Error Handling

### Authentication Errors
- **Invalid Credentials**: Return 401 Unauthorized with clear error message
- **Expired Token**: Return 401 Unauthorized with token expiration message
- **Missing Token**: Return 401 Unauthorized requesting authentication
- **Insufficient Permissions**: Return 403 Forbidden with permission error

### Validation Errors
- **Missing Required Fields**: Return 400 Bad Request with list of missing fields
- **Invalid Format**: Return 400 Bad Request with format requirements
- **File Too Large**: Return 413 Payload Too Large with size limit
- **Invalid File Type**: Return 400 Bad Request with accepted file types

### Resource Errors
- **Not Found**: Return 404 Not Found with resource identifier
- **Already Exists**: Return 409 Conflict for duplicate resources
- **Invalid State**: Return 400 Bad Request for state transition errors

### Server Errors
- **Database Connection**: Return 503 Service Unavailable
- **External Service Failure**: Return 502 Bad Gateway for email/SMS failures
- **Unexpected Errors**: Return 500 Internal Server Error with error ID for tracking

### Error Response Format
```javascript
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "Human-readable error message",
    details: {} // Optional additional details
  }
}
```

## Testing Strategy

The Visitor Pass Management System will employ a comprehensive testing approach combining unit tests and property-based tests to ensure correctness and reliability.

### Property-Based Testing

Property-based testing will be used to verify universal properties that should hold across all inputs. We will use **fast-check** as the property-based testing library for JavaScript/Node.js.

**Configuration:**
- Each property-based test will run a minimum of 100 iterations
- Each test will be tagged with a comment referencing the correctness property from this design document
- Tag format: `// Feature: visitor-pass-management, Property {number}: {property_text}`

**Property Test Coverage:**
- Authentication and authorization properties (Properties 1-3)
- Data persistence and retrieval properties (Properties 18, 39, 41)
- QR code encoding/decoding round-trip (Property 5)
- Validation properties (Properties 20, 32-35, 37)
- Search, filter, and sort properties (Properties 13-15)
- Notification properties (Properties 21-24, 29)
- Check-in/out logging properties (Properties 6-8)
- Appointment workflow properties (Properties 9-12)
- Pass and PDF generation properties (Properties 4, 19, 25-28)

### Unit Testing

Unit tests will verify specific examples, edge cases, and integration points between components.

**Backend Unit Tests:**
- Authentication middleware with valid/invalid tokens
- Password hashing and comparison
- QR code generation for specific pass IDs
- PDF generation with sample visitor data
- Email/SMS notification sending
- Database model validation
- API endpoint responses
- Error handling for edge cases

**Frontend Unit Tests:**
- Component rendering with various props
- Form validation and submission
- QR scanner integration
- API service functions
- Authentication context behavior
- Route protection and redirects

**Integration Tests:**
- Complete user registration and login flow
- Visitor registration to pass generation flow
- Appointment creation to approval to check-in flow
- QR code scan to check log creation
- Search and filter with database queries

### Test Organization

**Backend:**
```
tests/
  unit/
    models/
    controllers/
    middleware/
    services/
  integration/
    auth.test.js
    visitors.test.js
    appointments.test.js
  property/
    auth.property.test.js
    validation.property.test.js
    qrcode.property.test.js
```

**Frontend:**
```
src/
  components/
    __tests__/
  pages/
    __tests__/
  services/
    __tests__/
  property/
    validation.property.test.js
```

### Testing Tools
- **Unit Testing**: Jest for both frontend and backend
- **Property-Based Testing**: fast-check
- **API Testing**: Supertest for HTTP assertions
- **React Testing**: React Testing Library
- **Database Testing**: MongoDB Memory Server for isolated tests
- **Coverage**: Jest coverage reports with minimum 80% coverage target

### Continuous Integration
- Run all tests on every commit
- Enforce test passage before merge
- Generate and track coverage reports
- Run property-based tests with increased iterations (1000+) in CI environment

## Security Considerations

### Authentication and Authorization
- JWT tokens with short expiration times (1 hour)
- Refresh token mechanism for extended sessions
- Role-based access control enforced at API level
- Password hashing using bcrypt with salt rounds >= 10

### Data Protection
- Input sanitization to prevent injection attacks
- File upload restrictions (type, size, content validation)
- Secure photo storage with access controls
- HTTPS enforcement for all communications
- Environment variables for sensitive configuration

### API Security
- Rate limiting to prevent abuse
- CORS configuration for allowed origins
- Request validation middleware
- SQL/NoSQL injection prevention through parameterized queries
- XSS prevention through output encoding

### QR Code Security
- Time-limited pass validity
- Unique pass identifiers
- Pass verification before check-in/out
- Audit logging of all scans

## Performance Considerations

### Database Optimization
- Indexes on frequently queried fields (email, passNumber, dates)
- Compound indexes for common filter combinations
- Pagination for large result sets
- Lean queries when full documents not needed

### Caching Strategy
- Cache user sessions in memory
- Cache frequently accessed visitor data
- Cache QR code images
- Implement cache invalidation on updates

### File Handling
- Image compression for photos
- Lazy loading of images in UI
- Efficient PDF generation
- Cleanup of temporary files

### API Performance
- Response compression
- Efficient query design
- Batch operations where possible
- Async processing for notifications

## Deployment Architecture

### Development Environment
- Local MongoDB instance
- Node.js development server with hot reload
- React development server
- Environment variables in .env file

### Production Environment
- MongoDB Atlas or self-hosted MongoDB cluster
- Node.js application server (PM2 for process management)
- Nginx reverse proxy
- Static file serving for React build
- SSL/TLS certificates
- Environment variables from secure configuration

### Docker Deployment (Bonus)
```
services:
  - mongodb: Database container
  - backend: Node.js API container
  - frontend: Nginx container serving React build
  - nginx: Reverse proxy container
```

### Monitoring and Logging
- Application logging (Winston or similar)
- Error tracking (Sentry or similar)
- Performance monitoring
- Database query monitoring
- Uptime monitoring

## Future Enhancements

### Multi-Organization Support (Bonus)
- Organization model and relationships
- Organization-scoped data access
- Organization-specific branding
- Cross-organization visitor tracking

### OTP Verification (Bonus)
- OTP generation for visitor verification
- SMS/Email OTP delivery
- OTP validation before pass issuance

### Advanced Analytics (Bonus)
- Visitor trends and patterns
- Peak hours analysis
- Department-wise visitor statistics
- Export to various formats (CSV, Excel, PDF)

### Audit Logs (Bonus)
- Comprehensive audit trail for all actions
- User activity tracking
- Data change history
- Compliance reporting

### Mobile Application
- Native mobile app for visitors
- Mobile QR code scanning
- Push notifications
- Offline pass access
