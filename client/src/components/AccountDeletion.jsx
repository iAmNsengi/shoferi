import React, { useState } from "react";
import { BiTrash, BiShield, BiError } from "react-icons/bi";
import { useAuth } from "../contexts/AuthContext";
import { useDeleteAccount } from "../hooks/useQueries";
import { toast } from "react-hot-toast";

const AccountDeletion = () => {
  const { user } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");

  const deleteAccountMutation = useDeleteAccount();

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    if (confirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }

    try {
      await deleteAccountMutation.mutateAsync(password);
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">Delete Account</h3>
        <p className="text-gray-600">Please log in to manage your account</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BiTrash className="text-red-500 text-2xl" />
        </div>
        <h3 className="text-2xl font-bold mb-2 text-red-600">Delete Account</h3>
        <p className="text-gray-600">This action cannot be undone</p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-3">
          <BiError className="text-red-500 text-xl mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-red-800 mb-2">Warning</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• All your data will be permanently deleted</li>
              <li>
                • Your job posts, applications, and feed posts will be removed
              </li>
              <li>• Your profile and settings will be deleted</li>
              <li>• Any active subscriptions will be cancelled</li>
              <li>• This action cannot be reversed</li>
            </ul>
          </div>
        </div>
      </div>

      {!showConfirmation ? (
        <button
          onClick={() => setShowConfirmation(true)}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
        >
          <BiTrash className="text-lg" />
          Delete My Account
        </button>
      ) : (
        <form onSubmit={handleDeleteAccount} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your password to confirm
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type "DELETE" to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={deleteAccountMutation.isPending}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {deleteAccountMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <BiTrash className="text-lg" />
                  Confirm Deletion
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowConfirmation(false);
                setPassword("");
                setConfirmText("");
              }}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-start gap-3">
          <BiShield className="text-blue-500 text-xl mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">
              Data Protection
            </h4>
            <p className="text-sm text-blue-700">
              We take your privacy seriously. All data deletion requests are
              processed securely and in accordance with our privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDeletion;
