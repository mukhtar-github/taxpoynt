import loadMonoSDK from "./loadMonoSDK";

const monoConnect = async (
  onSuccess: (response: MonoSuccessResponse) => void,
  onClose: () => void
): Promise<void> => {
  try {
    await loadMonoSDK();
    const connect = new (window as any).Connect({
      key: process.env.NEXT_PUBLIC_MONO_PUBLIC_KEY,
      onSuccess,
      onClose
    });

    connect.setup();
  } catch (error) {
    console.error('Error initializing Mono SDK:', error);
  }
};

export default monoConnect;
