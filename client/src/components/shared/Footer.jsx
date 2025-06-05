import { BiCar } from "react-icons/bi";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <BiCar className="text-white text-lg font-bold" />
              </div>
              <span className="text-xl font-bold">SHOFERI</span>
            </div>
            <h2 className="text-gray-400">
              Connecting drivers with opportunities across Rwanda.
            </h2>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Drivers</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className="hover:text-white transition-colors"
                >
                  Create Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/learn"
                  className="hover:text-white transition-colors"
                >
                  Training
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Companies</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Post Jobs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Find Drivers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; 2024 - {new Date().getFullYear()} <b>Shoferi</b> . All rights
            reserved.
          </p>
          <p className="py-4">
            Developed at{" "}
            <b>
              <a
                href="https://keyypress.com"
                target="_blank"
                className="underline"
              >
                Keyy<span className="text-orange-500">Press</span>
              </a>
            </b>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
