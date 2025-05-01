import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BiUser, BiBriefcase, BiCar } from "react-icons/bi";
import {
  loginCompanyAction,
  registerCompanyAction,
} from "../redux/slices/companySlice";
import {
  loginUserActionType,
  registerUserAction,
} from "../redux/slices/userSlice";
import TextInput from "./TextInput";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isRegister, setIsRegister] = useState(true);
  const [accountType, setAccountType] = useState("seeker");

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      if (isRegister) {
        if (accountType === "seeker" || accountType === "driver") {
          const response = await dispatch(
            registerUserAction({
              ...data,
              accountType: accountType === "driver" ? "driver" : "user",
            })
          );

          if (!response.error) {
            if (accountType === "driver") {
              navigate("/driver-registration");
            } else {
              navigate("/find-jobs");
            }
          }
        } else {
          const response = await dispatch(registerCompanyAction(data));
          if (!response.error) {
            navigate("/find-jobs");
          }
        }
      } else {
        if (accountType === "seeker" || accountType === "driver") {
          const response = await dispatch(loginUserActionType(data));
          if (!response.error) {
            navigate("/find-jobs");
          }
        } else {
          const response = await dispatch(loginCompanyAction(data));
          if (!response.error) {
            navigate("/find-jobs");
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h2>

          <div className="w-full flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAccountType("seeker")}
                className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 ${
                  accountType === "seeker"
                    ? "bg-blue-50 border-2 border-blue-500"
                    : "bg-gray-50 border-2 border-transparent"
                }`}
              >
                <BiUser
                  className={`text-2xl ${
                    accountType === "seeker" ? "text-blue-500" : "text-gray-600"
                  }`}
                />
                <span className="text-sm font-medium">Job Seeker</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAccountType("driver")}
                className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 ${
                  accountType === "driver"
                    ? "bg-blue-50 border-2 border-blue-500"
                    : "bg-gray-50 border-2 border-transparent"
                }`}
              >
                <BiCar
                  className={`text-2xl ${
                    accountType === "driver" ? "text-blue-500" : "text-gray-600"
                  }`}
                />
                <span className="text-sm font-medium">Driver</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAccountType("company")}
                className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 ${
                  accountType === "company"
                    ? "bg-blue-50 border-2 border-blue-500"
                    : "bg-gray-50 border-2 border-transparent"
                }`}
              >
                <BiBriefcase
                  className={`text-2xl ${
                    accountType === "company"
                      ? "text-blue-500"
                      : "text-gray-600"
                  }`}
                />
                <span className="text-sm font-medium">Company</span>
              </motion.button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <TextInput
                name="email"
                label="Email Address"
                type="email"
                register={register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                error={errors.email?.message}
              />

              {isRegister && (
                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    name={accountType === "company" ? "name" : "firstName"}
                    label={
                      accountType === "company" ? "Company Name" : "First Name"
                    }
                    register={register(
                      accountType === "company" ? "name" : "firstName",
                      {
                        required: `${
                          accountType === "company"
                            ? "Company name"
                            : "First name"
                        } is required`,
                      }
                    )}
                    error={
                      accountType === "company"
                        ? errors.name?.message
                        : errors.firstName?.message
                    }
                  />

                  {accountType !== "company" && (
                    <TextInput
                      name="lastName"
                      label="Last Name"
                      register={register("lastName", {
                        required: "Last name is required",
                      })}
                      error={errors.lastName?.message}
                    />
                  )}
                </div>
              )}

              <TextInput
                name="password"
                label="Password"
                type="password"
                register={register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                error={errors.password?.message}
              />

              {isRegister && (
                <TextInput
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  register={register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === getValues("password") ||
                      "Passwords do not match",
                  })}
                  error={errors.confirmPassword?.message}
                />
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                {isRegister ? "Create Account" : "Sign In"}
              </motion.button>
            </form>

            <p className="text-sm text-center text-gray-600">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {isRegister ? "Sign In" : "Create Account"}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
