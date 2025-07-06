import HTTPMethod from "http-method-enum";

const apiUrl = import.meta.env.VITE_SPRING_PETCLINIC_REST_API_URL;

export interface ApiResponse<T> {
  data: T;
  total?: number;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${apiUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      },
      ...options
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Generic CRUD operations
  async getList<T>(resource: string, params?: { filter?: any }): Promise<ApiResponse<T[]>> {
    let endpoint = `/${resource}`;

    if (params?.filter) {
      const searchParams = new URLSearchParams();
      Object.entries(params.filter).forEach(([key, value]) => {
        if (value) searchParams.append(key, String(value));
      });
      if (searchParams.toString()) {
        endpoint += `?${searchParams.toString()}`;
      }
    }

    const data = await this.request<T[]>(endpoint);
    return {
      data,
      total: data.length
    };
  }

  async getOne<T>(resource: string, id: number): Promise<T> {
    return this.request<T>(`/${resource}/${id}`);
  }

  async create<T>(resource: string, data: any): Promise<T> {
    return this.request<T>(`/${resource}`, {
      method: HTTPMethod.POST,
      body: JSON.stringify(data)
    });
  }

  async update<T>(resource: string, id: number, data: any): Promise<T> {
    await this.request(`/${resource}/${id}`, {
      method: HTTPMethod.PUT,
      body: JSON.stringify(data)
    });
    return { id, ...data } as T;
  }

  async delete(resource: string, id: number): Promise<void> {
    await this.request(`/${resource}/${id}`, {
      method: HTTPMethod.DELETE
    });
  }

  // Pet-specific operations
  async createPet(ownerId: number, petData: any): Promise<any> {
    return this.request(`/owners/${ownerId}/pets`, {
      method: HTTPMethod.POST,
      body: JSON.stringify(petData)
    });
  }

  async getPet(ownerId: number, petId: number): Promise<any> {
    return this.request(`/owners/${ownerId}/pets/${petId}`);
  }

  async updatePet(ownerId: number, petId: number, petData: any): Promise<any> {
    return this.request(`/owners/${ownerId}/pets/${petId}`, {
      method: HTTPMethod.PUT,
      body: JSON.stringify(petData)
    });
  }
}

export const apiService = new ApiService();
