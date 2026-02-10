export type AppTheme = {
    bg: string;
    card: string;
    text: string;
    subText: string;
    border: string;
    inputBg: string;
    mutedBg: string;
    btnBg: string;
    btnText: string;
  };
  
  export const lightTheme: AppTheme = {
    bg: "#f6f6f6",
    card: "#ffffff",
    text: "#111111",
    subText: "#666666",
    border: "#eeeeee",
    inputBg: "#ffffff",
    mutedBg: "#fafafa",
    btnBg: "#111111",
    btnText: "#ffffff",
  };
  
  export const darkTheme: AppTheme = {
    bg: "#0b0b0f",
    card: "#15151c",
    text: "#ffffff",
    subText: "#b5b5c0",
    border: "#242432",
    inputBg: "#15151c",
    mutedBg: "#1b1b25",
    btnBg: "#ffffff",
    btnText: "#111111",
  };