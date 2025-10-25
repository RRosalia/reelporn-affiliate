/**
 * Google Tag Manager utility functions
 */

declare global {
  interface Window {
    dataLayer: any[];
  }
}

/**
 * Push an event to Google Tag Manager dataLayer
 */
export const gtmPushEvent = (event: string, data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event,
      ...data,
    });
  }
};

/**
 * Track a lead event (form submission)
 */
export const gtmTrackLead = (data?: {
  email?: string;
  value?: number;
  currency?: string;
  [key: string]: any;
}) => {
  gtmPushEvent('generate_lead', {
    event_category: 'lead',
    event_label: 'registration',
    ...data,
  });
};

/**
 * Track a conversion event
 */
export const gtmTrackConversion = (data?: Record<string, any>) => {
  gtmPushEvent('conversion', {
    event_category: 'conversion',
    ...data,
  });
};

/**
 * Track a page view
 */
export const gtmTrackPageView = (pagePath: string, pageTitle?: string) => {
  gtmPushEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  });
};
