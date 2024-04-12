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

export const getTextFromFile = (file: File): Promise<string | never> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () =>
      typeof reader.result === 'string'
        ? resolve(reader.result)
        : reject(reader.result);
    reader.onerror = () => reject(reader.error);

    reader.readAsText(file);
  });
