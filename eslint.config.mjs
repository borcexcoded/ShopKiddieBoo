import nextConfig from "eslint-config-next"

const eslintConfig = [
  ...nextConfig,
  {
    rules: {
      "@next/next/no-img-element": "off",
      "react/no-unescaped-entities": "off",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
]

export default eslintConfig
