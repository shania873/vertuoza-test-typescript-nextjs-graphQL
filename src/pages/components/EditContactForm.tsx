import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Transition,
  Button,
} from "@headlessui/react";
import { Contact, Company } from "../api/types";

interface EntityProps {
  entity: Contact | Company;
  onSave: () => void;
  isOpen: boolean;
}

const UPDATE_ENTITY = gql`
  mutation UpdateEntity($input: UpdateEntityInput!) {
    updateEntity(input: $input) {
      id
      name
      ... on Contact {
        email
        phone
      }
      ... on Company {
        industry
        contactEmail
      }
    }
  }
`;

const EditEntityForm: React.FC<EntityProps> = ({ entity, onSave }) => {
  if (!entity) {
    return <p>Entity data is missing!</p>;
  }
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    entityType: "email" in entity ? "Contact" : "Company",
    id: entity.id,
    name: entity.name,
    email: "email" in entity ? entity.email : "",
    phone: "phone" in entity ? entity.phone : "",
    industry: "industry" in entity ? entity.industry : "",
    contactEmail: "contactEmail" in entity ? entity.contactEmail : "",
  });

  const [updateEntity, { loading, error }] = useMutation(UPDATE_ENTITY, {
    onCompleted: () => {
      onSave();
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateEntity({ variables: { input: formData } });
    setIsOpen(false);
  };

  console.log(entity);

  return (
    <>
      <Button
        className="rounded bg-sky-600 py-2 px-4 text-sm text-white hover:bg-sky-500 active:bg-sky-700"
        onClick={() => setIsOpen(true)}
      >
        Open dialog
      </Button>
      <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={React.Fragment}
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <DialogBackdrop className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="transition-transform duration-200"
              enterFrom="scale-95"
              enterTo="scale-100"
              leave="transition-transform duration-200"
              leaveFrom="scale-100"
              leaveTo="scale-95"
            >
              <DialogPanel className="max-w-md w-full bg-white rounded-lg p-6 shadow-lg">
                <DialogTitle className="text-lg font-medium text-gray-900">
                  Edit Entity
                </DialogTitle>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                    className="w-full rounded border border-gray-300 p-2 text-black"
                  />
                  {"email" in entity && (
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="w-full rounded border border-gray-300 p-2 text-black"
                    />
                  )}
                  {"phone" in entity && (
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone"
                      className="w-full rounded border border-gray-300 p-2 text-black"
                    />
                  )}
                  {"industry" in entity && (
                    <input
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      placeholder="Industry"
                      className="w-full rounded border border-gray-300 p-2 text-black"
                    />
                  )}
                  {"contactEmail" in entity && (
                    <input
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      placeholder="Contact Email"
                      className="w-full rounded border border-gray-300 p-2 text-black"
                    />
                  )}
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button
                      type="button"
                      className="rounded bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </Button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-500"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
                {loading && <p>Updating...</p>}
                {error && (
                  <p className="text-red-500 text-sm">Error: {error.message}</p>
                )}
              </DialogPanel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default EditEntityForm;
