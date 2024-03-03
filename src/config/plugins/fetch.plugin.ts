export interface ApiResponse<T> {
  data: T;
}

export const httpClientPlugin = {

  get: async <T>(url: string): Promise<T> => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch data, status: ${response.status}`);
      }

      const apiResponse: ApiResponse<T> = {
        data: await response.json(),
      };
      return apiResponse.data;
    } catch (error) {
      // Maneja los errores según sea necesario
      console.error('Error in GET request:', error);
      throw error;
    }
  },
};