import { CreateUAVMissionDto, FlightProtocolDto, FlightProtocolResponse, PostFlightChecksDto, PreFlightChecksDto, UAVMissionResponse, UAVMissionsResponse } from '@bluelight-hub/shared/client/index.js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '../../services/index.js';
import { useEinsatz } from '../einsatz.hook.js';

export function useUAV(props?: { uavIndex?: number }) {
    const queryClient = useQueryClient();
    const { missionId } = useEinsatz();
    const uavIndex = props?.uavIndex ?? 0;

    const uavMissions = useQuery<UAVMissionsResponse>({
        queryKey: services.backend.uav.fetchUAVMissions.queryKey({ missionId }),
        queryFn: services.backend.uav.fetchUAVMissions.queryFn({ missionId }),
        enabled: !!missionId,
    });

    const templateUAVs = useQuery({
        queryKey: services.backend.uav.fetchAllUAVs.queryKey,
        queryFn: services.backend.uav.fetchAllUAVs.queryFn,
    });

    const addUAVToEinsatz = useMutation<UAVMissionResponse, unknown, CreateUAVMissionDto>({
        mutationKey: services.backend.uav.addUAVToEinsatz.mutationKey({ missionId }),
        mutationFn: (data: CreateUAVMissionDto) => {
            if (!missionId) {
                throw new Error('Kein Einsatz ausgewählt');
            }
            return services.backend.uav.addUAVToEinsatz.mutationFn({ missionId })(data);
        },
        onSuccess: services.backend.uav.invalidateQueries(queryClient),
    });

    const submitPreFlightChecks = useMutation<UAVMissionResponse, unknown, { data: PreFlightChecksDto; uavIndex: number }>({
        mutationKey: services.backend.uav.submitPreFlightChecks.mutationKey({ missionId, uavIndex }),
        mutationFn: ({ data, uavIndex }) => {
            if (!missionId) {
                throw new Error('Kein Einsatz ausgewählt');
            }
            return services.backend.uav.submitPreFlightChecks.mutationFn({ missionId, uavIndex })(data);
        },
        onSuccess: services.backend.uav.invalidateQueries(queryClient),
    });

    const addFlightProtocol = useMutation<FlightProtocolResponse, unknown, { data: FlightProtocolDto; uavIndex: number }>({
        mutationKey: services.backend.uav.addFlightProtocol.mutationKey({ missionId, uavIndex }),
        mutationFn: ({ data, uavIndex }) => {
            if (!missionId) {
                throw new Error('Kein Einsatz ausgewählt');
            }
            return services.backend.uav.addFlightProtocol.mutationFn({ missionId, uavIndex })(data);
        },
        onSuccess: services.backend.uav.invalidateQueries(queryClient),
    });

    const submitPostFlightChecks = useMutation<UAVMissionResponse, unknown, { data: PostFlightChecksDto; uavIndex: number }>({
        mutationKey: services.backend.uav.submitPostFlightChecks.mutationKey({ missionId, uavIndex }),
        mutationFn: ({ data, uavIndex }) => {
            if (!missionId) {
                throw new Error('Kein Einsatz ausgewählt');
            }
            return services.backend.uav.submitPostFlightChecks.mutationFn({ missionId, uavIndex })(data);
        },
        onSuccess: services.backend.uav.invalidateQueries(queryClient),
    });

    return {
        uavMissions,
        templateUAVs,
        addUAVToEinsatz,
        submitPreFlightChecks,
        addFlightProtocol,
        submitPostFlightChecks,
    };
} 