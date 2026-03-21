import { defineConfig, type Plugin } from 'vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'fs';
import Handlebars from 'handlebars';

function handlebarsPrecompile(): Plugin {
  return {
    name: 'handlebars-precompile',
    transform(code, id) {
      if (!id.endsWith('.hbs')) return null;

      Handlebars.registerHelper('t', () => '');
      const precompiled = Handlebars.precompile(code);

      return {
        code: `
          import Handlebars from 'handlebars/runtime';
          export default Handlebars.template(${precompiled});
        `,
        map: null,
      };
    },
  };
}

function copyExtensionFiles(): Plugin {
  return {
    name: 'copy-extension-files',
    writeBundle() {
      copyFileSync('manifest.json', 'dist/manifest.json');

      mkdirSync('dist/icons', { recursive: true });
      for (const file of readdirSync('icons')) {
        if (file.endsWith('.png')) {
          copyFileSync(`icons/${file}`, `dist/icons/${file}`);
        }
      }

      // Copy _locales
      if (existsSync('_locales')) {
        for (const locale of readdirSync('_locales')) {
          const srcDir = `_locales/${locale}`;
          const destDir = `dist/_locales/${locale}`;
          mkdirSync(destDir, { recursive: true });
          for (const file of readdirSync(srcDir)) {
            copyFileSync(`${srcDir}/${file}`, `${destDir}/${file}`);
          }
        }
      }
    },
  };
}

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        app: resolve(__dirname, 'src/app/app.html'),
        popup: resolve(__dirname, 'src/popup/popup.html'),
        background: resolve(__dirname, 'src/background/background.ts'),
        content: resolve(__dirname, 'src/content/content.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [handlebarsPrecompile(), copyExtensionFiles()],
});
