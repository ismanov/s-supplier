const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = (env = {}) => {
  const { mode = "development" } = env;

  const isProd = mode === "production";
  const isDev = mode === "development";

  const getStyleLoaders = () => {
    return [
      isProd ? MiniCssExtractPlugin.loader : "style-loader",
      "css-loader",
    ];
  };

  const getPlugins = () => {
    const plugins = [
      new HtmlWebpackPlugin({
        template: "public/index.html",
        favicon: "src/assets/images/favicon.png",
        buildTime: new Date().toString().slice(0, 24),
      }),
    ];

    if (isProd) {
      plugins.push(
        new MiniCssExtractPlugin({
          filename: "main-[hash:8].css",
        }),
        new CleanWebpackPlugin()
      );
    } else {
      plugins.push(
        new webpack.SourceMapDevToolPlugin({
          filename: "[file].map",
        })
      );
    }

    return plugins;
  };

  return {
    mode: isProd ? "production" : isDev && "development",

    entry: path.resolve(__dirname, "src/index.js"),

    output: {
      filename: isProd ? "main-[hash:8].js" : undefined, // название файла. undefined - название по умолчанию
      publicPath: "/",
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: "babel-loader",
        },

        // loading images
        {
          test: /\.(jpg|png|gif|ico|jpeg|svg)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                outputPath: "images",
                name: "[name]-[sha1:hash:7].[ext]",
              },
            },
          ],
        },

        // loading fonts
        {
          test: /\.(ttf|otf|eot|woff|woff2)$/,
          exclude: /node_modules/,
          loader: "url-loader?limit=30000&name=[name]-[hash].[ext]",
        },

        // loading css
        {
          test: /\.(css)$/,
          exclude: /node_modules/,
          use: [
            ...getStyleLoaders(),
            {
              loader: "postcss-loader",
              options: {
                sourceMap: true,
                config: { path: "postcss.config.js" },
              },
            },
          ],
        },

        // loading SASS/SCSS
        {
          test: /\.(s[ca]ss)$/,
          exclude: /node_modules/,
          use: [
            ...getStyleLoaders(),
            {
              loader: "postcss-loader",
              options: {
                sourceMap: true,
                config: { path: "postcss.config.js" },
              },
            },
            "sass-loader",
          ],
        },

        // loading LESS
        {
          test: /\.less$/,
          use: [
            ...getStyleLoaders(),
            {
              loader: "postcss-loader",
              options: {
                sourceMap: true,
                config: { path: "postcss.config.js" },
              },
            },
            {
              loader: "less-loader",
              options: {
                lessOptions: {
                  modifyVars: {
                    "primary-color": "#009f3c",
                    "link-color": "#009f3c",
                    "input-height-base": "40px",
                    "border-radius-base": "4px",
                  },
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
      ],
    },

    resolve: {
      alias: {
        styles: path.resolve(__dirname, "src/styles/"),
        ui: path.resolve(__dirname, "src/app/ui/"),
        images: path.resolve(__dirname, "src/assets/images/"),
        svgIcons: path.resolve(__dirname, "src/assets/svg/"),
        api: path.resolve(__dirname, "src/api"),
        helpers: path.resolve(__dirname, "src/app/helpers/"),
      },
      extensions: [".js", ".jsx", "scss"],
    },

    plugins: getPlugins(),

    devServer: {
      open: true,
      port: 8089,
      historyApiFallback: true,
      proxy: {
        "/api": {
          target: "https://api-devsupply.smartpos.uz",
          secure: true,
          changeOrigin: true,
        },
      },
    },
  };
};
