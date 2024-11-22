export interface ClientPayload {
  sub: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface ClientResponse {
  access_token: string;
}
