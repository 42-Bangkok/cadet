export function checkServiceToken(request: Request) {
  const authHeader = request.headers.get("Authorization");

  if (authHeader === `Bearer ${process.env.SERVICE_TOKEN}`) {
    return true;
  }

  return false;
}
