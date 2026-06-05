import type {
    LogLevelCount,
    PodLog,
    PodLogNamespacePodContainerRangeRequest
} from "@/api/interfaces/pod.log.interface.ts";
import type {AxiosResponse} from "axios";
import axiosInstance from "@/api/axiosInstance/axiosInstance.ts";

export const getByNamespacePodContainerAndTimeRange = async (podLogNamespacePodContainerRangeRequest: PodLogNamespacePodContainerRangeRequest): Promise<PodLog[]> => {
    const response: AxiosResponse<PodLog[]> = await axiosInstance.post("logs/namespace-pod-container-range", podLogNamespacePodContainerRangeRequest)
    return response.data
}

export const getAllLogs = async (): Promise<PodLog[]> => {
    const response: AxiosResponse<PodLog[]> = await axiosInstance.get("logs")
    return response.data
}

export const getPodLogById = async (id: number): Promise<PodLog> => {
    const response: AxiosResponse<PodLog> = await axiosInstance.get(`logs/${id}`)
    return response.data
}

export const getAllUniqueNamespaces = async (): Promise<string[]> => {
    const response: AxiosResponse<string[]> = await axiosInstance.get("logs/namespaces")
    return response.data
}

export const getAllUniqueContainerNames = async (): Promise<string[]> => {
    const response: AxiosResponse<string[]> = await axiosInstance.get("logs/containers")
    return response.data
}

// STATS
export const countGroupedByLogLevel = async (): Promise<LogLevelCount[]> => {
    const response: AxiosResponse<LogLevelCount[]> = await axiosInstance.get("logs/count-grouped-by-level")
    return response.data
}

export const countByLogLevel = async (logLevel: string): Promise<number> => {
    const response: AxiosResponse<number> = await axiosInstance.get(`logs/count-by-log-level?logLevel=${logLevel}`)
    return response.data
}