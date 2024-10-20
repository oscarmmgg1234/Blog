export class API {
  constructor() {
    this.baseUrl = "http://13.64.149.30:3000";
  }
  async getBlogEntries() {
    const response = await fetch(`${this.baseUrl}/entries`);
    return await response.json();
  }
  async getBlogEntry(id) {
    const response = await fetch(`${this.baseUrl}/entry/${id}`);
    return await response.json();
  }
  async pushComment(id, comment) {}
  async pushNewEntry(entry) {
    //used for custom ui regarding pushing a blog entry
  }
}
