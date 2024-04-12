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
  return String.fromCharCode.apply(
    null,
    new Uint8Array(buf) as unknown as number[]
  );
};

const str2ab = (str: string): ArrayBuffer => {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++)
    bufView[i] = str.charCodeAt(i);
  return buf;
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

export const getPrivateKeyFromFile = async (
  file: string
): Promise<CryptoKey> => {
  const pemHeader = '-----BEGIN PRIVATE KEY-----';
  const pemFooter = '-----END PRIVATE KEY-----';
  const pemContents = file.substring(
    pemHeader.length,
    file.length - pemFooter.length - 1
  );

  const binaryDerString = window.atob(pemContents);

  const binaryDer = str2ab(binaryDerString);

  return window.crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['decrypt']
  );
};
