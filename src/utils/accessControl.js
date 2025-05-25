// src/utils/accessControl.js
class AccessControl {
  constructor(currentPlan) {
    this.currentPlan = currentPlan || {
      plan: {
        name: "free",
        limits: {
          jobApplications: 10,
          contacts: 20,
          documentStorage: 5, // MB
        },
      },
    };
  }

  // Check if user can create a new job application
  canCreateJobApplication(currentCount) {
    const limit = this.currentPlan?.plan?.limits?.jobApplications;

    // If limit is -1 or no limit, unlimited applications are allowed
    if (!limit || limit === -1) return true;

    // Otherwise, check against the current count
    return currentCount < limit;
  }

  // Check if user can create a new contact
  canCreateContact(currentCount) {
    const limit = this.currentPlan?.plan?.limits?.contacts;

    // If limit is -1 or no limit, unlimited contacts are allowed
    if (!limit || limit === -1) return true;

    // Otherwise, check against the current count
    return currentCount < limit;
  }

  // Check if user can upload a document with given size
  canUploadDocument(sizeInMB, currentUsage) {
    const limit = this.currentPlan?.plan?.limits?.documentStorage;

    // If limit is -1 or no limit, unlimited storage is allowed
    if (!limit || limit === -1) return true;

    // Otherwise, check if the new document would exceed the limit
    return currentUsage + sizeInMB <= limit;
  }

  // Check if user can access advanced analytics
  canAccessAdvancedAnalytics() {
    return this.currentPlan?.plan?.limits?.advancedAnalytics === true;
  }

  // Check if user can export data
  canExportData() {
    return this.currentPlan?.plan?.limits?.exportData === true;
  }

  // Check if user can create a public profile
  canCreatePublicProfile() {
    return this.currentPlan?.plan?.limits?.publicProfile === true;
  }

  // Get remaining job applications
  getRemainingJobApplications(currentCount) {
    const limit = this.currentPlan?.plan?.limits?.jobApplications;

    if (!limit || limit === -1) return Infinity;

    return Math.max(0, limit - currentCount);
  }

  // Get remaining contacts
  getRemainingContacts(currentCount) {
    const limit = this.currentPlan?.plan?.limits?.contacts;

    if (!limit || limit === -1) return Infinity;

    return Math.max(0, limit - currentCount);
  }

  // Get remaining storage space in MB
  getRemainingStorage(currentUsage) {
    const limit = this.currentPlan?.plan?.limits?.documentStorage;

    if (!limit || limit === -1) return Infinity;

    return Math.max(0, limit - currentUsage);
  }
}

export default AccessControl;
