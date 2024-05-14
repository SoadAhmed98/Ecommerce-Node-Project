import express from "express";
import { SignUp ,SignIn,userUpdate,verifyAccount,forgetPassword,resetPassword} from "./user.controller.js";
import { validation } from "../../middlewares/validation.js";
import { signUpShcema ,signInShcema,forgetPassSchema,resetPassSchema,updateUserSchema} from "./user.validation.js";
import { resetPass } from "../../middlewares/resetPassword.js";
import { isAdmin } from "../../middlewares/authorization.js";
const UserRoutes=express.Router();

UserRoutes.post("/user/signUp",validation(signUpShcema),SignUp)
UserRoutes.post("/user/signIn",validation(signInShcema),SignIn)
UserRoutes.post("/user/forgetPassword",validation(forgetPassSchema),forgetPassword)
UserRoutes.post("/user/resetPassword",validation(resetPassSchema),resetPass(),resetPassword)
UserRoutes.get("/user/verify/:token",verifyAccount)
UserRoutes.post("/user/DeactivateUser",validation(updateUserSchema),isAdmin(),userUpdate)
export default UserRoutes;