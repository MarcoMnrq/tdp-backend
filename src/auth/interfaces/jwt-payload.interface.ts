// Create interfaces for JWT payloads
export interface JwtPayload {
  id: number;
  userId: number;
  email: string;
  role: string;
  exp: number;
  iat: number;
}
