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
};

export default constants;
export type Constants = typeof constants;
