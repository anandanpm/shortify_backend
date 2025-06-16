export enum HttpStatusCode {
  // Success
  OK = 200,
  CREATED = 201,
  
  // Client Errors
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  
  // Server Errors
  INTERNAL_SERVER_ERROR = 500,
  
  // Redirect
  MOVED_PERMANENTLY = 301
}