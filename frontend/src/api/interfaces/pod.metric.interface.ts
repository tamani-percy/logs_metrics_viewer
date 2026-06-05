export interface PodMetric {
    id: number,
    timestamp: string,
    namespace: string,
    podName: string,
    cpuUsageCores: number,
    memoryUsageBytes: number,
    requestCount: number,
    errorCount: number
}

export interface PodMetricNamespacePodRangeRequest {
    namespace: string,
    podName: string,
    startTime: string,
    endTime: string
}