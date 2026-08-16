## Phase 5 Completed

Phase 5 secures the API with authentication and JWT-based authorization.

### What is done
- Added secure password hashing using bcryptjs
- Implemented stateless JWT authentication for login sessions
- Created custom `authMiddleware` to protect financial routes
- Refactored routes to remove vulnerable URL parameters (Option A logic)
- Secured transactions so users can only access their own accounts

### Current status
- The backend API is now fully secured and authenticated
- Money operations require valid Bearer tokens
- The backend is complete and ready to connect to a frontend application