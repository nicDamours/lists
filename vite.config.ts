/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import {defineConfig} from 'vite'
import {VitePWA} from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        legacy(),
        VitePWA({})
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            "@tests": path.resolve(__dirname, "./tests")
        },
    },
    test: {
        globals: true,
        environment: 'jsdom'
    },
    devServer: {
        port: 8100
    }
})
