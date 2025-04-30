import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { CustomButton, TextInput } from "../components";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils";

const DriverRegistration = () => {
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrMsg("");

    try {
      const res = await apiRequest({
        url: "/drivers/register",
        data: data,
        method: "POST",
      });

      if (res?.success) {
        navigate("/driver-profile");
      } else {
        setErrMsg(res?.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      setErrMsg(error?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-[100vh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-2/3 lg:w-1/2 bg-white rounded-lg shadow-lg p-8 relative"
      >
        <h2 className="text-3xl font-bold text-center mb-6">
          Driver Registration
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              name="licenseNumber"
              label="License Number"
              placeholder="Enter your license number"
              type="text"
              register={register("licenseNumber", {
                required: "License number is required",
              })}
              error={errors.licenseNumber ? errors.licenseNumber.message : ""}
            />

            <TextInput
              name="licenseType"
              label="License Type"
              placeholder="Enter your license type"
              type="text"
              register={register("licenseType", {
                required: "License type is required",
              })}
              error={errors.licenseType ? errors.licenseType.message : ""}
            />

            <TextInput
              name="experience"
              label="Years of Experience"
              placeholder="Enter years of experience"
              type="number"
              register={register("experience", {
                required: "Experience is required",
                min: { value: 0, message: "Experience cannot be negative" },
              })}
              error={errors.experience ? errors.experience.message : ""}
            />

            <TextInput
              name="pricePerHour"
              label="Price per Hour (RWF)"
              placeholder="Enter your hourly rate"
              type="number"
              register={register("pricePerHour", {
                required: "Hourly rate is required",
                min: { value: 0, message: "Price cannot be negative" },
              })}
              error={errors.pricePerHour ? errors.pricePerHour.message : ""}
            />

            <TextInput
              name="pricePerDay"
              label="Price per Day (RWF)"
              placeholder="Enter your daily rate"
              type="number"
              register={register("pricePerDay", {
                required: "Daily rate is required",
                min: { value: 0, message: "Price cannot be negative" },
              })}
              error={errors.pricePerDay ? errors.pricePerDay.message : ""}
            />
          </div>

          {errMsg && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              {errMsg}
            </motion.p>
          )}

          <div className="flex justify-center">
            <CustomButton
              type="submit"
              containerStyles="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-8 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              title="Register as Driver"
              isLoading={isLoading}
            />
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default DriverRegistration;
