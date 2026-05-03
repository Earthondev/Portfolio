module.exports = {
  content: [
    './*.html',
    './case-studies/**/*.html',
    './assets/js/**/*.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Sarabun', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    }
  }
};
