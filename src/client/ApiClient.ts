
import axios from "axios";

class ApiClient {
  public async DoRequest(
    method = "GET",
    endpoint: string,
    data = {},
    aditionalHeaders: any = {}
  ) {
    const url = `${this.getBaseUri()}${endpoint}`;
    console.log("url", url);
    const headers: any = {};
    headers["Content-Type"] = "application/json";
    headers.Accept = "application/json";

    for (const idx in aditionalHeaders) {
      headers[idx] = aditionalHeaders[idx];
    }

    const requestConfig: any = {
      method,
      headers,
      crossdomain: true,
      url,
      data,
    };

    const response = await axios(requestConfig);

    return response.data;
  }

  public getBaseUri(): string {
    return "http://185.137.92.41:3000" ?? "";
  }

  public getRestDefaultUri(): string {
    return this.getBaseUri();
  }
}

export default ApiClient;
