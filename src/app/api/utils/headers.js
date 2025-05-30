export async function bearerHeader(authHeader, clientIps, env){
  // Extract token from Bearer format
  let token = null;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7); // Remove "Bearer " prefix
  };
  
  const ip = clientIps[0];

  // If the token is missing, return a 400 Bad Request response
  if (!token) throw new Error("Unauthorized");

  // Create a FormData object with required data for Cloudflare Turnstile verification
  let formData = new FormData();
  formData.append("secret", env.SECRET_KEY || ""); // Private key
  formData.append("response", token); // User-provided token
  formData.append("remoteip", ip); // User"s IP address

  // Cloudflare Turnstile verification API endpoint
  const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

  // Send a request to Cloudflare Turnstile API
  const result = await fetch(url, {
    body: formData,
    method: "POST"
  });

  // Check if the response status is not 200
  if (result.status !== 200) {
    throw new Error(`API request failed with status: ${result.status}`);
  };

  // Parse the API response as JSON
  const response = await result.json();
  console.log(response); // Debugging the response
};