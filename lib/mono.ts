import Connect from "@mono.co/connect.js";

const monoConnect = (
  onSuccess: (response: MonoSuccessResponse) => void,
  onClose: () => void
) => {
  const connect = new Connect({
    key: process.env.MONO_PUBLIC_KEY,
    onSuccess,
    onClose
  });

  connect.setup();
  return connect;
};

export default monoConnect;
