import React, { useState } from "react";
import {
  BiUser,
  BiLock,
  BiShow,
  BiHide,
  BiCar,
  BiPhone,
  BiMapPin,
  BiBuilding,
  BiIdCard,
  BiFile,
} from "react-icons/bi";
import { BsGoogle, BsFacebook, BsApple } from "react-icons/bs";
import { Link } from "react-router-dom";

const Register = () => {
  const [userType, setUserType] = useState("driver"); // "driver" or "company"
  const [formData, setFormData] = useState({
    // Common fields
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: "",
    // Driver specific
    fullName: "",
    licenseNumber: "",
    vehicleType: "",
    yearsExperience: "",
    // Company specific
    companyName: "",
    companyRegistration: "",
    contactPerson: "",
    industry: "",
    companySize: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (!agreeToTerms) {
      alert("Please agree to terms and conditions");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log("Registration attempted:", { userType, ...formData });
      alert(
        `${
          userType === "driver" ? "Driver" : "Company"
        } registration successful!`
      );
    }, 2000);
  };

  const handleSocialRegister = (provider) => {
    console.log(`Register with ${provider} as ${userType}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br xl:pt-20  from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center p-4">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-3xl">
        {/* Registration Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <BiCar className="text-3xl text-purple-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Join Shoferi</h1>
            <p className="text-purple-100">
              Create your account and start your journey
            </p>
          </div>

          {/* User Type Selection */}
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setUserType("driver")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  userType === "driver"
                    ? "bg-white/20 border-white text-white"
                    : "bg-white/10 border-white/30 text-white/70 hover:bg-white/15"
                }`}
              >
                <BiCar className="text-2xl mx-auto mb-2" />
                <div className="font-semibold">I'm a Driver</div>
                <div className="text-sm opacity-80">Looking for jobs</div>
              </button>
              <button
                onClick={() => setUserType("company")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  userType === "company"
                    ? "bg-white/20 border-white text-white"
                    : "bg-white/10 border-white/30 text-white/70 hover:bg-white/15"
                }`}
              >
                <BiBuilding className="text-2xl mx-auto mb-2" />
                <div className="font-semibold">I'm a Company</div>
                <div className="text-sm opacity-80">Hiring drivers</div>
              </button>
            </div>
          </div>

          {/* Social Registration Options */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialRegister("Google")}
              className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white py-3 px-4 rounded-xl hover:bg-white/30 transition-all flex items-center justify-center gap-3"
            >
              <BsGoogle className="text-xl" />
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-transparent px-2 text-purple-100">
                Or register with email
              </span>
            </div>
          </div>

          {/* Registration Form */}
          <div className="space-y-6">
            {/* Name Field - Different for Driver vs Company */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                {userType === "driver" ? "Full Name" : "Company Name"}
              </label>
              <div className="relative">
                {userType === "driver" ? (
                  <BiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 text-xl" />
                ) : (
                  <BiBuilding className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 text-xl" />
                )}
                <input
                  type="text"
                  value={
                    userType === "driver"
                      ? formData.fullName
                      : formData.companyName
                  }
                  onChange={(e) =>
                    handleInputChange(
                      userType === "driver" ? "fullName" : "companyName",
                      e.target.value
                    )
                  }
                  className="w-full pl-12 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none transition-all"
                  placeholder={
                    userType === "driver"
                      ? "Enter your full name"
                      : "Enter company name"
                  }
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <BiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 text-xl" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <BiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 text-xl" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="w-full pl-12 pr-12 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none transition-all"
                    placeholder="Create password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <BiHide className="text-xl" />
                    ) : (
                      <BiShow className="text-xl" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <BiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 text-xl" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="w-full pl-12 pr-12 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none transition-all"
                    placeholder="Confirm password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? (
                      <BiHide className="text-xl" />
                    ) : (
                      <BiShow className="text-xl" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-white/20 border-white/30 rounded focus:ring-purple-500 mt-1"
              />
              <span className="ml-3 text-sm text-white">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-white font-semibold hover:text-purple-200 transition-colors"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-white font-semibold hover:text-purple-200 transition-colors"
                >
                  Privacy Policy
                </a>
              </span>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !agreeToTerms}
              className="w-full bg-white text-purple-700 py-3 px-4 rounded-xl hover:bg-gray-100 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : (
                `Create ${userType === "driver" ? "Driver" : "Company"} Account`
              )}
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-purple-100 py-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-white font-semibold hover:text-purple-200 transition-colors underline "
              >
                Sign in <span className="text-orange-500 font-bold">here</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
