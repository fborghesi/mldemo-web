const Base64Utils = {
    blobToBase64(blob: Blob): Promise<string | ArrayBuffer | null> {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onerror = reject;
            reader.onload = (e) => resolve(e?.target?.result as string);
            reader.readAsDataURL(blob);
          });
    },
};

export default Base64Utils;
