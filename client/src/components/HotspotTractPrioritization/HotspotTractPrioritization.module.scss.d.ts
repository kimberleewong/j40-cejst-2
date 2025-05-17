declare namespace TractPrioritizationNamespace {
    export interface ITractPrioritizationScss {
      invert: string;
      invertRed: string;
      invertBlue: string;
    }
  }

declare const TractPrioritizationScssModule: TractPrioritizationNamespace.ITractPrioritizationScss & {
    /** WARNING: Only available when "css-loader" is used without "style-loader" or "mini-css-extract-plugin" */
    locals: TractPrioritizationNamespace.ITractPrioritizationScss;
  };

  export = TractPrioritizationScssModule;
