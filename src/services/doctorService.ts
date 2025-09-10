// src/services/doctorService.ts
import AppointmentImport from "../models/Appointment"; // default export may be Model or object with .model
import constants from "../utils/constant";

/**
 * Resolve the actual Mongoose Model whether the module exported:
 *  - the Model directly (export default AppointmentModel)
 *  - or an object with { model: AppointmentModel } (older pattern)
 */
function resolveModel(maybeModel: any) {
  return maybeModel && (maybeModel.model ? maybeModel.model : maybeModel);
}

const AppointmentModel = resolveModel(AppointmentImport) as any;

const getPatientList = async (
  condition: Record<string, any>,
  sortCondition: Record<string, any>,
  offset: number,
  limit: number,
  searchQuery: string
) => {
  try {
    const data = await AppointmentModel.aggregate([
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
            { "user.fullName": { $regex: new RegExp(searchQuery, "i") } },
            { "user.phone": { $regex: new RegExp(searchQuery, "i") } },
          ],
        },
      },
      {
        $addFields: {
          firstLetter: {
            // use $substrCP + $toUpper for proper unicode handling
            $substr: [{ $substrCP: [{ $toUpper: "$user.fullName" }, 0, 1] }, 0, 1],
          },
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
          _id: "$firstLetter", // group by first letter
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
            // Sort groups by letter ascending
            { $sort: { _id: 1 } },
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
    ]).allowDiskUse(true);

    // Return normalized shape
    return data[0] ?? { count: 0, data: [] };
  } catch (error) {
    console.error("doctorService.getPatientList error:", error);
    return { count: 0, data: [] };
  }
};

export default {
  getPatientList,
};
