export class API {
  constructor() {
    this.baseUrl = "http://13.64.149.30:3000";
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
  async pushNewEntry(formData) {
    try {
      const response = await fetch(`${this.baseUrl}/upload`, {
        method: "POST",
        body: formData,
      });
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}
