// src/store/slices/contactsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { contactService } from "../../services";

// Async thunks
export const loadContacts = createAsyncThunk(
  "contacts/loadContacts",
  async ({ filters = {}, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const data = await contactService.loadContacts(filters, page, limit);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createContact = createAsyncThunk(
  "contacts/createContact",
  async (contactData, { rejectWithValue }) => {
    try {
      const contact = await contactService.createContact(contactData);
      return contact;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateContact = createAsyncThunk(
  "contacts/updateContact",
  async ({ contactId, contactData }, { rejectWithValue }) => {
    try {
      const contact = await contactService.updateContact(
        contactId,
        contactData
      );
      return contact;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  async (contactId, { rejectWithValue }) => {
    try {
      await contactService.deleteContact(contactId);
      return contactId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getContactById = createAsyncThunk(
  "contacts/getContactById",
  async (contactId, { rejectWithValue }) => {
    try {
      const contact = await contactService.getContactById(contactId);
      return contact;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const toggleContactFavorite = createAsyncThunk(
  "contacts/toggleContactFavorite",
  async (contactId, { rejectWithValue }) => {
    try {
      const contact = await contactService.toggleContactFavorite(contactId);
      return contact;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addInteraction = createAsyncThunk(
  "contacts/addInteraction",
  async ({ contactId, interactionData }, { rejectWithValue }) => {
    try {
      const contact = await contactService.addInteraction(
        contactId,
        interactionData
      );
      return contact;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Adding the missing action creators
export const updateInteraction = createAsyncThunk(
  "contacts/updateInteraction",
  async (
    { contactId, interactionId, interactionData },
    { rejectWithValue }
  ) => {
    try {
      const contact = await contactService.updateInteraction(
        contactId,
        interactionId,
        interactionData
      );
      return contact;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteInteraction = createAsyncThunk(
  "contacts/deleteInteraction",
  async ({ contactId, interactionId }, { rejectWithValue }) => {
    try {
      const contact = await contactService.deleteInteraction(
        contactId,
        interactionId
      );
      return contact;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Initial state
const initialState = {
  contacts: [],
  currentContact: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
};

// Contacts slice
const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentContact: (state) => {
      state.currentContact = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load contacts
      .addCase(loadContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.contacts;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.numOfPages,
          totalItems: action.payload.totalContacts,
        };
      })
      .addCase(loadContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create contact
      .addCase(createContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts.unshift(action.payload);
        state.pagination.totalItems += 1;
      })
      .addCase(createContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update contact
      .addCase(updateContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.contacts.findIndex(
          (contact) => contact._id === action.payload._id
        );
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
        if (
          state.currentContact &&
          state.currentContact._id === action.payload._id
        ) {
          state.currentContact = action.payload;
        }
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete contact
      .addCase(deleteContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = state.contacts.filter(
          (contact) => contact._id !== action.payload
        );
        state.pagination.totalItems = Math.max(
          0,
          state.pagination.totalItems - 1
        );
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get contact by ID
      .addCase(getContactById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContactById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentContact = action.payload;
      })
      .addCase(getContactById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle favorite
      .addCase(toggleContactFavorite.fulfilled, (state, action) => {
        const index = state.contacts.findIndex(
          (contact) => contact._id === action.payload._id
        );
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
        if (
          state.currentContact &&
          state.currentContact._id === action.payload._id
        ) {
          state.currentContact = action.payload;
        }
      })

      // Add interaction
      .addCase(addInteraction.fulfilled, (state, action) => {
        const index = state.contacts.findIndex(
          (contact) => contact._id === action.payload._id
        );
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
        if (
          state.currentContact &&
          state.currentContact._id === action.payload._id
        ) {
          state.currentContact = action.payload;
        }
      })

      // Add the extra reducers for the new action creators
      // Update interaction
      .addCase(updateInteraction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInteraction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.contacts.findIndex(
          (contact) => contact._id === action.payload._id
        );
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
        if (
          state.currentContact &&
          state.currentContact._id === action.payload._id
        ) {
          state.currentContact = action.payload;
        }
      })
      .addCase(updateInteraction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete interaction
      .addCase(deleteInteraction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInteraction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.contacts.findIndex(
          (contact) => contact._id === action.payload._id
        );
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
        if (
          state.currentContact &&
          state.currentContact._id === action.payload._id
        ) {
          state.currentContact = action.payload;
        }
      })
      .addCase(deleteInteraction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentContact } = contactsSlice.actions;
export default contactsSlice.reducer;
