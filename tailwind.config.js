/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts}",
    "./pages/**/*.{vue,js}" // 必须包含 test 页面（pages/test/test.vue）
  ],
  theme: {
    extend: {} // 暂时清空自定义样式，避免干扰
  },
  corePlugins: {
    preflight: false // 必须禁用
  },
  plugins: []
}