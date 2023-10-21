const defaultHeaders = new Headers();
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function performRequest(
  url: string,
  method: string = "get",
  body?: BodyInit,
  headers?: Headers
) {
  let path = new URL(url, baseUrl);
  let res = await fetch(path, {
    method,
    headers: { ...defaultHeaders, ...headers },
    ...(body && { body }),
  });

  let data = await res.json();

  return data;
}
