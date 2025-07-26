// utils/mergeHelpers.js
import merge from 'lodash/merge';

/**
 * Deep merges base data, updates (e.g., with image URLs), and final overrides.
 * @param {Object} base - Original local state (e.g., mainData or globalData).
 * @param {Object} updates - Any external updates (e.g., from upload queue).
 * @param {Object} overrides - Explicit section-level overrides (e.g., activity_history).
 * @returns {Object} Final deeply merged object.
 */
export const createFinalData = (base, updates, overrides = {}) => {
  return merge({}, base, updates, overrides);
};
