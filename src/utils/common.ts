// src/utils/common.ts
/**
 * Common database helper utilities.
 * Wraps Mongoose model operations into small helpers.
 */

import { randomUUID } from "crypto";

/**
 * Pagination helper.
 * Accepts page and size (string or number) and returns { limit, offset }.
 */
export function getPagination(page: number | string = 1, size: number | string = 20) {
  const p = Number(page) || 1;
  const s = Number(size) || 20;
  const limit = Math.max(1, Math.floor(s));
  const offset = (Math.max(1, Math.floor(p)) - 1) * limit;
  return { limit, offset };
}

/**
 * Generate a random UUID string.
 */
export function genUUID(): string {
  return randomUUID();
}

/**
 * Database helpers (keep structure similar to your previous object for backward compatibility).
 */
export async function create<T>(Model: any, payload: Partial<T>): Promise<T> {
  const doc = new Model(payload);
  return doc.save();
}

export async function findOne<T>(Model: any, filter: any): Promise<T | null> {
  return Model.findOne(filter).lean();
}

export async function updateOne<T>(Model: any, filter: any, update: any): Promise<T | null> {
  return Model.findOneAndUpdate(filter, update, { new: true }).lean();
}

export async function getByCondition<T>(Model: any, filter: any): Promise<T | null> {
  return Model.findOne(filter).lean();
}

export async function removeById<T>(Model: any, id: any): Promise<T | null> {
  return Model.findByIdAndDelete(id).lean();
}

export async function findById<T>(Model: any, id: any): Promise<T | null> {
  return Model.findById(id).lean();
}

// default export (backward compatibility)
const common = {
  create,
  findOne,
  updateOne,
  getByCondition,
  removeById,
  findById,
  getPagination,
  genUUID,
};

export default common;
