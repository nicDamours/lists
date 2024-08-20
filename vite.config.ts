// vite.config.js
import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import {fileURLToPath, URL} from "node:url";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

export default defineConfig(({mode}) => {

    return {
        build: {
            commonjsOptions: {
                transformMixedEsModules: true
            }
        },
        plugins: [
            vue(),
            VueI18nPlugin({
                include: [
                    fileURLToPath(new URL("src/locales/*.json", import.meta.url))
                ],
                strictMessage: false,
                escapeHtml: true,
                bridge: true
            })
        ],
        resolve: {
            extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".vue"],
            alias: {
                "@": new URL("./src/", import.meta.url).pathname,
                "@/../tests": new URL("./tests/", import.meta.url).pathname
            }
        },
        server: {
            port: 8100
        }
    };
});
