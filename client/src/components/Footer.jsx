import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-orange-500">Shoferi</h3>
            <p className="text-gray-300">
              Shoferi is Rwanda's premier platform connecting skilled drivers
              with opportunities. We're revolutionizing the transportation
              industry by creating a seamless bridge between professional
              drivers and those seeking reliable transportation services.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-orange-500">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-500">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-500">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-500">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-500">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/find-jobs"
                  className="text-gray-300 hover:text-orange-500"
                >
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/find-drivers"
                  className="text-gray-300 hover:text-orange-500"
                >
                  Find Drivers
                </Link>
              </li>
              <li>
                <Link
                  to="/companies"
                  className="text-gray-300 hover:text-orange-500"
                >
                  Companies
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us"
                  className="text-gray-300 hover:text-orange-500"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-500">
              Our Services
            </h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Driver Recruitment</li>
              <li className="text-gray-300">Job Matching</li>
              <li className="text-gray-300">Driver Verification</li>
              <li className="text-gray-300">Booking Management</li>
              <li className="text-gray-300">Rating & Reviews</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-500">
              Contact Us
            </h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Email: info@shoferi.com</li>
              <li className="text-gray-300">Phone: +250 788 123 456</li>
              <li className="text-gray-300">Address: Kigali, Rwanda</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © {new Date().getFullYear()} Shoferi. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/privacy"
                className="text-gray-300 hover:text-orange-500 text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-300 hover:text-orange-500 text-sm"
              >
                Terms of Service
              </Link>
              <Link
                to="/faq"
                className="text-gray-300 hover:text-orange-500 text-sm"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
