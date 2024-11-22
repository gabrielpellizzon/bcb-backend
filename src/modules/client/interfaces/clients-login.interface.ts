export interface ClientPayload {
  sub: string;
  name: string;
  email: string;
}

export interface ClientResponse {
  access_token: string;
}
