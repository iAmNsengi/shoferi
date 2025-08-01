import React from "react";
import { BiBriefcase, BiLoader } from "react-icons/bi";

const CreateJob = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center gap-4 mb-8">
            <BiBriefcase className="text-3xl text-green-600" />
            <h1 className="text-3xl font-bold text-gray-800">Create Job</h1>
          </div>

          <div className="text-center py-12 text-gray-500">
            <BiLoader className="text-4xl mx-auto mb-2" />
            <p>Create Job form will be implemented with React Query</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
