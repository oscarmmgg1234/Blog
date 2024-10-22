import axios from "axios";

export class API {
  constructor() {
    this.baseUrl = "https://oscarblogs.com";
  }
  //"http://13.64.149.30:3000";
  async getBlogEntries() {
    const response = await fetch(`${this.baseUrl}/entries`);
    return await response.json();
  }
  async getBlogEntry(id) {
    const response = await fetch(`${this.baseUrl}/entry/${id}`);
    return await response.json();
  }
  async pushComment(id, comment) {}
  async pushNewEntry(formData, onUploadProgress) {
    try {
      const response = await axios.post(`${this.baseUrl}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable && onUploadProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onUploadProgress(percentCompleted);
          }
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async verifyAdminKey(key) {
    try {
      const response = await axios.post(`${this.baseUrl}/verify`, {
        pass: key,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
