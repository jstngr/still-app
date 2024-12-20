declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare let module: {
  hot?: {
    accept(path?: string, callback?: () => void): void;
    dispose(callback: (data?: unknown) => void): void;
  };
};

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.webp' {
  const value: string;
  export default value;
}
