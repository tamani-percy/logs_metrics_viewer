import type {PodMetric, PodMetricNamespacePodRangeRequest} from "@/api/interfaces/pod.metric.interface.ts";
import type {AxiosResponse} from "axios"
import axiosInstance from "@/api/axiosInstance/axiosInstance.ts";

export const getByNamespacePodAndTimeRange = async (podMetricNamespacePodRangeRequest: PodMetricNamespacePodRangeRequest): Promise<PodMetric[]> => {
    const response: AxiosResponse<PodMetric[]> = await axiosInstance.post("metrics/namespace-pod-range", podMetricNamespacePodRangeRequest)
    return response.data
}

export const getAllUniquePodNames = async (): Promise<string[]> => {
    const response: AxiosResponse<string[]> = await axiosInstance.get("metrics/pods")
    return response.data
}

export const getMetricById = async (id: number): Promise<PodMetric> => {
    const response: AxiosResponse<PodMetric> = await axiosInstance.get(`metrics/${id}`)
    return response.data
}

export const getAllMetrics = async (id: number): Promise<PodMetric[]> => {
    const response: AxiosResponse<PodMetric[]> = await axiosInstance.get(`metrics`)
    return response.data
}

// STATS
export const getAverageCpuByPod = async (podName: string): Promise<number> => {
    const response: AxiosResponse<number> = await axiosInstance.get(`metrics/avg-cpu-by-pod?podName=${podName}`)
    return response.data
}

export const getAverageMemoryByPod = async (podName: string): Promise<number> => {
    const response: AxiosResponse<number> = await axiosInstance.get(`metrics/avg-memory-by-pod?podName=${podName}`)
    return response.data
}

export const totalRequestsByPod = async (podName: string): Promise<number> => {
    const response: AxiosResponse<number> = await axiosInstance.get(`metrics/total-requests-by-pod?podName=${podName}`)
    return response.data
}

export const totalErrorsByNamespace = async (namespace: string): Promise<number> => {
    const response: AxiosResponse<number> = await axiosInstance.get(`metrics/total-errors-by-namespace?namespace=${namespace}`)
    return response.data
}

export const findCpuSpikes = async (threshold: number, since: string): Promise<PodMetric[]> => {
    const response: AxiosResponse<PodMetric[]> = await axiosInstance.get(`metrics/cpu-spikes?threshold=${threshold}&since=${since}`)
    return response.data
}