// src/controllers/authController.ts
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import users from '../services/usersService';
import { compareHash, generateAuthJwt } from '../utils/auth';
import response from '../utils/response';
import { config } from '../config/environment';
import Doctor from '../models/Doctor';
import Session from '../models/Session'; 

const genericInvalid = () => ({ msgCode: 'INVALID_CREDENTIALS' });

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      phone,
      email,
      password,
      userType,
      countryCode = '+91',
      deviceId,
      deviceToken,
      deviceType,
      browser,
      os,
    } = req.body;

    // Basic input validation / sanitization
    const phoneClean = phone ? String(phone).replace(/\D/g, '') : undefined;
    const emailClean = email ? String(email).toLowerCase().trim() : undefined;
    const pass = password ? String(password) : '';

    // 1) Try find by phone (most common)
    let user = null;
    if (phoneClean) {
      user = await users.findUserByPhone(phoneClean, countryCode, userType);
      console.log('[auth] lookup by phone:', phoneClean, 'found:', !!user);
    }

    // 2) If not found, try lookup by email -> doctor -> user
    if (!user && emailClean) {
      const doctor = await users.findDoctor(emailClean);
      console.log('[auth] lookup doctor by email:', emailClean, 'found:', !!doctor);
      if (doctor && (doctor as any).userId) {
        user = await users.findUserById((doctor as any).userId);
        console.log('[auth] resolved userId from doctor:', (doctor as any).userId, 'user found:', !!user);
      }
    }

    // 3) If still not found -> log and return generic invalid
    if (!user) {
      console.warn('[auth] failed login - user not found (phone/email):', { phone: phoneClean, email: emailClean });
      response.error(genericInvalid(), res, httpStatus.UNAUTHORIZED);
      return;
    }

    // 4) Verify password (compareHash must use bcrypt.compare(plain, hash))
    const passwordHash = (user as any).password;
    if (!passwordHash) {
      console.warn('[auth] user has no password stored:', { userId: (user as any)._id });
      response.error(genericInvalid(), res, httpStatus.UNAUTHORIZED);
      return;
    }

    const ok = await compareHash(pass, passwordHash);
    if (!ok) {
      console.warn('[auth] password mismatch for userId:', (user as any)._id, 'phone:', (user as any).phone);
      response.error(genericInvalid(), res, httpStatus.UNAUTHORIZED);
      return;
    }

    // 5) Success - generate token and send response shape similar to your example
    const token = generateAuthJwt({
      userId: (user as any)._id.toString(),
      userType: Array.isArray((user as any).userType) ? (user as any).userType[0] : (user as any).userType,
      fullName: (user as any).fullName,
    }, config.jwtExpiresIn as any);

    // optional extra lookups
    const doctorDoc = await Doctor.findOne({ userId: (user as any)._id }).exec();

    const userObj = (user as any).toObject ? (user as any).toObject() : (user as any);

    const result = {
      token,
      user: {
        _id: userObj._id?.toString?.() ?? userObj._id,
        password: userObj.password, // matches your example (not recommended for prod)
        fullName: userObj.fullName,
        phone: userObj.phone,
        countryCode: userObj.countryCode ?? '+91',
        userType: Array.isArray(userObj.userType) ? userObj.userType : [userObj.userType],
        isDeleted: userObj.isDeleted ?? false,
        status: userObj.status ?? 2,
        createdAt: userObj.createdAt ? new Date(userObj.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: userObj.updatedAt ? new Date(userObj.updatedAt).toISOString() : new Date().toISOString(),
      },
      steps: 2,
      profileScreen: 1,
      profilePic: userObj.profilePic || null,
      approvalStatus: 1,
      doctorId: doctorDoc?._id?.toString?.() ?? null,
      establishmentName: null,
      hospitalTiming: null,
      userType: Array.isArray(userObj.userType) ? userObj.userType[0] : userObj.userType,
    };

    res.status(200).json({
      success: true,
      status_code: 200,
      message: 'Login successful.',
      result,
      time: Date.now(),
    });
    return;
  } catch (err) {
    console.error('[auth] login error:', err);
    response.error({ msgCode: 'INTERNAL_SERVER_ERROR' }, res, httpStatus.INTERNAL_SERVER_ERROR);
    return;
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1) Try to obtain token from multiple sources
    const authHeader = (req.headers?.authorization || req.headers?.Authorization || '') as string;
    let token: string | undefined;

    if (authHeader && typeof authHeader === 'string' && authHeader.toLowerCase().startsWith('bearer ')) {
      token = authHeader.slice(7).trim();
    }

    if (!token && req.body && req.body.token) {
      token = String(req.body.token).trim();
    }

    if (!token && req.query && (req.query.token as string)) {
      token = String(req.query.token as string).trim();
    }

    if (!token && req.cookies && (req.cookies.token as string)) {
      token = String(req.cookies.token as string).trim();
    }

    // 2) Try to accept deviceId from body/query/cookies
    const deviceId =
      (req.body && req.body.deviceId) ||
      (req.query && req.query.deviceId) ||
      (req.cookies && req.cookies.deviceId) ||
      null;

    // 3) If your auth middleware attaches the decoded user, we can use it (optional)
    // e.g., req.user = { userId: '...', ... }
    const userFromReq = (req as any).user ?? null;

    // If nothing found, return validation error
    if (!token && !deviceId && !userFromReq) {
      response.error(
        { msgCode: 'VALIDATION_ERROR', data: { message: 'token or deviceId is required' } },
        res,
        httpStatus.BAD_REQUEST
      );
      return;
    }

    // 4) Delete matching sessions. Be tolerant: if any removal fails continue.
    let deletedCount = 0;
    const deletedSessions: any[] = [];

    if (token) {
      try {
        const s = await Session.findOneAndDelete({ jwt: token }).exec();
        if (s) {
          deletedCount += 1;
          deletedSessions.push(s);
        }
      } catch (err) {
        console.warn('[logout] removal by token failed', err);
      }
    }

    if (deviceId) {
      try {
        const sessions = await Session.find({ deviceId }).exec();
        if (sessions && sessions.length) {
          const ids = sessions.map((ss: any) => ss._id);
          await Session.deleteMany({ _id: { $in: ids } }).exec();
          deletedCount += sessions.length;
          deletedSessions.push(...sessions);
        }
      } catch (err) {
        console.warn('[logout] removal by deviceId failed', err);
      }
    }

    // Optional: support "logout all devices for this user" if you have userId context
    // If req.user exists (populated by auth middleware) you can delete by userId:
    // if (!token && !deviceId && userFromReq?.userId) {
    //   await Session.deleteMany({ userId: userFromReq.userId }).exec();
    // }

    // Return success (idempotent)
    response.success(
      { msgCode: 'LOGOUT_SUCCESS', data: { deletedCount, sessions: deletedSessions.length ? true : false } },
      res,
      httpStatus.OK
    );
    return;
  } catch (err) {
    console.error('[auth] logout error:', err);
    response.error({ msgCode: 'INTERNAL_SERVER_ERROR' }, res, httpStatus.INTERNAL_SERVER_ERROR);
    return;
  }
};
export default { login,logout };
