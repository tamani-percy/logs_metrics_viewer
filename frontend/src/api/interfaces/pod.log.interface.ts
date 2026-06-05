export interface PodLog {
    id: number,
    timestamp: string,
    namespace: string,
    podName: string,
    containerName: string,
    logLevel: LogLevel,
    message: string
}

export interface LogLevel{
    id:number,
    logLevel:string
}

export interface PodLogNamespacePodContainerRangeRequest {
    namespace: string,
    podName: string,
    containerName: string,
    startTime: string,
    endTime: string
}

export interface LogLevelCount {
    level: string,
    count: number
}