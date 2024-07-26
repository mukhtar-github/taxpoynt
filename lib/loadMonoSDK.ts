
const loadMonoSDK = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        return reject(new Error('Mono SDK can only be loaded in the client-side environment'));
      }
  
      if ((window as any).Connect) {
        return resolve();
      }
  
      const script = document.createElement('script');
      script.src = "https://sdk.mono.co/connect.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Mono SDK'));
  
      document.body.appendChild(script);
    });
  };
  
  export default loadMonoSDK;
