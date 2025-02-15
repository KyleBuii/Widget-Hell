import { defineConfig } from 'vite';
import purgecss from '@fullhuman/postcss-purgecss';


export default defineConfig({
    build: {
        minify: 'esbuild',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
    },
    plugins: [
        'autoprefixer',
        purgecss({
            content: [
                './index.html',
                './src/**/*.{js,ts,jsx,tsx,html}',
            ],
            defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
        }),
    ]
});