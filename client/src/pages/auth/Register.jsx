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
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../../store/slices/authSlice";

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

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const from = location.state?.from?.pathname || "/feed";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [dispatch, error]);

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
      if (!formData.firstName?.trim() || !formData.lastName?.trim() || !formData.email?.trim() || !formData.password?.trim()) {
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

    console.log("Submitting registration data:", userData);

    dispatch(registerUser(userData));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br pt-20 from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center p-4">
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
                type="button"
                onClick={() => setUserType("driver")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  userType === "driver"
                    ? "bg-white/20 border-white text-white"
                    : "bg-white/10 border-white/30 text-white/70 hover:bg-white/15"
                }`}
                disabled={loading}
              >
                <BiCar className="text-2xl mx-auto mb-2" />
                <div className="font-semibold">I'm a Driver</div>
                <div className="text-sm opacity-80">Looking for driving jobs</div>
              </button>
              <button
                type="button"
                onClick={() => setUserType("company")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  userType === "company"
                    ? "bg-white/20 border-white text-white"
                    : "bg-white/10 border-white/30 text-white/70 hover:bg-white/15"
                }`}
                disabled={loading}
              >
                <BiBuilding className="text-2xl mx-auto mb-2" />
                <div className="font-semibold">I'm a Company</div>
                <div className="text-sm opacity-80">Posting driving jobs</div>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-100 text-center">
              {error}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name (for companies) */}
            {userType === "company" && (
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Company Name
                </label>
                <div className="relative">
                  <BiBuilding className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 text-xl" />
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) =>
                      handleInputChange("companyName", e.target.value)
                    }
                    className="w-full pl-12 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your company name"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Name Fields (for drivers) */}
            {userType === "driver" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <BiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 text-xl" />
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="w-full pl-12 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none transition-all"
                      placeholder="Enter your first name"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <BiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 text-xl" />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className="w-full pl-12 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your last name"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
            )}

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
                  disabled={loading}
                />
              </div>
            </div>

            {/* Company Details (for companies) */}
            {userType === "company" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Industry
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) =>
                      handleInputChange("industry", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none transition-all"
                    disabled={loading}
                  >
                    <option value="" className="text-gray-900">Select Industry</option>
                    <option value="transportation" className="text-gray-900">Transportation</option>
                    <option value="logistics" className="text-gray-900">Logistics</option>
                    <option value="delivery" className="text-gray-900">Delivery Services</option>
                    <option value="rideshare" className="text-gray-900">Ride Sharing</option>
                    <option value="freight" className="text-gray-900">Freight</option>
                    <option value="other" className="text-gray-900">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Company Size
                  </label>
                  <select
                    value={formData.companySize}
                    onChange={(e) =>
                      handleInputChange("companySize", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none transition-all"
                    disabled={loading}
                  >
                    <option value="1-10" className="text-gray-900">1-10 employees</option>
                    <option value="11-50" className="text-gray-900">11-50 employees</option>
                    <option value="51-200" className="text-gray-900">51-200 employees</option>
                    <option value="201-500" className="text-gray-900">201-500 employees</option>
                    <option value="500+" className="text-gray-900">500+ employees</option>
                  </select>
                </div>
              </div>
            )}

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
                    minLength={6}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                    disabled={loading}
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
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                    disabled={loading}
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
                className="w-4 h-4 text-purple-600 bg-white/20 border-white/30 rounded focus:ring-purple-500 mt-1"
                required
                disabled={loading}
              />
              <div className="text-sm text-white">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-white hover:underline font-semibold"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-white hover:underline font-semibold"
                >
                  Privacy Policy
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                loading ||
                !agreeToTerms ||
                formData.password !== formData.confirmPassword
              }
              className="w-full bg-white text-purple-700 py-3 px-4 rounded-xl hover:bg-gray-100 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : (
                `Create ${
                  userType === "driver" ? "Driver" : "Company"
                } Account`
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-purple-100">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-white font-semibold hover:text-purple-200 transition-colors underline"
              >
                Sign In <span className="text-orange-500 font-bold">here</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
