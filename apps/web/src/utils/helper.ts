export const debounce = <T extends any[]>(
  cb: (...args: T) => void,
  delay: number = 1000,
) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: T) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      cb(...args); // or ```cb.apply(this, args)``` for better context handling
    }, delay);
  };
};

export const getClientCookie = (name: string): string | undefined => {
  if (typeof window === "undefined") return undefined; // Guard for SSR phase

  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
};
