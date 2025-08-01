import { BiCar } from "react-icons/bi";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                <BiCar className="text-white text-lg font-bold" />
              </div>
              <span className="text-xl font-bold">SHOFERI</span>
            </div>
            <h2 className="text-green-200">
              Connecting drivers with opportunities across Rwanda.
            </h2>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-green-100">For Drivers</h4>
            <ul className="space-y-2 text-green-200">
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
            <h4 className="font-semibold mb-4 text-green-100">For Companies</h4>
            <ul className="space-y-2 text-green-200">
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
            <h4 className="font-semibold mb-4 text-green-100">Support</h4>
            <ul className="space-y-2 text-green-200">
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

        <div className="border-t border-green-700 mt-8 pt-8 text-center text-green-200">
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
                className="underline hover:text-white transition-colors"
              >
                Keyy<span className="text-green-400">Press</span>
              </a>
            </b>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
