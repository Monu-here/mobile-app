// API Configuration
// Updated to the user-provided API
export const API_BASE_URL = 'http://192.168.1.110:8001/api';

export const ENDPOINTS = {
   LOGIN: '/login',
   AUTH_CHECK: '/auth-check',
  SUBSCRIBE: '/profile/subscribe',
  CHANGE_PASSWORD: '/change-password',
  LOGOUT: '/auth/logout',
  REGISTER: '/auth/register',
  PROFILE: '/user/profile',
  REFRESH_TOKEN: '/auth/refresh',
  CONFIG_VERSION_CHECK: '/admin/config-version-check',
  DASHBOARD_COUNT: '/admin/settings/count',
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
  // Leave Type endpoints
  LEAVE_TYPE_ADD: '/admin/settings/leave/type/add',
  LEAVE_TYPE_GET: '/admin/settings/leave/type',
  LEAVE_TYPE_UPDATE: '/admin/settings/leave/type/update/{id}',
  LEAVE_TYPE_DELETE: '/admin/settings/leave/type/delete/{id}',
  // Permission endpoints
  PERMISSION_INFOS: '/admin/settings/permission/infos',
  PERMISSION_GET_USER: '/admin/settings/permission/get-user-permission',
  PERMISSION_SAVE: '/admin/settings/permission/save',
  // Staff endpoints
  STAFF_SEARCH: '/admin/staff/search',
  STAFF_ADD: '/admin/staff/add',
  STAFF_SHOW: '/admin/staff/show/{id}',
  STAFF_UPDATE: '/admin/staff/update/{id}',
  STAFF_DELETE: '/admin/staff/delete/{id}',
  // Staff Attendance endpoints
  STAFF_ATTENDANCE_LIST: '/admin/staff-attendance',
  STAFF_ATTENDANCE_ADD: '/admin/staff-attendance/add',
  // Exam Subject Schedule endpoints
  EXAM_SUBJECT_SCHEDULE_LIST: '/admin/exam/subject-schedule',
  EXAM_SUBJECT_SCHEDULE_ADD: '/admin/exam/subject-schedule/add',
  EXAM_SUBJECT_SCHEDULE_DELETE: '/admin/exam/subject-schedule/delete',
  // Exam Type endpoints
  EXAM_TYPE_LIST: '/admin/exam/type',
  EXAM_TYPE_ADD: '/admin/exam/type/add',
  EXAM_TYPE_UPDATE: '/admin/exam/type/update/{id}',
  EXAM_TYPE_DELETE: '/admin/exam/type/delete/{id}',
  EXAM_TYPE_SET_STATUS: '/admin/exam/type/set-status/{id}',
  // Exam Setup endpoints
  EXAM_SETUP_LIST: '/admin/exam/setup',
  EXAM_SETUP_ADD: '/admin/exam/setup/add',
  EXAM_SETUP_UPDATE: '/admin/exam/setup/update/{id}',
  EXAM_SETUP_DELETE: '/admin/exam/setup/delete/{id}',
  // Mark Grade endpoints
  MARK_GRADE_GET: '/admin/exam/mark-grade',
  MARK_GRADE_ADD: '/admin/exam/mark-grade/add',
  MARK_GRADE_UPDATE: '/admin/exam/mark-grade/update/{id}',
  MARK_GRADE_DELETE: '/admin/exam/mark-grade/delete/{id}',
  // Exam Attendance endpoints
  EXAM_ATTENDANCE_SEARCH: '/admin/exam/attendance',
  EXAM_ATTENDANCE_ADD: '/admin/exam/attendance/add',
  // Mark Store endpoints
  MARK_STORE_EXAM_DATA: '/admin/exam/mark-store/exam-data',
  MARK_STORE_GET_STUDENTS: '/admin/exam/mark-store',
  MARK_STORE_GET_SUBJECT_FOR_TEACHER: '/admin/exam/mark-store/get-subject-for-teacher',
  MARK_STORE_ADD: '/admin/exam/mark-store/add',
  // Result endpoints
  RESULT_EXAM_TYPES: '/admin/result/exam-type',
  RESULT_LIST: '/admin/result/result-list',
  RESULT_MARK_SHEET: '/admin/result/mark-sheet',
  RESULT_ALL_MARK_SHEET: '/admin/result/all-mark-sheet',

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
