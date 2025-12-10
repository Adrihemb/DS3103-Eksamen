import axios, { AxiosResponse } from "axios";

// Define the expected server response type
export interface IImageUploadResponse {
  fileName: string;
}

const ImageUploadService = (() => {
  const BASE_URL = "http://localhost:5189/api";

  // Uploads an image file to the backend
  const uploadImage = async (
    image: File,
    folder: string = "venues"
  ): Promise<AxiosResponse<IImageUploadResponse>> => {
    const formData = new FormData();
    formData.append("file", image);

    try {
      const result = await axios.post<IImageUploadResponse>(
        `${BASE_URL}/UploadImage?folder=${folder}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return result;
    } finally {
      // Clean up the FormData to avoid holding large files in memory
      formData.delete("file");
    }
  };

  return {
    uploadImage,
  };
})();

export default ImageUploadService;
