import axios from 'axios';
import {postData} from "./lib/request"

interface ErrorReport {
  message: string;
  stack: string;
  url: string;
  userAgent: string;
  timestamp: string;
}

class MonitoringSDK {
  private endpoint: string;

  constructor(endpoint: string,token:string) {
    this.endpoint = endpoint;
    this.init();
  }

  private init() {
    window.addEventListener('error', this.handleErrorEvent.bind(this));
    window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
  }

  private async handleErrorEvent(event: ErrorEvent) {
    console.log('handleErrorEvent', event);
    const errorReport: ErrorReport = {
      message: event.message,
      stack: event.error?.stack || '',
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };
    await this.reportError(errorReport);
  }

  private async handlePromiseRejection(event: PromiseRejectionEvent) {
    const errorReport: ErrorReport = {
      message: event.reason?.message || 'Unhandled Rejection',
      stack: event.reason?.stack || '',
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };
    await this.reportError(errorReport);
  }

  private async reportError(errorReport: ErrorReport) {
    try {
      await postData(this.endpoint, errorReport);
    } catch (error) {
      console.error('Failed to report error:', error);
    }
  }
}

export default MonitoringSDK;
