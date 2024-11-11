declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare var module: {
  hot?: {
    accept(path?: string, callback?: () => void): void;
    dispose(callback: (data?: any) => void): void;
  };
};

declare module '*.jpg' {
  const value: string;
  export default value;
}
