import React, { useState, useEffect } from "react";
import {
  BiUser,
  BiLock,
  BiShow,
  BiHide,
  BiCar,
  BiBuilding,
} from "react-icons/bi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store";
import { useRegister } from "../../hooks/useQueries";

const Register = () => {
  const [userType, setUserType] = useState("driver"); // "driver" or "company"
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    industry: "",
    companySize: "1-10",
    website: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuthStore();
  const registerMutation = useRegister();

  const from = location.state?.from?.pathname || "/feed";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (!agreeToTerms) {
      alert("Please agree to terms and conditions");
      return;
    }

    // Enhanced validation based on account type
    if (userType === "company") {
      if (!formData.companyName?.trim()) {
        alert("Company name is required");
        return;
      }
      if (!formData.email?.trim()) {
        alert("Email is required");
        return;
      }
      if (!formData.password?.trim()) {
        alert("Password is required");
        return;
      }
      if (formData.companyName.trim().length < 2) {
        alert("Company name must be at least 2 characters long");
        return;
      }
    } else {
      if (
        !formData.firstName?.trim() ||
        !formData.lastName?.trim() ||
        !formData.email?.trim() ||
        !formData.password?.trim()
      ) {
        alert("Please fill in all required fields");
        return;
      }
      if (formData.firstName.trim().length < 2) {
        alert("First name must be at least 2 characters long");
        return;
      }
      if (formData.lastName.trim().length < 2) {
        alert("Last name must be at least 2 characters long");
        return;
      }
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    // Prepare userData object
    const userData = {
      email: formData.email.trim(),
      password: formData.password,
      accountType: userType,
    };

    // Add fields based on account type
    if (userType === "company") {
      userData.companyName = formData.companyName.trim();
      if (formData.industry) userData.industry = formData.industry;
      if (formData.companySize) userData.companySize = formData.companySize;
      if (formData.website) userData.website = formData.website.trim();
    } else {
      userData.firstName = formData.firstName.trim();
      userData.lastName = formData.lastName.trim();
    }

    try {
      const response = await registerMutation.mutateAsync(userData);
      if (response.data) {
        login(response.data.user, response.data.token);
        navigate(from, { replace: true });
      }
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 pt-20 flex items-center justify-center p-4">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-300/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-3xl">
        {/* Registration Card */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-green-100">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Join Shoferi
            </h1>
            <p className="text-gray-600">
              Create your account and start your journey
            </p>
          </div>

          {/* User Type Selection */}
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setUserType("driver")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  userType === "driver"
                    ? "bg-green-50 border-green-300 text-green-700 shadow-md"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
                disabled={registerMutation.isPending}
              >
                <BiCar className="text-2xl mx-auto mb-2" />
                <div className="font-semibold">I'm a Driver</div>
                <div className="text-sm opacity-80">
                  Looking for driving jobs
                </div>
              </button>
              <button
                type="button"
                onClick={() => setUserType("company")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  userType === "company"
                    ? "bg-green-50 border-green-300 text-green-700 shadow-md"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
                disabled={registerMutation.isPending}
              >
                <BiBuilding className="text-2xl mx-auto mb-2" />
                <div className="font-semibold">I'm a Company</div>
                <div className="text-sm opacity-80">Posting driving jobs</div>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {registerMutation.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-center">
              {registerMutation.error.response?.data?.message ||
                "Registration failed"}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name (for companies) */}
            {userType === "company" && (
              <div>
                <label className="block text-gray-800 text-sm font-medium mb-2">
                  Company Name
                </label>
                <div className="relative">
                  <BiBuilding className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 text-xl" />
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) =>
                      handleInputChange("companyName", e.target.value)
                    }
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-800 placeholder-gray-600 focus:ring-2 focus:ring-green-300 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your company name"
                    required
                    disabled={registerMutation.isPending}
                  />
                </div>
              </div>
            )}

            {/* Name Fields (for drivers) */}
            {userType === "driver" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-800 text-sm font-medium mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <BiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 text-xl" />
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-800 placeholder-gray-600 focus:ring-2 focus:ring-green-300 focus:border-transparent outline-none transition-all"
                      placeholder="Enter your first name"
                      required
                      disabled={registerMutation.isPending}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-800 text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <BiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 text-xl" />
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-800 placeholder-gray-600 focus:ring-2 focus:ring-green-300 focus:border-transparent outline-none transition-all"
                      placeholder="Enter your last name"
                      required
                      disabled={registerMutation.isPending}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-gray-800 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <BiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 text-xl" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-800 placeholder-gray-600 focus:ring-2 focus:ring-green-300 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your email"
                  required
                  disabled={registerMutation.isPending}
                />
              </div>
            </div>

            {/* Company Details (for companies) */}
            {userType === "company" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-800 text-sm font-medium mb-2">
                    Industry
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) =>
                      handleInputChange("industry", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-gray-50 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-green-300 focus:border-transparent outline-none transition-all"
                    disabled={registerMutation.isPending}
                  >
                    <option value="" className="text-gray-900">
                      Select Industry
                    </option>
                    <option value="transportation" className="text-gray-900">
                      Transportation
                    </option>
                    <option value="logistics" className="text-gray-900">
                      Logistics
                    </option>
                    <option value="delivery" className="text-gray-900">
                      Delivery Services
                    </option>
                    <option value="rideshare" className="text-gray-900">
                      Ride Sharing
                    </option>
                    <option value="freight" className="text-gray-900">
                      Freight
                    </option>
                    <option value="other" className="text-gray-900">
                      Other
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-800 text-sm font-medium mb-2">
                    Company Size
                  </label>
                  <select
                    value={formData.companySize}
                    onChange={(e) =>
                      handleInputChange("companySize", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-gray-50 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-green-300 focus:border-transparent outline-none transition-all"
                    disabled={registerMutation.isPending}
                  >
                    <option value="1-10" className="text-gray-900">
                      1-10 employees
                    </option>
                    <option value="11-50" className="text-gray-900">
                      11-50 employees
                    </option>
                    <option value="51-200" className="text-gray-900">
                      51-200 employees
                    </option>
                    <option value="201-500" className="text-gray-900">
                      201-500 employees
                    </option>
                    <option value="500+" className="text-gray-900">
                      500+ employees
                    </option>
                  </select>
                </div>
              </div>
            )}

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-800 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <BiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 text-xl" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-800 placeholder-gray-600 focus:ring-2 focus:ring-green-300 focus:border-transparent outline-none transition-all"
                    placeholder="Create password"
                    required
                    minLength={6}
                    disabled={registerMutation.isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={registerMutation.isPending}
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
                <label className="block text-gray-800 text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <BiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 text-xl" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-800 placeholder-gray-600 focus:ring-2 focus:ring-green-300 focus:border-transparent outline-none transition-all"
                    placeholder="Confirm password"
                    required
                    disabled={registerMutation.isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={registerMutation.isPending}
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
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4 text-green-600 bg-gray-50 border-gray-200 rounded focus:ring-green-500 mt-1"
                required
                disabled={registerMutation.isPending}
              />
              <div className="text-sm text-gray-800">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-gray-800 hover:underline font-semibold"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-gray-800 hover:underline font-semibold"
                >
                  Privacy Policy
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                registerMutation.isPending ||
                !agreeToTerms ||
                formData.password !== formData.confirmPassword
              }
              className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {registerMutation.isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : (
                `Create ${userType === "driver" ? "Driver" : "Company"} Account`
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-green-600 font-semibold hover:text-green-700 transition-colors underline"
              >
                Sign In <span className="text-green-500 font-bold">here</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
