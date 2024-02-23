import HtmlWebpackPlugin from "html-webpack-plugin";
import { WebpackManifestPlugin } from "webpack-manifest-plugin";
import WebpackPwaManifest from 'webpack-pwa-manifest'
import path from 'path';
import { fileURLToPath } from 'url';
import { pages } from "./pages.config.js";
import { icons, screenshots } from "./src/js/helpers/webmanifest.js";

const __filename    = fileURLToPath(import.meta.url);
const __dirname     = path.dirname(__filename);
const dist          = path.resolve(__dirname, "dist")
const src           = path.resolve(__dirname, "src")
const nodeModule    = path.resolve(__dirname, "node_modules")

const dots = (params, value) => params == value ? '.' : '..'
const slugs = (params, value) => params == value ? 'index' : `pages/${params}`

const me = {
    fullName: "Leat Sophat",
    shortName:  "Sophat",
    description: "This Website is showing about Mr.Leat Sophat",
    start_url: "/",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    domain: "https://hola.leatsophat.me"
}


export default {
    devtool: "eval",
    mode: 'production',
    entry: pages.reduce(
        (config, page) => {
            config[page] = `./src/js/${page == "home" ? 'index' : `utils/${page}` }.js`;
            return config;
        }, {}
    ),
    output: {
        filename: 'js/[name]-static-[contenthash:10].js?id=[contenthash]',
        asyncChunks: false,
        clean: true
    },
    watchOptions: {
        ignored: nodeModule,
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                resolve: {
                    fullySpecified: false, // disable the behaviour
                },
            },
            {
                test: /\.(png|jpe?g|gif|ico|webp)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            publicPath: 'dist',
                            name: 'assets/[name].[ext]',
                        },
                    },
                ],
            }
        ],
    },
    devServer: {
        static: {
            directory: 'dist',
            staticOptions: {},
            serveIndex: true,
            watch: true,
        },
    },
    plugins: [
        new WebpackManifestPlugin({
            fileName: 'mainfest.json',
            publicPath: '/'
        }),
        new WebpackPwaManifest({
            publicPath: '/',
            name: me?.fullName,
            short_name: me?.shortName,
            description: me?.description,
            start_url: me?.start_url,
            background_color: me?.background_color,
            theme_color: me?.theme_color,
            crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
            icons: [].concat(icons(src)),
            screenshots: [].concat(screenshots),
            filename: "site.webmanifest"
        })
    ].concat(
        pages.map((page) =>
            new HtmlWebpackPlugin({
                favicon: `${src}/assets/favicon.ico`,
                title: `${page.toLocaleUpperCase()} - Leat Sophat`,
                filename: `${dist}/${slugs(page, "home")}.html`,
                template: `${src}/${page == "home" ? 'index' : `pages/${page}`}.html`,
                detail: me?.description,
                chunks: [page],
                inject: "body",
                templateParameters: {
                    title: `${page.toLocaleUpperCase()} - Leat Sophat`,
                    detail: me?.description,
                    link: `${me?.domain}/${ page == "home" ? "":page }`,
                    cover: `${ dots(page, "home")}/assets/screenshots-2.webp`,
                    appleTouchIcon: `${ dots(page, "home") }/assets/apple-touch-icon.png`,
                    icon16x16: `${ dots(page, "home") }/assets/favicon-32x32.png`,
                    icon32x32: `${ dots(page, "home") }/assets/favicon-16x16.png`,
                    style: `${ dots(page, "home") }/index.css`,
                }
            })
        )
    ),
    resolve: {
        roots: [path.resolve(__dirname, "dist/assets")],
    },
};