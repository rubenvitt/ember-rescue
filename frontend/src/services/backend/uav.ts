import { UAVApi } from '@bluelight-hub/shared/client/apis';
import { ImportManyUAVsDto, UAVTemplateDto } from '@bluelight-hub/shared/client/index.js';
import { QueryClient } from '@tanstack/react-query';
import { getAPIConfig } from '../../utils/http.ts';
import { createInvalidateQueries } from '../../utils/queries.js';

export const queryKey = 'uav-templates';

export const invalidateQueries = (queryClient: QueryClient) => createInvalidateQueries([queryKey], queryClient);

const api = new UAVApi(getAPIConfig());

// API Endpoints
export const fetchAllUAVs = {
    queryKey: [queryKey],
    queryFn: () => api.uAVControllerFindAllV1(),
};

export const fetchAllUAVsJson = {
    queryKey: [queryKey, 'json'],
    queryFn: async () => {
        const response = await api.uAVControllerFindAllV1();
        return JSON.stringify(response.data, undefined, 2);
    },
};

export const patchUAVs = {
    mutationKey: [queryKey],
    mutationFn: (data: ImportManyUAVsDto) =>
        api.uAVControllerUpdateManyV1({ importManyUAVsDto: data })
};

export const postAllUAVsJson = {
    mutationKey: [queryKey],
    mutationFn: (data: ImportManyUAVsDto) =>
        api.uAVControllerImportUAVsV1({ importManyUAVsDto: data })
};

export const removeUAVTemplate = {
    mutationKey: [queryKey, 'remove'],
    mutationFn: (uavId: string) =>
        api.uAVControllerDeleteUAVV1({ uavId })
};

export const createUAVTemplate = {
    mutationKey: [queryKey, 'create'],
    mutationFn: (data: Omit<UAVTemplateDto, 'id'>) =>
        api.uAVControllerUpdateManyV1({ importManyUAVsDto: { items: [data] } })
};

export const updateUAVTemplate = {
    mutationKey: [queryKey, 'update'],
    mutationFn: (data: UAVTemplateDto) =>
        api.uAVControllerUpdateManyV1({ importManyUAVsDto: { items: [data] } })
}; 