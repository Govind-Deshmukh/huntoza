// src/utils/accessControl.js
/**
 * Utility class to handle feature access based on subscription plan
 */
class AccessControl {
  constructor(currentPlan) {
    this.currentPlan = currentPlan || {
      plan: {
        name: "free",
        limits: {},
      },
    };
  }

  /**
   * Check if user can create a new job application
   * @param {Number} currentCount - Current number of job applications
   * @returns {Boolean} - Whether user can create a new job application
   */
  canCreateJobApplication(currentCount) {
    const limits = this.currentPlan?.plan?.limits || {};

    // If limit is -1, it means unlimited
    if (limits.jobApplications === -1) {
      return true;
    }

    // If no limit is defined, use default free plan limit
    const limit = limits.jobApplications || 10;

    return currentCount < limit;
  }

  /**
   * Check if user can create a new contact
   * @param {Number} currentCount - Current number of contacts
   * @returns {Boolean} - Whether user can create a new contact
   */
  canCreateContact(currentCount) {
    const limits = this.currentPlan?.plan?.limits || {};

    // If limit is -1, it means unlimited
    if (limits.contacts === -1) {
      return true;
    }

    // If no limit is defined, use default free plan limit
    const limit = limits.contacts || 20;

    return currentCount < limit;
  }

  /**
   * Check if user can upload a document
   * @param {Number} currentSize - Current storage used in MB
   * @param {Number} fileSize - Size of file to upload in MB
   * @returns {Boolean} - Whether user can upload the document
   */
  canUploadDocument(currentSize, fileSize) {
    const limits = this.currentPlan?.plan?.limits || {};

    // If limit is -1, it means unlimited
    if (limits.documentStorage === -1) {
      return true;
    }

    // If no limit is defined, use default free plan limit
    const limit = limits.documentStorage || 10; // 10 MB

    return currentSize + fileSize <= limit;
  }

  /**
   * Check if user can access premium features
   * @returns {Boolean} - Whether user can access premium features
   */
  canAccessPremiumFeatures() {
    return this.currentPlan?.plan?.name !== "free";
  }

  /**
   * Get remaining limit for a feature
   * @param {String} feature - Feature name (jobApplications, contacts, documentStorage)
   * @param {Number} currentUsage - Current usage count or size
   * @returns {Object} - Object with limit, used, and remaining values
   */
  getRemainingLimit(feature, currentUsage) {
    const limits = this.currentPlan?.plan?.limits || {};

    // If limit is -1 or not defined, use defaults
    const limit =
      limits[feature] === -1
        ? "Unlimited"
        : limits[feature] ||
          {
            jobApplications: 10,
            contacts: 20,
            documentStorage: 10,
          }[feature];

    return {
      limit,
      used: currentUsage,
      remaining: limit === "Unlimited" ? "Unlimited" : limit - currentUsage,
    };
  }
}

export default AccessControl;
