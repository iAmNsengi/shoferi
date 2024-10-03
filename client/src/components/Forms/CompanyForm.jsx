import { Dialog, Transition } from "@headlessui/react";
import CustomButton from "../CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Fragment, useEffect, useState } from "react";
import TextInput from "../TextInput";
import { useCompanies } from "../../hooks/useCompanies";
import Loading from "../Loading";
import { updateCompany } from "../../api/companies";

const CompanyForm = ({ open, setOpen, value }) => {
  const { user } = useSelector((state) => state.user);
  const { company, loading, error, getCompany } = useCompanies();

  useEffect(() => {
    getCompany(value?._id);
  }, []);

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: company?.name,
      location: company?.location,
      contact: company?.contact,
      about: company?.about,
    },
  });

  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState("");
  const [uploadCv, setUploadCv] = useState("");

  const onSubmit = async (data) => {
    try {
      const updatedData = { ...data };
      if (profileImage) {
        const imageUrl = await uploadImage(profileImage);
        updatedData.profileUrl = imageUrl;
      }

      const result = await updateCompany(company?._id, updatedData);
      if (result.success) {
        setOpen(false);
        // toast.success("Company updated successfully");
      } else {
        // Handle error
        console.error("Failed to update company:", result.error);
      }
    } catch (error) {
      console.error("Error updating company:", error);
      // Optionally, show an error message
    }
  };

  const closeModal = () => setOpen(false);

  return (
    <>
      {loading && <Loading />}
      <Transition appear show={open ?? false} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900"
                  >
                    Edit Company Profile
                  </Dialog.Title>

                  <form
                    className="w-full mt-2 flex flex-col gap-5"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <TextInput
                      name="name"
                      label="Company Name"
                      type="text"
                      value={company?.name}
                      register={register("name", {
                        required: "Company Name is required",
                      })}
                      error={errors.name ? errors.name?.message : ""}
                    />

                    <TextInput
                      name="location"
                      label="Location/Address"
                      placeholder="eg. Califonia"
                      type="text"
                      register={register("location", {
                        required: "Address is required",
                      })}
                      error={errors.location ? errors.location?.message : ""}
                    />

                    <div className="w-full flex gap-2">
                      <div className="w-1/2">
                        <TextInput
                          name="contact"
                          label="Contact"
                          placeholder="Phone Number"
                          value={company?.contact}
                          type="text"
                          register={register("contact", {
                            required: "Contact is required!",
                          })}
                          error={errors.contact ? errors.contact?.message : ""}
                        />
                      </div>

                      <div className="w-1/2 mt-2">
                        <label className="text-gray-600 text-sm mb-1">
                          Company Logo
                        </label>
                        <input
                          type="file"
                          onChange={(e) => setProfileImage(e.target.files[0])}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-gray-600 text-sm mb-1">
                        About Company
                      </label>
                      <textarea
                        className="ounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-4 py-2 resize-none"
                        rows={4}
                        cols={6}
                        {...register("about", {
                          required: "Write a little bit about your company.",
                        })}
                        aria-invalid={errors.about ? "true" : "false"}
                      ></textarea>
                      {errors.about && (
                        <span
                          role="alert"
                          className="text-xs text-red-500 mt-0.5"
                        >
                          {errors.about?.message}
                        </span>
                      )}
                    </div>

                    <div className="mt-4">
                      <CustomButton
                        type="submit"
                        containerStyles="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-8 py-2 text-sm font-medium text-white hover:bg-[#1d4fd846] hover:text-[#1d4fd8] focus:outline-none "
                        title={"Submit"}
                      />
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default CompanyForm;
