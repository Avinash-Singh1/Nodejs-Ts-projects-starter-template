// src/utils/common.ts
/**
 * Common database helper utilities.
 * Wraps Mongoose model operations into small helpers.
 */

export const common = {
  /**
   * Create and save a new document for the given Mongoose model.
   */
  create: async <T>(Model: any, payload: Partial<T>): Promise<T> => {
    const doc = new Model(payload);
    return doc.save();
  },

  /**
   * Find one document by filter (returns a plain object).
   */
  findOne: async <T>(Model: any, filter: any): Promise<T | null> => {
    return Model.findOne(filter).lean();
  },

  /**
   * Update one document by filter and return the updated document.
   */
  updateOne: async <T>(Model: any, filter: any, update: any): Promise<T | null> => {
    return Model.findOneAndUpdate(filter, update, { new: true }).lean();
  },

  /**
   * Get by condition (alias of findOne, semantic clarity).
   */
  getByCondition: async <T>(Model: any, filter: any): Promise<T | null> => {
    return Model.findOne(filter).lean();
  },

  /**
   * Remove a document by id.
   */
  removeById: async <T>(Model: any, id: any): Promise<T | null> => {
    return Model.findByIdAndDelete(id).lean();
  },

  /**
   * Find a document by id.
   */
  findById: async <T>(Model: any, id: any): Promise<T | null> => {
    return Model.findById(id).lean();
  },
};

export default common;
