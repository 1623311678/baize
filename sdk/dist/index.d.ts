interface Options {
    domain: string;
    token?: string;
}
interface ReportOptions {
    message: string;
    type?: "javascript" | "resource";
    level?: "error" | "warn" | "info";
}
declare class MonitoringSDK {
    private endpoint;
    private originalConsoleError;
    private pvApi;
    private domain?;
    constructor(options: Options);
    report(options: ReportOptions): void;
    private init;
    private handleUv;
    private handlePv;
    private handleErrorEvent;
    private handlePromiseRejection;
    private overrideConsoleError;
    private handleErrorResource;
    private trackPageView;
    private reportPageView;
    private reportError;
}
export default MonitoringSDK;
