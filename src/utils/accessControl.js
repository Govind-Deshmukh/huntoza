// src/utils/accessControl.js
class AccessControl {
  constructor(currentPlan) {
    this.currentPlan = currentPlan || {
      plan: {
        name: "free",
        limits: {},
      },
    };
  }

  // Check if user can create a new job application
  canCreateJobApplication(currentCount) {
    // Get the limit from the plan
    const limit = this.currentPlan?.plan?.limits?.jobApplications;

    // If limit is -1, it means unlimited
    if (limit === -1) return true;

    // If limit is not defined, default to free plan limit
    const maxCount = limit || 5;

    return currentCount < maxCount;
  }

  // Check if user can create a new contact
  canCreateContact(currentCount) {
    // Get the limit from the plan
    const limit = this.currentPlan?.plan?.limits?.contacts;

    // If limit is -1, it means unlimited
    if (limit === -1) return true;

    // If limit is not defined, default to free plan limit
    const maxCount = limit || 10;

    return currentCount < maxCount;
  }

  // Check if user can upload a document
  canUploadDocument(currentSize, fileSize) {
    // Get the limit from the plan in MB
    const limit = this.currentPlan?.plan?.limits?.documentStorage;

    // If limit is -1, it means unlimited
    if (limit === -1) return true;

    // If limit is not defined, default to free plan limit (5MB)
    const maxSize = (limit || 5) * 1024 * 1024; // Convert MB to bytes

    return currentSize + fileSize <= maxSize;
  }

  // Check if user can access analytics features
  canAccessAnalytics() {
    // Free plan users can't access advanced analytics
    return this.currentPlan?.plan?.name !== "free";
  }

  // Check if user can create custom tags
  canCreateCustomTags() {
    // Only premium plans can create custom tags
    return this.currentPlan?.plan?.name !== "free";
  }
}

export default AccessControl;
