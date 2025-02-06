import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import services from '../../services/backend/index.js';

export function useUAV() {
    const queryClient = useQueryClient();

    const templateUAVs = useQuery({
        queryKey: services.uav.fetchAllUAVs.queryKey,
        queryFn: services.uav.fetchAllUAVs.queryFn,
    });

    const uavJson = useQuery({
        queryKey: services.uav.fetchAllUAVsJson.queryKey,
        queryFn: services.uav.fetchAllUAVsJson.queryFn,
    });

    const patchUAVs = useMutation({
        mutationKey: services.uav.patchUAVs.mutationKey,
        mutationFn: services.uav.patchUAVs.mutationFn,
        onSuccess: services.uav.invalidateQueries(queryClient),
    });

    const updateUAVJson = useMutation({
        mutationKey: services.uav.postAllUAVsJson.mutationKey,
        mutationFn: services.uav.postAllUAVsJson.mutationFn,
        onSuccess: services.uav.invalidateQueries(queryClient),
    });

    const removeUAVTemplate = useMutation({
        mutationKey: services.uav.removeUAVTemplate.mutationKey,
        mutationFn: services.uav.removeUAVTemplate.mutationFn,
        onSuccess: services.uav.invalidateQueries(queryClient),
    });

    const createUAVTemplate = useMutation({
        mutationKey: services.uav.createUAVTemplate.mutationKey,
        mutationFn: services.uav.createUAVTemplate.mutationFn,
        onSuccess: services.uav.invalidateQueries(queryClient),
    });

    const updateUAVTemplate = useMutation({
        mutationKey: services.uav.updateUAVTemplate.mutationKey,
        mutationFn: services.uav.updateUAVTemplate.mutationFn,
        onSuccess: services.uav.invalidateQueries(queryClient),
    });

    return {
        templateUAVs,
        uavJson,
        patchUAVs,
        updateUAVJson,
        removeUAVTemplate,
        createUAVTemplate,
        updateUAVTemplate,
    };
} 