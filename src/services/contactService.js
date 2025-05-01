import api from "../utils/axiosConfig";

/**
 * Load contacts with optional filters
 * @param {Object} filters - Filter parameters
 * @param {Number} page - Current page number
 * @param {Number} limit - Items per page
 * @returns {Promise} Promise resolving to contact data
 */
export const loadContacts = async (filters = {}, page = 1, limit = 10) => {
  const queryParams = new URLSearchParams({
    page,
    limit,
    ...filters,
  });

  const response = await api.get(`/contacts?${queryParams}`);
  return response.data;
};

/**
 * Get contact by ID
 * @param {String} contactId - Contact ID
 * @returns {Promise} Promise resolving to contact data
 */
export const getContactById = async (contactId) => {
  const response = await api.get(`/contacts/${contactId}`);
  return response.data.contact;
};

/**
 * Create a new contact
 * @param {Object} contactData - Contact data
 * @returns {Promise} Promise resolving to created contact
 */
export const createContact = async (contactData) => {
  const response = await api.post("/contacts", contactData);
  return response.data.contact;
};

/**
 * Update contact
 * @param {String} contactId - Contact ID
 * @param {Object} contactData - Updated contact data
 * @returns {Promise} Promise resolving to updated contact
 */
export const updateContact = async (contactId, contactData) => {
  const response = await api.patch(`/contacts/${contactId}`, contactData);
  return response.data.contact;
};

/**
 * Delete contact
 * @param {String} contactId - Contact ID
 * @returns {Promise} Promise resolving to success status
 */
export const deleteContact = async (contactId) => {
  await api.delete(`/contacts/${contactId}`);
  return true;
};

/**
 * Toggle favorite status for contact
 * @param {String} contactId - Contact ID
 * @returns {Promise} Promise resolving to updated contact
 */
export const toggleContactFavorite = async (contactId) => {
  const response = await api.patch(`/contacts/${contactId}/favorite`);
  return response.data.contact;
};

/**
 * Add interaction to contact
 * @param {String} contactId - Contact ID
 * @param {Object} interactionData - Interaction data
 * @returns {Promise} Promise resolving to updated contact
 */
export const addInteraction = async (contactId, interactionData) => {
  const response = await api.post(
    `/contacts/${contactId}/interactions`,
    interactionData
  );
  return response.data.contact;
};

/**
 * Update interaction
 * @param {String} contactId - Contact ID
 * @param {String} interactionId - Interaction ID
 * @param {Object} interactionData - Updated interaction data
 * @returns {Promise} Promise resolving to updated contact
 */
export const updateInteraction = async (
  contactId,
  interactionId,
  interactionData
) => {
  const response = await api.patch(
    `/contacts/${contactId}/interactions/${interactionId}`,
    interactionData
  );
  return response.data.contact;
};

/**
 * Delete interaction
 * @param {String} contactId - Contact ID
 * @param {String} interactionId - Interaction ID
 * @returns {Promise} Promise resolving to updated contact
 */
export const deleteInteraction = async (contactId, interactionId) => {
  const response = await api.delete(
    `/contacts/${contactId}/interactions/${interactionId}`
  );
  return response.data.contact;
};

export default {
  loadContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  toggleContactFavorite,
  addInteraction,
  updateInteraction,
  deleteInteraction,
};
