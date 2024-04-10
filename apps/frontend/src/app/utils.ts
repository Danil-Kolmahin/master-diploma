export const generateKeyPair = async (): Promise<CryptoKeyPair> =>
  crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt']
  );

const ab2str = (buf: ArrayBuffer): string => {
  return String.fromCharCode.apply(null, new Uint8Array(buf) as any);
};

export const extractPublicKey = async (
  publicKey: CryptoKey
): Promise<string> => {
  const exportedPublicKey = await window.crypto.subtle.exportKey(
    'spki',
    publicKey
  );
  return `-----BEGIN PUBLIC KEY-----\n${window.btoa(
    ab2str(exportedPublicKey)
  )}\n-----END PUBLIC KEY-----`;
};

export const extractPrivateKey = async (
  privateKey: CryptoKey
): Promise<string> => {
  const exportedPrivateKey = await window.crypto.subtle.exportKey(
    'pkcs8',
    privateKey
  );
  return `-----BEGIN PRIVATE KEY-----\n${window.btoa(
    ab2str(exportedPrivateKey)
  )}\n-----END PRIVATE KEY-----`;
};

export const saveFile = (
  file: string,
  name = 'file.txt',
  type = 'text/plain;charset=utf-8'
): void => {
  const a = document.createElement('a');
  a.download = name;
  a.href = URL.createObjectURL(new Blob([file], { type }));
  a.addEventListener('click', () => {
    setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
  });
  a.click();
};
