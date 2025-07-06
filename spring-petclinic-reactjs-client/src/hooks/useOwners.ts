import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@services/apiService";
import { IApiOwner } from "@models/api/IApiOwner";
import { OwnerFormSchema } from "@models/form/OwnerFormSchema";

export const OWNERS_QUERY_KEY = "owners";

export function useOwners(filter?: { lastName?: string }) {
  return useQuery({
    queryKey: [OWNERS_QUERY_KEY, filter],
    queryFn: () => apiService.getList<IApiOwner>("owners", { filter }),
    enabled: true
  });
}

export function useOwner(id: number | undefined) {
  return useQuery({
    queryKey: [OWNERS_QUERY_KEY, id],
    queryFn: () => apiService.getOne<IApiOwner>("owners", id!),
    enabled: !!id
  });
}

export function useCreateOwner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OwnerFormSchema) => apiService.create<IApiOwner>("owners", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OWNERS_QUERY_KEY] });
    }
  });
}

export function useUpdateOwner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: OwnerFormSchema }) =>
      apiService.update<IApiOwner>("owners", id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [OWNERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [OWNERS_QUERY_KEY, id] });
    }
  });
}

export function useDeleteOwner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiService.delete("owners", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OWNERS_QUERY_KEY] });
    }
  });
}
