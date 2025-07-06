import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@services/apiService";
import { IApiEnumItem } from "@models/api/IApiEnumItem";
import { OWNERS_QUERY_KEY } from "./useOwners";

export const PET_TYPES_QUERY_KEY = "petTypes";

export function usePetTypes() {
  return useQuery({
    queryKey: [PET_TYPES_QUERY_KEY],
    queryFn: () => apiService.getList<IApiEnumItem>("pettypes")
  });
}

export function usePet(ownerId: number, petId: number | undefined) {
  return useQuery({
    queryKey: ["pets", ownerId, petId],
    queryFn: () => apiService.getPet(ownerId, petId!),
    enabled: !!petId && !!ownerId
  });
}

export function useCreatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ownerId, data }: { ownerId: number; data: any }) => apiService.createPet(ownerId, data),
    onSuccess: (_, { ownerId }) => {
      queryClient.invalidateQueries({ queryKey: [OWNERS_QUERY_KEY, ownerId] });
    }
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ownerId, petId, data }: { ownerId: number; petId: number; data: any }) =>
      apiService.updatePet(ownerId, petId, data),
    onSuccess: (_, { ownerId, petId }) => {
      queryClient.invalidateQueries({ queryKey: [OWNERS_QUERY_KEY, ownerId] });
      queryClient.invalidateQueries({ queryKey: ["pets", ownerId, petId] });
    }
  });
}
