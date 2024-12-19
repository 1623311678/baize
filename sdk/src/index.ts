import axios from "axios";
import { postData } from "./lib/request";
import { recordDailyVisit } from "./lib/uv";

interface ErrorReport {
  message: string;
  stack: string;
  url: string;
  userAgent: string;
  timestamp: string;
  type: string;
  level?:string
}
interface Options {
  domain: string;
  token?: string;
}
interface ReportOptions {
  message: string;
  type?: "javascript" | "resource";
  level?: "error" | "warn" | "info";
}
class MonitoringSDK {
  private endpoint: string;
  private originalConsoleError: (...args: any[]) => void;
  private pvApi: string;
  private domain?: string;

  constructor(options: Options) {
    const { domain } = options;
    this.domain = domain;
    this.endpoint = `${this.domain}/api/report`;
    this.pvApi = `${this.domain}/api/pv`;
    this.originalConsoleError = console.error; // 保存原始的 console.error 方法
    this.init();
  }
  public report(options: ReportOptions) {
    const { message, type = "javascript", level='error' } = options;
    const poyload = {
      message,
      stack: "",
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      type: type,
      level
    };
    postData(this.endpoint, poyload);
  }
  private init() {
    window.addEventListener("error", this.handleErrorEvent.bind(this));
    window.addEventListener("error", this.handleErrorResource.bind(this), true);
    window.addEventListener(
      "unhandledrejection",
      this.handlePromiseRejection.bind(this)
    );
    this.overrideConsoleError(); // 重写 console.error
    this.handlePv();
    this.handleUv();
  }
  private handleUv() {
    document.addEventListener("DOMContentLoaded", () => {
      recordDailyVisit({ api: `${this.domain}/api/user-view/record` });
    });
    // 监听popstate事件
    window.addEventListener("popstate", (e) => {
      recordDailyVisit({ api: `${this.domain}/api/user-view/record` });
    });
    window.addEventListener("hashchange", () => {
      recordDailyVisit({ api: `${this.domain}/api/user-view/record` });
    });
  }
  private handlePv() {
    document.addEventListener(
      "DOMContentLoaded",
      this.trackPageView.bind(this)
    );
    // 监听popstate事件
    window.addEventListener("popstate", (e) => {
      this.trackPageView();
    });
    window.addEventListener("hashchange", () => {
      this.trackPageView();
    });
    (function (history) {
      const pushState = history.pushState;
      const replaceState = history.replaceState;

      history.pushState = function (...args: any) {
        const result = pushState.apply(history, args);
        window.dispatchEvent(new Event("popstate"));
        return result;
      };

      history.replaceState = function (...args: any) {
        const result = replaceState.apply(history, args);
        window.dispatchEvent(new Event("popstate"));
        return result;
      };
    })(window.history);
  }

  private async handleErrorEvent(event: any) {
    let errorReport: ErrorReport;
    if (
      event.target instanceof HTMLImageElement ||
      event.target instanceof HTMLScriptElement ||
      event.target instanceof HTMLLinkElement
    ) {
      // 处理静态资源加载错误
      errorReport = {
        message: `Failed to load resource: ${event.target.tagName.toLowerCase()} at ${
          event.target?.src || event.target?.href
        }`,
        stack: "",
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        type: "resource(静态资源)",
      };
    } else {
      // 处理JavaScript错误
      errorReport = {
        message: event.message,
        stack: event.error?.stack || "",
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        type: "javascript",
      };
    }
    await this.reportError(errorReport);
  }

  private async handlePromiseRejection(event: PromiseRejectionEvent) {
    const errorReport: ErrorReport = {
      message: event.reason?.message || "Unhandled Rejection",
      stack: event.reason?.stack || "",
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      type: "javascript",
    };
    await this.reportError(errorReport);
  }
  private overrideConsoleError() {
    console.error = (...args: any[]) => {
      const message = args
        .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)))
        .join(" ");
      // 检查消息内容，过滤掉包含 "Warning" 的信息
      if (/warning/i.test(message)) {
        // 直接调用原始的 console.error 方法，不上报此类警告
        this.originalConsoleError.apply(console, args);
        return;
      }
      const errorReport: ErrorReport = {
        message: message,
        stack: "", // console.error 通常不会有 stack trace
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        type: "javascript",
      };

      // 异步上报错误信息，确保不会阻塞 console.error 的执行
      this.reportError(errorReport).catch((err) => {
        // 上报失败时，仍然调用原始的 console.error 方法
        this.originalConsoleError("Failed to report error:", err);
      });
      // 调用原始的 console.error 方法
      this.originalConsoleError.apply(console, args);
    };
  }
  private async handleErrorResource(event: any) {
    if (
      event.target instanceof HTMLScriptElement ||
      event.target instanceof HTMLLinkElement ||
      event.target instanceof HTMLImageElement
    ) {
      const errorReport: ErrorReport = {
        message: `Failed to load resource: ${event?.target?.tagName.toLowerCase()} from ${
          event?.target?.src || event?.target?.href
        }`,
        stack: event.error?.stack || "",
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        type: "resource(静态资源)",
      };
      await this.reportError(errorReport);
    }
  }
  // pv上报，包含lcp、fcp
  private trackPageView() {
    let url = "";
    const pWin: any = window;
    if (pWin.location.hash) {
      url = `${window.location.origin}${window.location.pathname}${window.location.hash}`;
    } else {
      url = `${window.location.origin}${window.location.pathname}`;
    }

    let lcp: number, fcp: number; // 初始化 LCP 和 FCP
    // 创建一个 PerformanceObserver 实例
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      for (const entry of entries) {
        if (
          entry.entryType === "paint" &&
          entry.name === "first-contentful-paint"
        ) {
          fcp = entry.startTime;
        } else if (entry.entryType === "largest-contentful-paint") {
          lcp = entry.startTime;
        }
      }
    });

    // 开始监听 FCP 和 LCP
    observer.observe({ type: "paint", buffered: true });
    observer.observe({ type: "largest-contentful-paint", buffered: true });
    setTimeout(() => {
      const loadTime =
      window.performance.timing.loadEventEnd -
      window.performance.timing.navigationStart;
      const pageViewReport = {
        type: "pageview",
        message: "Page viewed",
        stack: "",
        loadTime: parseInt(String(loadTime)),
        lcp: parseInt(String(lcp)),
        fcp: parseInt(String(fcp)),
        url,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      };
      // 上报PV信息
      this.reportPageView(pageViewReport);
    }, 2000);
  }

  private async reportPageView(pageViewReport: any) {
    try {
      await postData(this.pvApi, pageViewReport);
    } catch (error) {
      // console.error("Failed to report page view:", error);
    }
  }
  private async reportError(errorReport: ErrorReport) {
    try {
      if(!errorReport.level){
        errorReport.level = 'error'
      }
      await postData(this.endpoint, errorReport);
    } catch (error) {
      // console.error("Failed to report error:", error);
    }
  }
}

export default MonitoringSDK;
