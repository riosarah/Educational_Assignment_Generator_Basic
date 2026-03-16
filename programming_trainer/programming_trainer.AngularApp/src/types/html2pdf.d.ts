declare module 'html2pdf.js' {
  const html2pdf: {
    (): {
      from: (source: HTMLElement | string) => {
        save: () => void;
      };
      set: (options: Record<string, unknown>) => {
        from: (source: HTMLElement | string) => {
          save: () => void;
        };
      };
    };
  };

  export default html2pdf;
}
