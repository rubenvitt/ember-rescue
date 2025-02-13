import { UAVApi, UAVMissionsApi } from '@bluelight-hub/shared/client/apis';
import { CreateUAVMissionDto, FlightProtocolDto, FlightProtocolResponse, ImportManyUAVsDto, PostFlightChecksDto, PreFlightChecksDto, UAVMissionResponse, UAVTemplateDto } from '@bluelight-hub/shared/client/index.js';
import { QueryClient } from '@tanstack/react-query';
import { getAPIConfig } from '../../utils/http.ts';
import { createInvalidateQueries } from '../../utils/queries.js';

export const queryKey = 'uav-templates';
export const missionQueryKey = 'uav-missions';

export const invalidateQueries = (queryClient: QueryClient) => createInvalidateQueries([queryKey, missionQueryKey], queryClient);

const templateApi = new UAVApi(getAPIConfig());
const missionApi = new UAVMissionsApi(getAPIConfig());

// Template API Endpoints
export const fetchAllUAVs = {
    queryKey: [queryKey],
    queryFn: async () => {
        return templateApi.uAVControllerFindAllV1();
    }
};

export const fetchAllUAVsJson = {
    queryKey: [queryKey, 'json'],
    queryFn: async () => {
        const response = await templateApi.uAVControllerFindAllV1();
        return JSON.stringify(response.data, undefined, 2);
    },
};

export const patchUAVs = {
    mutationKey: [queryKey],
    mutationFn: async (data: ImportManyUAVsDto) => {
        return templateApi.uAVControllerUpdateManyV1({ importManyUAVsDto: data });
    }
};

export const postAllUAVsJson = {
    mutationKey: [queryKey],
    mutationFn: async (data: ImportManyUAVsDto) => {
        return templateApi.uAVControllerImportUAVsV1({ importManyUAVsDto: data });
    }
};

export const removeUAVTemplate = {
    mutationKey: [queryKey, 'remove'],
    mutationFn: async (uavId: string) => {
        return templateApi.uAVControllerDeleteUAVV1({ uavId });
    }
};

export const createUAVTemplate = {
    mutationKey: [queryKey, 'create'],
    mutationFn: async (data: Omit<UAVTemplateDto, 'id'>) => {
        return templateApi.uAVControllerUpdateManyV1({ importManyUAVsDto: { items: [data] } });
    }
};

export const updateUAVTemplate = {
    mutationKey: [queryKey, 'update'],
    mutationFn: async (data: UAVTemplateDto) => {
        return templateApi.uAVControllerUpdateManyV1({ importManyUAVsDto: { items: [data] } });
    }
};

// UAV Mission API Endpoints
export const fetchUAVMissions = {
    queryKey: ({ missionId }: { missionId: string | null }) => [missionQueryKey, missionId],
    queryFn: ({ missionId }: { missionId: string | null }) =>
        async () => {
            if (!missionId) {
                throw new Error('Kein Einsatz ausgewählt. Bitte wählen Sie zuerst einen Einsatz aus.');
            }
            try {
                return missionApi.uAVMissionControllerGetAllUAVMissionsV1({ einsatzId: missionId });
            } catch (error) {
                throw error;
            }
        }
};

export const addUAVToEinsatz = {
    mutationKey: ({ missionId }: { missionId: unknown }) => [missionQueryKey, missionId, 'add'],
    mutationFn: ({ missionId }: { missionId: string | null }) =>
        async (dto: CreateUAVMissionDto) => {
            if (!missionId) {
                throw new Error('Kein Einsatz ausgewählt. Bitte wählen Sie zuerst einen Einsatz aus.');
            }
            return missionApi.uAVMissionControllerAddUAVToEinsatzV1({
                einsatzId: missionId,
                createUAVMissionDto: { uavId: dto.uavId, einsatzId: missionId }
            }) as Promise<UAVMissionResponse>;
        }
};

export const submitPreFlightChecks = {
    mutationKey: ({ missionId, uavIndex }: { missionId: unknown, uavIndex: unknown }) => [missionQueryKey, missionId, uavIndex, 'pre-flight'],
    mutationFn: ({ missionId, uavIndex }: { missionId: string, uavIndex: number }) =>
        async (data: PreFlightChecksDto) => {
            return missionApi.uAVMissionControllerSubmitPreFlightChecksV1({
                einsatzId: missionId,
                uavIndex,
                preFlightChecksDto: data
            }) as Promise<UAVMissionResponse>;
        }
};

export const addFlightProtocol = {
    mutationKey: ({ missionId, uavIndex }: { missionId: unknown, uavIndex: unknown }) => [missionQueryKey, missionId, uavIndex, 'flight'],
    mutationFn: ({ missionId, uavIndex }: { missionId: string, uavIndex: number }) =>
        async (data: FlightProtocolDto) => {
            return missionApi.uAVMissionControllerAddFlightProtocolV1({
                einsatzId: missionId,
                uavIndex,
                flightProtocolDto: data
            }) as Promise<FlightProtocolResponse>;
        }
};

export const submitPostFlightChecks = {
    mutationKey: ({ missionId, uavIndex }: { missionId: unknown, uavIndex: unknown }) => [missionQueryKey, missionId, uavIndex, 'post-flight'],
    mutationFn: ({ missionId, uavIndex }: { missionId: string, uavIndex: number }) =>
        async (data: PostFlightChecksDto) => {
            return missionApi.uAVMissionControllerSubmitPostFlightChecksV1({
                einsatzId: missionId,
                uavIndex,
                postFlightChecksDto: data
            }) as Promise<UAVMissionResponse>;
        }
}; 