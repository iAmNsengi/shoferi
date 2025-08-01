import React, { useState } from "react";
import { useAuthStore } from "../store";
import {
  BiUser,
  BiCog,
  BiShield,
  BiBell,
  BiHelpCircle,
  BiLoader,
} from "react-icons/bi";

const Settings = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: BiUser },
    { id: "preferences", label: "Preferences", icon: BiCog },
    { id: "notifications", label: "Notifications", icon: BiBell },
    { id: "privacy", label: "Privacy & Security", icon: BiShield },
    { id: "help", label: "Help & Support", icon: BiHelpCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 pt-24">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                {user?.firstName?.charAt(0) || "U"}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
                <p className="text-gray-600">Manage your account settings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-8">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <IconComponent className="text-lg" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">
                {activeTab === "profile" && "Profile Settings"}
                {activeTab === "preferences" && "Preferences"}
                {activeTab === "notifications" && "Notification Settings"}
                {activeTab === "privacy" && "Privacy & Security"}
                {activeTab === "help" && "Help & Support"}
              </h2>

              <div className="text-center py-12 text-gray-500">
                <BiCog className="text-4xl mx-auto mb-2" />
                <p>Settings interface will be implemented with React Query</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
