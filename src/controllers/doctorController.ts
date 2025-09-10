// src/controllers/doctorController.ts
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import Doctor from "../models/Doctor"; // default export is a Mongoose model
import Appointment from "../models/Appointment"; // default export is a Mongoose model
import response from "../utils/response";
import httpStatus from "http-status";
import constants from "../utils/constant";

/* ---------- small helpers (local) ---------- */
function getPagination(page: number | string = 1, size: number | string = 20) {
  const p = Math.max(1, Number(page) || 1);
  const s = Math.max(1, Number(size) || 20);
  const limit = Math.floor(s);
  const offset = (p - 1) * limit;
  return { limit, offset };
}

function resolveOrder(listOrder: { ASC: number; DESC: number }, raw: any) {
  const key = typeof raw === "string" ? raw.toUpperCase() : String(raw);
  return listOrder[key as "ASC" | "DESC"] ?? listOrder.ASC;
}

/* ---------- inline aggregation service (always returns {count, data}) ---------- */
async function getPatientList(
  condition: Record<string, any>,
  sortCondition: Record<string, any>,
  offset: number,
  limit: number,
  searchQuery: string
): Promise<{ count: number; data: any[] }> {
  try {
    if (!Appointment || typeof (Appointment as any).aggregate !== "function") {
      console.error("Appointment model not available or invalid");
      return { count: 0, data: [] };
    }

    const pipeline: any[] = [
      { $match: condition },
      {
        $lookup: {
          from: "patients",
          localField: "patientId",
          foreignField: "_id",
          as: "patient",
        },
      },
      { $unwind: { path: "$patient", preserveNullAndEmptyArrays: false } },
      {
        $lookup: {
          from: "users",
          localField: "patient.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: false } },
      {
        $match: {
          $or: [
            { "user.fullName": { $regex: new RegExp(searchQuery || "", "i") } },
            { "user.phone": { $regex: new RegExp(searchQuery || "", "i") } },
          ],
        },
      },
      {
        $addFields: {
          firstLetter: { $substr: [{ $substrCP: [{ $toUpper: "$user.fullName" }, 0, 1] }, 0, 1] },
        },
      },
      {
        $project: {
          _id: { $ifNull: ["$patient._id", constants.NA] },
          patientName: { $ifNull: ["$user.fullName", constants.NA] },
          firstLetter: 1,
          profilePic: { $ifNull: ["$patient.profilePic", constants.NA] },
        },
      },
      {
        $group: {
          _id: "$firstLetter",
          documents: {
            $addToSet: {
              _id: "$_id",
              firstLetter: "$firstLetter",
              patientName: "$patientName",
              profilePic: "$profilePic",
            },
          },
        },
      },
      {
        $facet: {
          count: [{ $count: "total" }],
          data: [
            { $sort: { _id: 1 } }, // sort groups by letter
            { $skip: offset },
            { $limit: limit },
          ],
        },
      },
      {
        $addFields: {
          count: {
            $cond: {
              if: { $eq: ["$count", []] },
              then: 0,
              else: {
                $cond: {
                  if: { $eq: ["$data", []] },
                  then: 0,
                  else: { $arrayElemAt: ["$count.total", 0] },
                },
              },
            },
          },
        },
      },
    ];

    const agg = await (Appointment as any).aggregate(pipeline).allowDiskUse(true);
    const result = agg && agg[0] ? agg[0] : { count: 0, data: [] };

    return {
      count: typeof result.count === "number" ? result.count : 0,
      data: Array.isArray(result.data) ? result.data : [],
    };
  } catch (err) {
    console.error("getPatientList aggregation error:", err);
    return { count: 0, data: [] };
  }
}

/* ---------- controller handler ---------- */
const getDoctorPatientList = async (req: Request, res: Response): Promise<void> => {
  try {
    // Prefer token-based user id (set by middleware). For local testing you can pass ?userId=
    const userId =
      (req as any).data?.userId ||
      (req as any).user?.id ||
      (typeof req.headers["x-user-id"] === "string" && req.headers["x-user-id"]) ||
      req.query.userId;

    console.log("userID: ", userId);
    if (!userId) {
      response.error({ msgCode: "UNAUTHORIZED" }, res, httpStatus.UNAUTHORIZED);
      return;
    }

    // Use Doctor model directly (your Doctor.ts exports default model)
    if (!Doctor || typeof (Doctor as any).findOne !== "function") {
      console.error("Doctor model not available or invalid");
      response.error({ msgCode: "SOMETHING_WENT_WRONG" }, res, httpStatus.INTERNAL_SERVER_ERROR);
      return;
    }

    const doctorData: any = await (Doctor as any).findOne({ userId: new ObjectId(String(userId)) }).lean();
    console.log("doctorData:", doctorData);

    if (!doctorData) {
      response.success({ msgCode: "NOT_FOUND" }, res, httpStatus.NOT_FOUND);
      return;
    }

    const { search = "", sort = "patientName", page = "1", size = "20", sortOrder = "ASC", type } =
      req.query as Record<string, any>;

    const LIST_ORDER = constants?.LIST?.ORDER ?? { ASC: 1, DESC: -1 };
    const orderValue = resolveOrder(LIST_ORDER, sortOrder);

    const sortCondition: Record<string, any> = { [String(sort)]: orderValue };
    const { limit, offset } = getPagination(page, size);

    const condition: any = { doctorId: new ObjectId((doctorData as any)._id), self: true };

    const todayConst = constants?.DOCTOR_PATIENT_LIST?.TODAY;
    const isToday =
      type === todayConst || String(type) === String(todayConst) || (typeof type === "string" && type.toUpperCase() === "TODAY");

    if (isToday) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const yesterdayStart = new Date(todayStart);
      yesterdayStart.setDate(todayStart.getDate() - 1);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      condition.date = { $gte: yesterdayStart, $lte: todayEnd };
    }

    const patientData = await getPatientList(condition, sortCondition, offset, limit, (search as string) || "");

    const count = patientData.count;
    const msgCode = count === 0 ? "NO_RECORD_FETCHED" : "PATIENT_CLINICAL_RECORD";

    response.success({ msgCode, data: patientData }, res, httpStatus.OK);
    return;
  } catch (err) {
    console.error("getDoctorPatientList error:", err);
    response.error({ msgCode: "SOMETHING_WENT_WRONG" }, res, httpStatus.INTERNAL_SERVER_ERROR);
    return;
  }
};

export default {
  getDoctorPatientList,
};
