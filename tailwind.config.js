module.exports = {
  purge: {
    enabled: true,
    content: ["./src/**/*.{js,jsx,ts,tsx,vue}"],
  },
  theme: {
    extend: {
      colors: {
        separator: "#f4f4f4",
        gray: "#767A7F",
        app: "#6c1f10",
        muted: "#a1a5b7",
        danger: "#ee2624",
        success: "#00bfa5",
        warning: "#FFA800",
        primary: "#3699FF",
        light: "#f5f5f9",
        gold: "#e9b32f",
        gray: {
          100: "#f9f9f9",
          200: "#F4F4F4",
          300: "#d5d7da",
          400: "#B5B5C3",
          500: "#a1a5b7",
          600: "#7e8299",
          700: "#5E6278",
          800: "#3F4254",
          900: "#222222",
        },
      },
      boxShadow: {
        "3xl": "0px 10px 30px 0px rgba(82,63,105,.05)",
        "4xl": "0 0 40px 0 rgba(82,63,105,.1)",
        "5xl": "0 3px 20px rgba(0,0,0,.04)",
        cate: "2px_0px_0px_2px_#e4ad2f",
      },
      fontFamily: {
        cherry: ["Cherry Bomb One"],
      },
      aspectRatio: {
        "0/6": "0.6",
        "0/7": "0.7",
        "0/8": "0.8",
        "4/5": "4/5",
        "5/3": "5/3",
      },
      backgroundImage: {
        pattern:
          "linear-gradient(-180deg,transparent 5%,rgba(0,0,0,.4) 51%,rgba(0,0,0,.6))",
      },
      padding: {
        safe: "var(--zaui-safe-area-inset-top, 0px)",
        "safe-bottom": "var(--zaui-safe-area-inset-bottom, 0px)",
      },
      translate: {
        ptr: "calc(var(--zaui-safe-area-inset-top, 0px)  + 67px)",
      },
      animation: {
        tada: "tada 1s ease-in-out infinite",
        bounceRight: "bounceRight 2s infinite",
        bounceRight: "tapDouble 1.25s ease-out backwards infinite",
      },
      keyframes: {
        tada: {
          "0%": {
            transform: "scale(1)",
          },
          "10%,20%": {
            transform: "scale(.9) rotate(-8deg)",
          },
          "30%, 50%, 70%": {
            transform: "scale(1.2) rotate(8deg)",
          },
          "40%, 60%": {
            transform: "scale(1.2) rotate(-8deg)",
          },
          "100%, 80%": {
            transform: "scale(1) rotate(0)",
          },
        },
        bounceRight: {
          "0%, 20%, 50%, 80%, 100%": {
            transform: "translateX(0)",
          },
          "40%": {
            transform: "translateX(-10px)",
          },
          "60%": {
            transform: "translateX(-10px)",
          },
        },
        tapDouble: {
          "0%": {
            transform: "rotateX(0deg)",
          },
          "10%": {
            transform: "rotateX(12.5deg)",
          },
          "25%": {
            transform: "rotateX(25deg)",
          },
          "35%": {
            transform: "rotateX(10deg)",
          },
          "50%": {
            transform: "rotateX(25deg)",
          },
        },
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant("child", "& > *");
      addVariant("child-hover", "& > *:hover");
    },
  ],
};
