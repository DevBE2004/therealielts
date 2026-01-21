# Types Organization

This directory contains all TypeScript type definitions organized by domain for better maintainability.

## File Structure

### Base Types (`base.ts`)
- `BaseResponse<T>` - Standard API response wrapper
- `PaginationParams` - Common pagination parameters
- `ApiResponse<T>` - Extended API response with domain-specific arrays

### Domain Types

#### User (`user.ts`)
- `User` - User entity
- `UserSignUpRequest`, `UserSignInRequest` - Authentication requests
- `UserUpdateProfileRequest`, `UserChangePasswordRequest` - Profile management
- `UserForgotPasswordRequest`, `UserResetPasswordRequest` - Password recovery
- `UserQueryParams` - User search and filter parameters

#### Course (`course.ts`)
- `Course` - Course entity
- `CourseCreateRequest`, `CourseUpdateRequest` - Course CRUD operations
- `CourseQueryParams` - Course search and filter parameters

#### Route (`route.ts`)
- `Route` - Learning route entity
- `RouteCreateRequest`, `RouteUpdateRequest` - Route CRUD operations
- `RouteQueryParams` - Route search and filter parameters

#### Teacher (`teacher.ts`)
- `Teacher` - Teacher entity
- `TeacherCreateRequest`, `TeacherUpdateRequest` - Teacher CRUD operations
- `TeacherQueryParams` - Teacher search and filter parameters

#### News (`news.ts`)
- `News` - News article entity
- `NewsCreateRequest`, `NewsUpdateRequest` - News CRUD operations
- `NewsQueryParams` - News search and filter parameters

#### Document (`document.ts`)
- `Document` - Document entity
- `DocumentCreateRequest`, `DocumentUpdateRequest` - Document CRUD operations
- `DocumentQueryParams` - Document search and filter parameters

#### Exam Registration (`examRegistration.ts`)
- `ExamRegistration` - Exam registration entity
- `ExamRegistrationCreateRequest`, `ExamRegistrationUpdateRequest` - Registration CRUD operations
- `ExamRegistrationQueryParams` - Registration search and filter parameters

#### Study Abroad (`studyAbroad.ts`)
- `StudyAbroad` - Study abroad program entity
- `StudyAbroadCreateRequest`, `StudyAbroadUpdateRequest` - Program CRUD operations
- `StudyAbroadQueryParams` - Program search and filter parameters

#### Partner (`partner.ts`)
- `Partner` - Business partner entity
- `PartnerCreateRequest`, `PartnerUpdateRequest` - Partner CRUD operations
- `PartnerQueryParams` - Partner search and filter parameters

#### Honor (`honor.ts`)
- `Honor` - Achievement/honor entity
- `HonorCreateRequest`, `HonorUpdateRequest` - Honor CRUD operations
- `HonorQueryParams` - Honor search and filter parameters

### Auth Types (`auth.ts`)
- `AuthState` - Redux authentication state
- `LoginResponse`, `RegisterResponse` - Authentication API responses

### UI Types (`ui.ts`)
- `FileUpload` - File upload state management
- `Notification` - Notification component props
- `Breadcrumb` - Navigation breadcrumb
- `MenuItem` - Navigation menu item

## Usage

### Import from index
```typescript
import { User, Course, Route } from '@/types';
```

### Import specific domain
```typescript
import { User, UserSignUpRequest } from '@/types/user';
```

### Import base types
```typescript
import { BaseResponse, PaginationParams } from '@/types/base';
```

## Benefits

1. **Modularity**: Each domain has its own file
2. **Maintainability**: Easier to find and update specific types
3. **Scalability**: New domains can be added without affecting existing code
4. **Team Collaboration**: Multiple developers can work on different type files
5. **Tree Shaking**: Better bundling optimization
6. **Clear Dependencies**: Explicit imports show relationships between types

## Notes

- All types are exported from the main `index.ts` file for backward compatibility
- Circular dependencies have been resolved by using `any` for optional related entities
- Each domain file imports only what it needs from `base.ts`
- The structure follows the backend controller organization

