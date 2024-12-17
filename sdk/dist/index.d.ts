declare class MonitoringSDK {
    private endpoint;
    constructor(endpoint: string, token: string);
    private init;
    private handleErrorEvent;
    private handlePromiseRejection;
    private reportError;
}
export default MonitoringSDK;
