declare namespace IncomeSliderNamespace {
    export interface IIncomeSliderModuleScss {
      incomeSliderContainer: string;
      noMarginTop: string;
      label: string;
    }
  }
  
  declare const IncomeSliderModuleScssModule: IncomeSliderNamespace.IIncomeSliderModuleScss & {
    /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
    locals: IncomeSliderNamespace.IIncomeSliderModuleScss;
  };
  
  export = IncomeSliderModuleScssModule;