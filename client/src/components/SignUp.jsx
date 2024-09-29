import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginCompanyAction,
  registerCompanyAction,
} from "../redux/slices/companySlice";
import {
  loginUserActionType,
  registerUserAction,
} from "../redux/slices/userSlice";
import CustomButton from "./CustomButton";
import Spinner from "./sharedUI/Spinner";
import TextInput from "./TextInput";

const SignUp = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error: registerError } = useSelector((store) => store?.company);

  const { error: loginError, user } = useSelector((store) => store?.user);
  const [isRegister, setIsRegister] = useState(true);
  const [accountType, setAccountType] = useState("seeker");
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  const closeModal = () => setOpen(false);
  const onSubmit = async (data) => {
    try {
      if (isRegister) {
        if (accountType === "seeker") {
          const response = await dispatch(registerUserAction(data));
          if (response.error) {
            toast.error(response.payload);
          } else {
            toast.success("Registed Successfull");
            navigate("/find-jobs");
          }
        } else {
          const response = await dispatch(registerCompanyAction(data));
          if (response.error) {
            toast.error(response.payload);
          } else {
            toast.success("Registed Successfull");
            navigate("/find-jobs");
          }
        }
      } else {
        if (accountType === "seeker") {
          const response = await dispatch(loginUserActionType(data));
          if (response.error) {
            toast.error(response.payload);
          } else {
            toast.success("Login Successfull");
            navigate("/find-jobs");
          }
        } else {
          const response = await dispatch(loginCompanyAction(data));
          if (response.error) {
            toast.error(response.payload);
          } else {
            toast.success("Login Successfull");
            navigate("/find-jobs");
          }
        }
      }
    } finally {
      //reset();
    }
  };

  return (
    <>
      <Transition appear show={open || false}>
        <Dialog as="div" className="relative z-10 " onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto ">
            <div className="flex min-h-full items-center justify-center p-4 text-center ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all ">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold leading-6 text-gray-900"
                  >
                    {isRegister ? "Create Account" : "Account Sign In"}
                  </Dialog.Title>

                  <div className="w-full flex items-center justify-center py-4 ">
                    <button
                      className={`flex-1 px-4 py-2 rounded text-sm outline-none ${
                        accountType === "seeker"
                          ? "bg-orange-600 text-white font-semibold"
                          : "bg-white border border-blue-400"
                      }`}
                      onClick={() => setAccountType("seeker")}
                    >
                      User Account
                    </button>
                    <button
                      className={`flex-1 px-4 py-2 rounded text-sm outline-none ${
                        accountType !== "seeker"
                          ? "bg-orange-600 text-white font-semibold"
                          : "bg-white border border-blue-400"
                      }`}
                      onClick={() => setAccountType("company")}
                    >
                      Company Account
                    </button>
                  </div>

                  {isSubmitting ? (
                    <div className="w-full flex justify-center py-4">
                      <Spinner />
                    </div>
                  ) : (
                    <form
                      className="w-full flex flex-col gap-5"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <TextInput
                        name="email"
                        label="Email Address"
                        placeholder="email@example.com"
                        type="email"
                        register={register("email", {
                          required: "Email Address is required!",
                        })}
                        error={errors.email ? errors.email.message : ""}
                      />

                      {isRegister && (
                        <div className="w-full flex gap-1 md:gap-2">
                          <div
                            className={`${
                              accountType === "seeker" ? "w-1/2" : "w-full"
                            }`}
                          >
                            <TextInput
                              name={
                                accountType === "seeker" ? "firstName" : "name"
                              }
                              label={
                                accountType === "seeker"
                                  ? "First Name"
                                  : "Company Name"
                              }
                              placeholder={
                                accountType === "seeker"
                                  ? "eg. James"
                                  : "Company name"
                              }
                              type="text"
                              register={register(
                                accountType === "seeker" ? "firstName" : "name",
                                {
                                  required:
                                    accountType === "seeker"
                                      ? "First Name is required"
                                      : "Company Name is required",
                                }
                              )}
                              error={
                                accountType === "seeker"
                                  ? errors.firstName
                                    ? errors.firstName?.message
                                    : ""
                                  : errors.name
                                  ? errors.name?.message
                                  : ""
                              }
                            />
                          </div>

                          {accountType === "seeker" && isRegister && (
                            <div className="w-1/2">
                              <TextInput
                                name="lastName"
                                label="Last Name"
                                placeholder="Wagonner"
                                type="text"
                                register={register("lastName", {
                                  required: "Last Name is required",
                                })}
                                error={
                                  errors.lastName
                                    ? errors.lastName?.message
                                    : ""
                                }
                              />
                            </div>
                          )}
                        </div>
                      )}

                      <div className="w-full flex gap-1 md:gap-2">
                        <div className={`${isRegister ? "w-1/2" : "w-full"}`}>
                          <TextInput
                            name="password"
                            label="Password"
                            placeholder="Password"
                            type="password"
                            register={register("password", {
                              required: "Password is required!",
                            })}
                            error={
                              errors.password ? errors.password?.message : ""
                            }
                          />
                        </div>

                        {isRegister && (
                          <div className="w-1/2">
                            <TextInput
                              label="Confirm Password"
                              placeholder="Password"
                              type="password"
                              register={register("cPassword", {
                                validate: (value) => {
                                  const { password } = getValues();

                                  if (password != value) {
                                    return "Passwords do not match";
                                  }
                                },
                              })}
                              error={
                                errors.cPassword &&
                                errors.cPassword.type === "validate"
                                  ? errors.cPassword?.message
                                  : ""
                              }
                            />
                          </div>
                        )}
                      </div>

                      <div className="mt-2">
                        <CustomButton
                          type="submit"
                          containerStyles={`inline-flex justify-center rounded-md bg-orange-600 px-8 py-2 text-sm font-medium text-white outline-none hover:bg-transparent border border-orange-600 hover:text-orange-600`}
                          title={
                            isRegister ? "Create Account" : "Login Account"
                          }
                        />
                      </div>
                    </form>
                  )}

                  <div className="mt-4">
                    <p className="text-sm text-gray-700">
                      {isRegister
                        ? "Already have an account?"
                        : "Do not have an account"}

                      <span
                        className="text-sm text-orange-600 ml-2 hover:text-orange-700 hover:font-semibold cursor-pointer"
                        onClick={() => setIsRegister((prev) => !prev)}
                      >
                        {isRegister ? "Login" : "Create Account"}
                      </span>
                    </p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default SignUp;
