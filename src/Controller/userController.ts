// import { Request, Response } from 'express';
// import User from '../Model/userModel';
// import { IUser } from '../Interface/userInterface';
// import { PasswordUtils } from '../Utils/passwordUtils'; 
// import { JwtUtils } from '../Utils/jwtUtils';

// export class UserController {
//   static async register(req: Request, res: Response): Promise<void> {
//     try {
//       const { name, email, password } = req.body;
//       console.log('Registering user:', { name, email });

//       // Check if user exists
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         res.status(400).json({
//           success: false,
//           message: 'User already exists'
//         });
//         return;
//       }

//       // Hash password
//       const hashedPassword = await PasswordUtils.hashPassword(password);

//       // Create user
//       const user: IUser = new User({
//         name,
//         email,
//         password: hashedPassword
//       });

//       await user.save();

//       res.status(201).json({
//         success: true,
//         message: 'User registered successfully',
//         data: {
//           user: {
//             id: user._id,
//             name: user.name,
//             email: user.email
//           }
//         }
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: 'Server error'
//       });
//     }
//   }
//   static async login(req: Request, res: Response): Promise<void> {
//     try {
//       const { email, password } = req.body;

//       // Find user
//       const user = await User.findOne({ email });
//       if (!user) {
//         res.status(401).json({
//           success: false,
//           message: 'Invalid credentials'
//         });
//         return;
//       }

//       // Check password
//       const isPasswordValid = await PasswordUtils.comparePassword(password, user.password);
//       if (!isPasswordValid) {
//         res.status(401).json({
//           success: false,
//           message: 'Invalid credentials'
//         });
//         return;
//       }

//       // Generate tokens
//       const accessToken = JwtUtils.generateAccessToken({
//         userId: user._id.toString(),
//         email: user.email
//       });

//       const refreshToken = JwtUtils.generateRefreshToken({
//         userId: user._id.toString(),
//         email: user.email
//       });

//       // Set cookies
//       res.cookie('accessToken', accessToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'strict',
//         maxAge: 15 * 60 * 1000 // 15 minutes
//       });

//       res.cookie('refreshToken', refreshToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'strict',
//         maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
//       });

//       res.status(200).json({
//         success: true,
//         message: 'Login successful',
//         data: {
//           user: {
//             id: user._id,
//             name: user.name,
//             email: user.email
//           }
//         }
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: 'Server error'
//       });
//     }
//   }
//   static async refreshToken(req: Request, res: Response): Promise<void> {
//     try {
//       const { refreshToken } = req.cookies;

//       if (!refreshToken) {
//         res.status(401).json({
//           success: false,
//           message: 'Refresh token not provided'
//         });
//         return;
//       }

//       // Verify refresh token
//       const decoded = JwtUtils.verifyRefreshToken(refreshToken);
//       if (!decoded) {
//         res.status(401).json({
//           success: false,
//           message: 'Invalid refresh token'
//         });
//         return;
//       }

//       // Find user
//       const user = await User.findById(decoded.userId);
//       if (!user) {
//         res.status(401).json({
//           success: false,
//           message: 'User not found'
//         });
//         return;
//       }

//       // Generate new tokens
//       const newAccessToken = JwtUtils.generateAccessToken({
//         userId: user._id.toString(),
//         email: user.email
//       });

//       const newRefreshToken = JwtUtils.generateRefreshToken({
//         userId: user._id.toString(),
//         email: user.email
//       });

//       // Set new cookies
//       res.cookie('accessToken', newAccessToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'strict',
//         maxAge: 15 * 60 * 1000 // 15 minutes
//       });

//       res.cookie('refreshToken', newRefreshToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'strict',
//         maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
//       });

//       res.status(200).json({
//         success: true,
//         message: 'Tokens refreshed successfully',
//         data: {
//           user: {
//             id: user._id,
//             name: user.name,
//             email: user.email
//           }
//         }
//       });
//     } catch (error) {
//       console.error('Refresh token error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Server error'
//       });
//     }
//   }
//   static async logout(req: Request, res: Response): Promise<void> {
//     try {
//       // Clear cookies
//       res.clearCookie('accessToken', {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'strict'
//       });

//       res.clearCookie('refreshToken', {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'strict'
//       });

//       res.status(200).json({
//         success: true,
//         message: 'Logout successful'
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: 'Server error'
//       });
//     }
//   }
// }

import { Request, Response } from 'express';
import User from '../Model/userModel';
import { IUser } from '../Interface/userInterface';
import { PasswordUtils } from '../Utils/passwordUtils'; 
import { JwtUtils } from '../Utils/jwtUtils';
import { HttpStatusCode } from '../Constant/statusCode';
import { ErrorMessages } from '../Constant/errorMessage';
import { SuccessMessages } from '../Constant/successMessage';
import { ApiResponse } from '../Types/apiResponse';

export class UserController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      console.log('Registering user:', { name, email });

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        const response: ApiResponse = {
          success: false,
          message: ErrorMessages.USER_ALREADY_EXISTS
        };
        res.status(HttpStatusCode.BAD_REQUEST).json(response);
        return;
      }

      // Hash password
      const hashedPassword = await PasswordUtils.hashPassword(password);

      // Create user
      const user: IUser = new User({
        name,
        email,
        password: hashedPassword
      });

      await user.save();

      const response: ApiResponse = {
        success: true,
        message: SuccessMessages.USER_REGISTERED_SUCCESSFULLY,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          }
        }
      };

      res.status(HttpStatusCode.CREATED).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: ErrorMessages.SERVER_ERROR
      };
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(response);
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        const response: ApiResponse = {
          success: false,
          message: ErrorMessages.INVALID_CREDENTIALS
        };
        res.status(HttpStatusCode.UNAUTHORIZED).json(response);
        return;
      }

      // Check password
      const isPasswordValid = await PasswordUtils.comparePassword(password, user.password);
      if (!isPasswordValid) {
        const response: ApiResponse = {
          success: false,
          message: ErrorMessages.INVALID_CREDENTIALS
        };
        res.status(HttpStatusCode.UNAUTHORIZED).json(response);
        return;
      }

      // Generate tokens
      const accessToken = JwtUtils.generateAccessToken({
        userId: user._id.toString(),
        email: user.email
      });

      const refreshToken = JwtUtils.generateRefreshToken({
        userId: user._id.toString(),
        email: user.email
      });

      // Set cookies
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
  secure: process.env.COOKIE_SECURE === 'true',
  sameSite: process.env.COOKIE_SAME_SITE as 'strict' | 'lax' | 'none' || 'none',
  domain: process.env.COOKIE_DOMAIN || undefined,
        maxAge: 15 * 60 * 1000 // 15 minutes
      });

      res.cookie('refreshToken', refreshToken, {
       httpOnly: true,
  secure: process.env.COOKIE_SECURE === 'true',
  sameSite: process.env.COOKIE_SAME_SITE as 'strict' | 'lax' | 'none' || 'none',
  domain: process.env.COOKIE_DOMAIN || undefined,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      const response: ApiResponse = {
        success: true,
        message: SuccessMessages.LOGIN_SUCCESSFUL,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          }
        }
      };

      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: ErrorMessages.SERVER_ERROR
      };
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(response);
    }
  }

  // static async refreshToken(req: Request, res: Response): Promise<void> {
  //   try {
  //     const { refreshToken } = req.cookies;

  //     if (!refreshToken) {
  //       const response: ApiResponse = {
  //         success: false,
  //         message: ErrorMessages.REFRESH_TOKEN_NOT_PROVIDED
  //       };
  //       res.status(HttpStatusCode.UNAUTHORIZED).json(response);
  //       return;
  //     }

  //     // Verify refresh token
  //     const decoded = JwtUtils.verifyRefreshToken(refreshToken);
  //     if (!decoded) {
  //       const response: ApiResponse = {
  //         success: false,
  //         message: ErrorMessages.INVALID_REFRESH_TOKEN
  //       };
  //       res.status(HttpStatusCode.UNAUTHORIZED).json(response);
  //       return;
  //     }

  //     // Find user
  //     const user = await User.findById(decoded.userId);
  //     if (!user) {
  //       const response: ApiResponse = {
  //         success: false,
  //         message: ErrorMessages.USER_NOT_FOUND
  //       };
  //       res.status(HttpStatusCode.UNAUTHORIZED).json(response);
  //       return;
  //     }

  //     // Generate new tokens
  //     const newAccessToken = JwtUtils.generateAccessToken({
  //       userId: user._id.toString(),
  //       email: user.email
  //     });

  //     const newRefreshToken = JwtUtils.generateRefreshToken({
  //       userId: user._id.toString(),
  //       email: user.email
  //     });

  //     // Set new cookies
  //     res.cookie('accessToken', newAccessToken, {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === 'production',
  //       sameSite: 'strict',
  //       maxAge: 15 * 60 * 1000 // 15 minutes
  //     });

  //     res.cookie('refreshToken', newRefreshToken, {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === 'production',
  //       sameSite: 'strict',
  //       maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  //     });

  //     const response: ApiResponse = {
  //       success: true,
  //       message: SuccessMessages.TOKENS_REFRESHED_SUCCESSFULLY,
  //       data: {
  //         user: {
  //           id: user._id,
  //           name: user.name,
  //           email: user.email
  //         }
  //       }
  //     };

  //     res.status(HttpStatusCode.OK).json(response);
  //   } catch (error) {
  //     console.error('Refresh token error:', error);
  //     const response: ApiResponse = {
  //       success: false,
  //       message: ErrorMessages.SERVER_ERROR
  //     };
  //     res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(response);
  //   }
  // }
 static async refreshToken(req: Request, res: Response): Promise<void> {
  try {
    const { refreshToken } = req.cookies

    if (!refreshToken) {
      const response: ApiResponse = {
        success: false,
        message: ErrorMessages.REFRESH_TOKEN_NOT_PROVIDED,
      }
      res.status(HttpStatusCode.UNAUTHORIZED).json(response)
      return
    }

    // Verify refresh token
    let decoded
    try {
      decoded = JwtUtils.verifyRefreshToken(refreshToken)
    } catch (error) {
      // Clear invalid refresh token
      res.clearCookie("refreshToken")
      res.clearCookie("accessToken")

      const response: ApiResponse = {
        success: false,
        message: ErrorMessages.INVALID_REFRESH_TOKEN,

      }
      res.status(HttpStatusCode.UNAUTHORIZED).json(response)
      return
    }

    if (!decoded) {
      res.clearCookie("refreshToken")
      res.clearCookie("accessToken")

      const response: ApiResponse = {
        success: false,
        message: ErrorMessages.INVALID_REFRESH_TOKEN,
       
      }
      res.status(HttpStatusCode.UNAUTHORIZED).json(response)
      return
    }

    // Find user
    const user = await User.findById(decoded.userId)
    if (!user) {
      res.clearCookie("refreshToken")
      res.clearCookie("accessToken")

      const response: ApiResponse = {
        success: false,
        message: ErrorMessages.USER_NOT_FOUND,
        
      }
      res.status(HttpStatusCode.UNAUTHORIZED).json(response)
      return
    }

    // Generate new tokens
    const newAccessToken = JwtUtils.generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
    })

    const newRefreshToken = JwtUtils.generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
    })

    // Set new cookies
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    })

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    const response: ApiResponse = {
      success: true,
      message: SuccessMessages.TOKENS_REFRESHED_SUCCESSFULLY,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    }

    res.status(HttpStatusCode.OK).json(response)
  } catch (error) {
    console.error("Refresh token error:", error)

    // Clear cookies on server error
    res.clearCookie("refreshToken")
    res.clearCookie("accessToken")

    const response: ApiResponse = {
      success: false,
      message: ErrorMessages.SERVER_ERROR,
    
    }
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(response)
  }
 }

  static async logout(req: Request, res: Response): Promise<void> {
    try {
      // Clear cookies
      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      const response: ApiResponse = {
        success: true,
        message: SuccessMessages.LOGOUT_SUCCESSFUL
      };

      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: ErrorMessages.SERVER_ERROR
      };
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(response);
    }
  }
}