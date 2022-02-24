import axios from "axios";
import { HTTPError } from "../errors";

export function postRequest<
  Q = Record<string, unknown>,
  T = Record<string, unknown>
>(url: string, headers: Record<string, string>): (data: T) => Promise<Q> {
  const post = async (data: T) => {
    const response = await axios({
      url,
      headers: {
        ...headers,
        "Content-Type": "application/json"
      },
      method: "post",
      data
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }

    throw new HTTPError(response.statusText, response.status);
  };

  return post;
}

export function getRequest<T>(
  url: string,
  headers: Record<string, string>
): () => Promise<T> {
  const get = async () => {
    const response = await axios({
      url,
      headers,
      method: "get"
    });

    if (response.status === 200) {
      return response.data;
    }

    throw new HTTPError(response.statusText, response.status);
  };

  return get;
}
