import { useQuery } from "@tanstack/react-query";
import { apiService } from "@services/apiService";
import { IApiVeterinarian } from "@models/api/IApiVeterinarian";

export const VETERINARIANS_QUERY_KEY = "veterinarians";

export function useVeterinarians() {
  return useQuery({
    queryKey: [VETERINARIANS_QUERY_KEY],
    queryFn: () => apiService.getList<IApiVeterinarian>("vets")
  });
}
