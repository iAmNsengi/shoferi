import { BiDownload } from "react-icons/bi";

const DownloadApp = () => {
  return (
    <div className="bg-white/50 text-primary-600 py-40 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Text Section */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl font-bold mb-4">Get the Shoferi App</h2>
          <p className="text-green-400 mb-6 max-w-md">
            Download the Shoferi mobile app and find jobs or hire drivers on the
            go. Stay connected wherever you are.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="#"
              className="bg-green-700 text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 hover:scale-105 transition-all"
            >
              <BiDownload className="text-xl" />
              Google Play
            </a>
            <a
              href="#"
              className="border-2 border-green-700 text-green-700 font-semibold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-white hover:text-green-700 transition-all"
            >
              <BiDownload className="text-xl" />
              App Store
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadApp;
