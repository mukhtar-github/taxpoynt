// Import necessary modules or dependencies
import Connect from "@mono.co/connect.js";


// Define a type for the response you expect from the onSuccess callback
interface MonoSuccessResponse {
    code: string; // Example property, adjust based on actual data
}

// Define the function with explicit types
const monoConnect = (
  onSuccess: (response: MonoSuccessResponse) => void,
  onClose: () => void
) => {
  const connect = new Connect({
    key: process.env.MONO_SECRET_KEY,
    onSuccess,
    onClose
  });

  connect.setup();
  return connect;
};

export default monoConnect;

