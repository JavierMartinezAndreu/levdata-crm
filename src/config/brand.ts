export const brand = {
  name: "LevData",
  slogan: "Datos, automatización y decisión para empresas.",

  colors: {
    aqua: "#00ABBD",
    skyBlue: "#0099DD",
    orange: "#FF9933",
    iceBlue: "#A1C7E0",
    navy: "#071B3A",
    background: "#F6FAFC",
    surface: "#FFFFFF",
    border: "#DCEAF1",
  },

  gradients: {
    main: "linear-gradient(120deg, #00ABBD, #0099DD, #FF9933, #A1C7E0)",
    soft: "linear-gradient(135deg, rgba(0,171,189,0.12), rgba(0,153,221,0.10), rgba(255,153,51,0.10), rgba(161,199,224,0.14))",
    navy: "linear-gradient(135deg, #071B3A, #0B2A57)",
  },

  radius: {
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },

  shadow: {
    card: "0 18px 45px rgba(7, 27, 58, 0.08)",
    floating: "0 24px 70px rgba(7, 27, 58, 0.16)",
  },
} as const;

export type BrandColor = keyof typeof brand.colors;