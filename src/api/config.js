// API Configuration
// Updated to the user-provided API
export const API_BASE_URL = 'http://mschool.zic.edu.np/api';

export const ENDPOINTS = {
  // Login endpoint (user provided: http://mschool.zic.edu.np/api/login)
  LOGIN: '/login',
   AUTH_CHECK: '/auth-check',
  SUBSCRIBE: '/profile/subscribe',
  CHANGE_PASSWORD: '/change-password',
  LOGOUT: '/auth/logout',
  REGISTER: '/auth/register',
  PROFILE: '/user/profile',
  REFRESH_TOKEN: '/auth/refresh',
  CONFIG_VERSION_CHECK: '/admin/config-version-check',
  SCHOOL_SETTINGS: '/admin/settings/setting/add',
  // GET current settings (assumed endpoint)
  SCHOOL_SETTINGS_GET: '/admin/settings/setting',
  // Academic year endpoints
  ACADEMIC_YEAR_ADD: '/admin/settings/academic-year/add',
  ACADEMIC_YEAR_GET: '/admin/settings/academic-year',
  ACADEMIC_YEAR_UPDATE: '/admin/settings/academic-year/update/{id}',
  ACADEMIC_YEAR_DELETE: '/admin/settings/academic-year/delete/{id}',
  // Branch endpoints
  BRANCH_ADD: '/admin/settings/branch/add',
  BRANCH_GET: '/admin/settings/branch',
  BRANCH_UPDATE: '/admin/settings/branch/update/{id}',
  BRANCH_DELETE: '/admin/settings/branch/delete/{id}',
  // Pickup Point endpoints
  PICKUP_POINT_ADD: '/admin/settings/pick-up-point/add',
  PICKUP_POINT_GET: '/admin/settings/pick-up-point',
  PICKUP_POINT_UPDATE: '/admin/settings/pick-up-point/update/{id}',
  PICKUP_POINT_DELETE: '/admin/settings/pick-up-point/delete/{id}',
  // Grade endpoints
  GRADE_ADD: '/admin/settings/grade/add',
  GRADE_GET: '/admin/settings/grade',
  GRADE_UPDATE: '/admin/settings/grade/update/{id}',
  GRADE_DELETE: '/admin/settings/grade/delete/{id}',
  // Section endpoints
  SECTION_ADD: '/admin/settings/section/add',
  SECTION_GET: '/admin/settings/section',
  SECTION_UPDATE: '/admin/settings/section/update/{id}',
  SECTION_DELETE: '/admin/settings/section/delete/{id}',
  // RFID endpoints
  RFID_ADD: '/admin/settings/rfid/add',
  RFID_GET: '/admin/settings/rfid',
  RFID_UPDATE: '/admin/settings/rfid/update/{id}',
  RFID_DELETE: '/admin/settings/rfid/delete/{id}',
  // Vehicle endpoints
  VEHICLE_ADD: '/admin/settings/vehicle/add',
  VEHICLE_GET: '/admin/settings/vehicle',
  VEHICLE_UPDATE: '/admin/settings/vehicle/update/{id}',
  VEHICLE_DELETE: '/admin/settings/vehicle/delete/{id}',
  // Event endpoints
  EVENT_ADD: '/admin/settings/event/add',
  EVENT_GET: '/admin/settings/event',
  EVENT_UPDATE: '/admin/settings/event/update/{id}',
  EVENT_DELETE: '/admin/settings/event/delete/{id}',
  // Academic Calendar endpoints
  ACADEMIC_CALENDAR_ADD: '/admin/settings/academic-calendar/add',
  ACADEMIC_CALENDAR_GET: '/admin/settings/academic-calendar',
  ACADEMIC_CALENDAR_UPDATE: '/admin/settings/academic-calendar/update/{id}',
  ACADEMIC_CALENDAR_DELETE: '/admin/settings/academic-calendar/delete/{id}',
  // Caste endpoints
  CASTE_ADD: '/admin/settings/caste/add',
  CASTE_GET: '/admin/settings/caste',
  CASTE_UPDATE: '/admin/settings/caste/update/{id}',
  CASTE_DELETE: '/admin/settings/caste/delete/{id}',
  // Religion endpoints
  RELIGION_ADD: '/admin/settings/religion/add',
  RELIGION_GET: '/admin/settings/religion',
  RELIGION_UPDATE: '/admin/settings/religion/update/{id}',
  RELIGION_DELETE: '/admin/settings/religion/delete/{id}',
  // Route endpoints
  ROUTE_ADD: '/admin/settings/route/add',
  ROUTE_GET: '/admin/settings/route',
  ROUTE_UPDATE: '/admin/settings/route/update/{id}',
  ROUTE_DELETE: '/admin/settings/route/delete/{id}',
  // Scholarship endpoints
  SCHOLARSHIP_ADD: '/admin/settings/scholarship/add',
  SCHOLARSHIP_GET: '/admin/settings/scholarship',
  SCHOLARSHIP_UPDATE: '/admin/settings/scholarship/update/{id}',
  SCHOLARSHIP_DELETE: '/admin/settings/scholarship/delete/{id}',
  // Subject endpoints
  SUBJECT_ADD: '/admin/settings/subject/add',
  SUBJECT_GET: '/admin/settings/subject',
  SUBJECT_UPDATE: '/admin/settings/subject/update/{id}',
  SUBJECT_DELETE: '/admin/settings/subject/delete/{id}',
  // Notice endpoints
  NOTICE_ADD: '/admin/settings/notice/add',
  NOTICE_GET: '/admin/settings/notice',
  NOTICE_UPDATE: '/admin/settings/notice/update/{id}',
  NOTICE_DELETE: '/admin/settings/notice/delete/{id}',
  // Schedule endpoints
  SCHEDULE_ADD: '/admin/settings/schedule/add',
  SCHEDULE_GET: '/admin/settings/schedule',
  SCHEDULE_UPDATE: '/admin/settings/schedule/update/{id}',
  SCHEDULE_DELETE: '/admin/settings/schedule/delete/{id}',
  // Student Category endpoints
  STUDENT_CATEGORY_ADD: '/admin/settings/student-category/add',
  STUDENT_CATEGORY_GET: '/admin/settings/student-category',
  STUDENT_CATEGORY_UPDATE: '/admin/settings/student-category/update/{id}',
  STUDENT_CATEGORY_DELETE: '/admin/settings/student-category/delete/{id}',
  // Post endpoints
  POST_ADD: '/admin/settings/post/add',
  POST_GET: '/admin/settings/post',
  POST_UPDATE: '/admin/settings/post/update/{id}',
  POST_DELETE: '/admin/settings/post/delete/{id}',
  // Route Pickup Point endpoints
  ROUTE_PICKUP_POINT_ADD: '/admin/settings/route-pickup-point/add',
  ROUTE_PICKUP_POINT_GET: '/admin/settings/route-pickup-point',
  ROUTE_PICKUP_POINT_UPDATE: '/admin/settings/route-pickup-point/update/{id}',
  ROUTE_PICKUP_POINT_DELETE: '/admin/settings/route-pickup-point/delete/{id}',
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
};
