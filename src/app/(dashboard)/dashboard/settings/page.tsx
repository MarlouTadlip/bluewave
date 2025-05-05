"use server";
import React from "react";
import { prisma } from "@/lib/db";
import { getSession } from "@/features/users/actions/session";
import { redirect } from "next/navigation";
import { PlusCircle, Edit, Trash2, Eye } from "lucide-react";
import {
  createCategory,
  updateCategory,
  toggleCategoryActive,
  createLocation,
  updateLocation,
  toggleLocationActive,
} from "./actions/settingsActions";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session || typeof session.userId !== "string") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { userId: session.userId },
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Settings
        </h1>
        <p className="text-red-500">
          Access denied. Only admins can access this page. Your role:{" "}
          {user?.role || "Unknown"}
        </p>
      </div>
    );
  }

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  const inactiveCategories = await prisma.category.findMany({
    where: { isActive: false },
    orderBy: { name: "asc" },
  });

  const locations = await prisma.location.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  const inactiveLocations = await prisma.location.findMany({
    where: { isActive: false },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Settings
        </h1>
        <p className="text-gray-500">
          Manage categories and locations for BlueWave events.
        </p>
      </div>

      {/* Categories Section */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h2 className="card-title">Categories</h2>
            <div className="flex gap-2">
              <label
                htmlFor="create-category-modal"
                className="btn btn-primary btn-sm"
              >
                <PlusCircle className="h-4 w-4" /> Add Category
              </label>
              <label
                htmlFor="inactive-categories-modal"
                className="btn btn-outline btn-sm"
              >
                <Eye className="h-4 w-4" /> View Inactive
              </label>
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Icon URL</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-500">
                      No active categories found.
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.categoryId}>
                      <td>{category.name}</td>
                      <td>{category.description}</td>
                      <td>
                        <a
                          href={category.iconURL}
                          target="_blank"
                          className="link link-primary"
                        >
                          View Icon
                        </a>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <label
                            htmlFor={`edit-category-modal-${category.categoryId}`}
                            className="btn btn-secondary btn-sm"
                          >
                            <Edit className="h-4 w-4" /> Edit
                          </label>
                          <label
                            htmlFor={`deactivate-category-modal-${category.categoryId}`}
                            className="btn btn-error btn-sm"
                          >
                            <Trash2 className="h-4 w-4" /> Deactivate
                          </label>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Locations Section */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h2 className="card-title">Locations</h2>
            <div className="flex gap-2">
              <label
                htmlFor="create-location-modal"
                className="btn btn-primary btn-sm"
              >
                <PlusCircle className="h-4 w-4" /> Add Location
              </label>
              <label
                htmlFor="inactive-locations-modal"
                className="btn btn-outline btn-sm"
              >
                <Eye className="h-4 w-4" /> View Inactive
              </label>
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {locations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-500">
                      No active locations found.
                    </td>
                  </tr>
                ) : (
                  locations.map((location) => (
                    <tr key={location.locationId}>
                      <td>{location.name}</td>
                      <td>{location.description}</td>
                      <td>{location.latitude}</td>
                      <td>{location.longitude}</td>
                      <td>
                        <a
                          href={location.image}
                          target="_blank"
                          className="link link-primary"
                        >
                          View Image
                        </a>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <label
                            htmlFor={`edit-location-modal-${location.locationId}`}
                            className="btn btn-secondary btn-sm"
                          >
                            <Edit className="h-4 w-4" /> Edit
                          </label>
                          <label
                            htmlFor={`deactivate-location-modal-${location.locationId}`}
                            className="btn btn-error btn-sm"
                          >
                            <Trash2 className="h-4 w-4" /> Deactivate
                          </label>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Category Modal */}
      <input
        type="checkbox"
        id="create-category-modal"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Category</h3>
          <form action={createCategory}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                name="description"
                className="textarea textarea-bordered w-full"
                required
              ></textarea>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Icon URL</span>
              </label>
              <input
                type="url"
                name="iconURL"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Create
              </button>
              <label htmlFor="create-category-modal" className="btn">
                Cancel
              </label>
            </div>
          </form>
        </div>
      </div>

      {/* Edit Category Modals */}
      {categories.map((category) => (
        <React.Fragment key={category.categoryId}>
          <input
            type="checkbox"
            id={`edit-category-modal-${category.categoryId}`}
            className="modal-toggle"
          />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">
                Edit Category: {category.name}
              </h3>
              <form action={updateCategory.bind(null, category.categoryId)}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={category.name}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    name="description"
                    defaultValue={category.description}
                    className="textarea textarea-bordered w-full"
                    required
                  ></textarea>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Icon URL</span>
                  </label>
                  <input
                    type="url"
                    name="iconURL"
                    defaultValue={category.iconURL}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="modal-action">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                  <label
                    htmlFor={`edit-category-modal-${category.categoryId}`}
                    className="btn"
                  >
                    Cancel
                  </label>
                </div>
              </form>
            </div>
          </div>
        </React.Fragment>
      ))}

      {/* Deactivate Category Modals */}
      {categories.map((category) => (
        <React.Fragment key={category.categoryId}>
          <input
            type="checkbox"
            id={`deactivate-category-modal-${category.categoryId}`}
            className="modal-toggle"
          />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">
                Deactivate Category: {category.name}
              </h3>
              <p className="py-4">
                Are you sure you want to deactivate this category? It will not
                be available for new clean-up data but can be reactivated later.
              </p>
              <form
                action={toggleCategoryActive.bind(
                  null,
                  category.categoryId,
                  false
                )}
              >
                <div className="modal-action">
                  <button type="submit" className="btn btn-error">
                    Deactivate
                  </button>
                  <label
                    htmlFor={`deactivate-category-modal-${category.categoryId}`}
                    className="btn"
                  >
                    Cancel
                  </label>
                </div>
              </form>
            </div>
          </div>
        </React.Fragment>
      ))}

      {/* Inactive Categories Modal */}
      <input
        type="checkbox"
        id="inactive-categories-modal"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box max-w-4xl">
          <h3 className="font-bold text-lg">Inactive Categories</h3>
          <div className="overflow-x-auto mt-4">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Icon URL</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inactiveCategories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-500">
                      No inactive categories found.
                    </td>
                  </tr>
                ) : (
                  inactiveCategories.map((category) => (
                    <tr key={category.categoryId}>
                      <td>{category.name}</td>
                      <td>{category.description}</td>
                      <td>
                        <a
                          href={category.iconURL}
                          target="_blank"
                          className="link link-primary"
                        >
                          View Icon
                        </a>
                      </td>
                      <td>
                        <label
                          htmlFor={`reactivate-category-modal-${category.categoryId}`}
                          className="btn btn-success btn-sm"
                        >
                          <PlusCircle className="h-4 w-4" /> Reactivate
                        </label>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="modal-action">
            <label htmlFor="inactive-categories-modal" className="btn">
              Close
            </label>
          </div>
        </div>
      </div>

      {/* Reactivate Category Modals */}
      {inactiveCategories.map((category) => (
        <React.Fragment key={category.categoryId}>
          <input
            type="checkbox"
            id={`reactivate-category-modal-${category.categoryId}`}
            className="modal-toggle"
          />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">
                Reactivate Category: {category.name}
              </h3>
              <p className="py-4">
                Are you sure you want to reactivate this category? It will
                become available for new clean-up data.
              </p>
              <form
                action={toggleCategoryActive.bind(
                  null,
                  category.categoryId,
                  true
                )}
              >
                <div className="modal-action">
                  <button type="submit" className="btn btn-success">
                    Reactivate
                  </button>
                  <label
                    htmlFor={`reactivate-category-modal-${category.categoryId}`}
                    className="btn"
                  >
                    Cancel
                  </label>
                </div>
              </form>
            </div>
          </div>
        </React.Fragment>
      ))}

      {/* Create Location Modal */}
      <input
        type="checkbox"
        id="create-location-modal"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Location</h3>
          <form action={createLocation}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                name="description"
                className="textarea textarea-bordered w-full"
                required
              ></textarea>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Image URL</span>
              </label>
              <input
                type="url"
                name="image"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Latitude</span>
              </label>
              <input
                type="number"
                name="latitude"
                step="any"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Longitude</span>
              </label>
              <input
                type="number"
                name="longitude"
                step="any"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Create
              </button>
              <label htmlFor="create-location-modal" className="btn">
                Cancel
              </label>
            </div>
          </form>
        </div>
      </div>

      {/* Edit Location Modals */}
      {locations.map((location) => (
        <React.Fragment key={location.locationId}>
          <input
            type="checkbox"
            id={`edit-location-modal-${location.locationId}`}
            className="modal-toggle"
          />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">
                Edit Location: {location.name}
              </h3>
              <form action={updateLocation.bind(null, location.locationId)}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={location.name}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    name="description"
                    defaultValue={location.description}
                    className="textarea textarea-bordered w-full"
                    required
                  ></textarea>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Image URL</span>
                  </label>
                  <input
                    type="url"
                    name="image"
                    defaultValue={location.image}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Latitude</span>
                  </label>
                  <input
                    type="number"
                    name="latitude"
                    step="any"
                    defaultValue={location.latitude}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Longitude</span>
                  </label>
                  <input
                    type="number"
                    name="longitude"
                    step="any"
                    defaultValue={location.longitude}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="modal-action">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                  <label
                    htmlFor={`edit-location-modal-${location.locationId}`}
                    className="btn"
                  >
                    Cancel
                  </label>
                </div>
              </form>
            </div>
          </div>
        </React.Fragment>
      ))}

      {/* Deactivate Location Modals */}
      {locations.map((location) => (
        <React.Fragment key={location.locationId}>
          <input
            type="checkbox"
            id={`deactivate-location-modal-${location.locationId}`}
            className="modal-toggle"
          />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">
                Deactivate Location: {location.name}
              </h3>
              <p className="py-4">
                Are you sure you want to deactivate this location? It will not
                be available for new events but can be reactivated later.
                Existing events will remain linked.
              </p>
              <form
                action={toggleLocationActive.bind(
                  null,
                  location.locationId,
                  false
                )}
              >
                <div className="modal-action">
                  <button type="submit" className="btn btn-error">
                    Deactivate
                  </button>
                  <label
                    htmlFor={`deactivate-location-modal-${location.locationId}`}
                    className="btn"
                  >
                    Cancel
                  </label>
                </div>
              </form>
            </div>
          </div>
        </React.Fragment>
      ))}

      {/* Inactive Locations Modal */}
      <input
        type="checkbox"
        id="inactive-locations-modal"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box max-w-4xl">
          <h3 className="font-bold text-lg">Inactive Locations</h3>
          <div className="overflow-x-auto mt-4">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inactiveLocations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-500">
                      No inactive locations found.
                    </td>
                  </tr>
                ) : (
                  inactiveLocations.map((location) => (
                    <tr key={location.locationId}>
                      <td>{location.name}</td>
                      <td>{location.description}</td>
                      <td>{location.latitude}</td>
                      <td>{location.longitude}</td>
                      <td>
                        <a
                          href={location.image}
                          target="_blank"
                          className="link link-primary"
                        >
                          View Image
                        </a>
                      </td>
                      <td>
                        <label
                          htmlFor={`reactivate-location-modal-${location.locationId}`}
                          className="btn btn-success btn-sm"
                        >
                          <PlusCircle className="h-4 w-4" /> Reactivate
                        </label>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="modal-action">
            <label htmlFor="inactive-locations-modal" className="btn">
              Close
            </label>
          </div>
        </div>
      </div>

      {/* Reactivate Location Modals */}
      {inactiveLocations.map((location) => (
        <React.Fragment key={location.locationId}>
          <input
            type="checkbox"
            id={`reactivate-location-modal-${location.locationId}`}
            className="modal-toggle"
          />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">
                Reactivate Location: {location.name}
              </h3>
              <p className="py-4">
                Are you sure you want to reactivate this location? It will
                become available for new events.
              </p>
              <form
                action={toggleLocationActive.bind(
                  null,
                  location.locationId,
                  true
                )}
              >
                <div className="modal-action">
                  <button type="submit" className="btn btn-success">
                    Reactivate
                  </button>
                  <label
                    htmlFor={`reactivate-location-modal-${location.locationId}`}
                    className="btn"
                  >
                    Cancel
                  </label>
                </div>
              </form>
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
