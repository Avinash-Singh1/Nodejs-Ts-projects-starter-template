// src/utils/constant.ts

const constants = {
  USER_TYPES: {
    PATIENT: 1,
    DOCTOR: 2,
    HOSPITAL: 3,
  },

  TOKEN_TYPE: {
    LOGIN: 1,
    REFRESH: 2,
    APPOINTMENT: 3, // used in Session schema
  },

  DEVICE_TYPE: {
    DESKTOP: 'desktop',
    ANDROID: 'android',
    IOS: 'ios',
  },

  // Profile completion steps
  PROFILE_STEPS: {
    SECTION_A: 1,
    SECTION_B: 2,
    COMPLETED: 3,
  },

  // Profile verification status
  PROFILE_STATUS: {
    PENDING: 1,
    APPROVE: 2,
    REJECT: 3,
  },

  // Supported languages
  LANGUAGES_SUPPORTED: {
    ENGLISH: 1,
    HINDI: 2,
    OTHER: 3,
  },

  // Gender
  GENDER: {
    MALE: 1,
    FEMALE: 2,
    OTHER: 3,
  },

  // Blood groups
  BLOOD_GROUP: {
    A_POSITIVE: 1,
    A_NEGATIVE: 2,
    B_POSITIVE: 3,
    B_NEGATIVE: 4,
    AB_POSITIVE: 5,
    AB_NEGATIVE: 6,
    O_POSITIVE: 7,
    O_NEGATIVE: 8,
  },

  // Hospital profile screens (steps in hospital onboarding)
  HOSPITAL_SCREENS: {
    ESTABLISHMENT_DETAILS: 1,
    DOCTOR_DETAILS: 2,
    TIMING_DETAILS: 3,
    COMPLETED: 4,
  },

  // Example SMS templates keys — replace with real ones if you integrate SMS
  SMS_TEMPLATES: {
    OTP: '9735',
    WELCOME: '9735',
  },

  // Common regex for mobile validation (10 digits)
  regexForMobile: /^[0-9]{10}$/,

  // Other defaults
  DEFAULT_STATUS: 2, // e.g. active status

  // ===============================
  // 🔥 Added constants for Doctor/Appointment flows
  // ===============================

  // Sorting constants
  LIST: {
    ORDER: {
      ASC: 1,
      DESC: -1,
    },
  },

  // For filtering doctor-patient lists
  DOCTOR_PATIENT_LIST: {
    TODAY: 'TODAY',
    ALL: 'ALL',
  },

  // Appointment slots (example values, adjust to your business logic)
  SLOT: [1, 2, 3, 4, 5, 6, 7, 8], // morning/evening slot IDs, expand as needed

  // Who cancelled the appointment
  CANCEL_BY: {
    DOCTOR: 1,
    PATIENT: 2,
    SYSTEM: 3,
  },

  // Appointment booking status
  BOOKING_STATUS: {
    BOOKED: 1,
    CANCELLED: 2,
    COMPLETED: 3,
  },

  // Types of consultation
  CONSULTATION_TYPES: {
    VIDEO: 'video',
    IN_CLINIC: 'in_clinic',
  },

  // Default "not available" value for projections
  NA: 'N/A',
};

export default constants;
export type Constants = typeof constants;
