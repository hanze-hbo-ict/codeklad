import { defineConfig } from 'vite';
const headers = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
};
export default defineConfig({
  server: { headers, strictPort: true },
  preview: { headers, strictPort: true },
  build: { rolldownOptions: { input: ['index.html', 'experiments/input-spike/index.html'] } },
});
