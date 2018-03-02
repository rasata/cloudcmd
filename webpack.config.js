'use strict';

const path = require('path');
const dir = './client';
const dirModules = './client/modules';
const modules = './modules';

const {env} = process;
const isDev = env.NODE_ENV === 'development';

const dist = path.resolve(__dirname, 'dist');
const distDev = path.resolve(__dirname, 'dist-dev');
const devtool = isDev ? 'eval' : 'source-map';

const notEmpty = (a) => a;
const clean = (array) => array.filter(notEmpty);

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractMain = new ExtractTextPlugin('[name].css');
const extractNojs = new ExtractTextPlugin('nojs.css');

const extractView = new ExtractTextPlugin('view.css');
const extractConfig = new ExtractTextPlugin('config.css');
const extractNameSizeDate = new ExtractTextPlugin('columns/name-size-date.css');

const plugins = [
    new HtmlWebpackPlugin({
        inject: false,
        template: 'html/index.html',
        minify: !isDev && getMinifyHtmlOptions(),
    }),
    extractMain,
    extractNojs,
    extractView,
    extractConfig,
    extractNameSizeDate,
];

const rules = clean([
    !isDev && {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
    }, {
        test: /\.css$/,
        exclude: /css\/(nojs|view|config|columns.*)\.css/,
        use: extractMain.extract([
            'css-loader?minimize',
        ]),
    },
    extract('nojs', extractNojs),
    extract('view', extractView),
    extract('config', extractConfig),
    extract('columns/name-size-date', extractNameSizeDate),
    {
        test: /\.(png|gif|svg|woff|woff2|eot|ttf)$/,
        loader: 'url-loader?limit=50000',
    },
]);

const splitChunks = {
    chunks: 'all',
    name: 'cloudcmd.common',
};

module.exports = {
    devtool,
    optimization: {
        splitChunks,
    },
    entry: {
        cloudcmd: `${dir}/cloudcmd.js`,
        [modules + '/edit']: `${dirModules}/edit.js`,
        [modules + '/edit-file']: `${dirModules}/edit-file.js`,
        [modules + '/edit-file-vim']: `${dirModules}/edit-file-vim.js`,
        [modules + '/edit-names']: `${dirModules}/edit-names.js`,
        [modules + '/menu']: `${dirModules}/menu.js`,
        [modules + '/view']: `${dirModules}/view.js`,
        [modules + '/help']: `${dirModules}/help.js`,
        [modules + '/markdown']: `${dirModules}/markdown.js`,
        [modules + '/config']: `${dirModules}/config.js`,
        [modules + '/contact']: `${dirModules}/contact.js`,
        [modules + '/upload']: `${dirModules}/upload.js`,
        [modules + '/operation']: `${dirModules}/operation/index.js`,
        [modules + '/konsole']: `${dirModules}/konsole.js`,
        [modules + '/terminal']: `${dirModules}/terminal.js`,
        [modules + '/cloud']: `${dirModules}/cloud.js`,
        [modules + '/polyfill']: `${dirModules}/polyfill.js`,
    },
    output: {
        filename: '[name].js',
        path: isDev ? distDev : dist,
        pathinfo: isDev,
        libraryTarget: 'var',
        devtoolModuleFilenameTemplate,
    },
    plugins,
    externals: [
        externals
    ],
    module: {
        rules,
    },
};

function externals(context, request, fn) {
    if (!isDev)
        return fn();
    
    const list = [
        'es6-promise',
    ];
    
    if (list.includes(request))
        return fn(null, request);
    
    fn();
}

function devtoolModuleFilenameTemplate(info) {
    const resource = info.absoluteResourcePath.replace(__dirname + path.sep, '');
    return `file://cloudcmd/${resource}`;
}

function extract(name, extractCss) {
    return {
        test: RegExp(`css/${name}.css`),
        use: extractCss.extract([
            isDev ?
                'css-loader'
                :
                'css-loader?minimize'
        ])
    };
}

function getMinifyHtmlOptions() {
    return {
        removeComments:                 true,
        removeCommentsFromCDATA:        true,
        removeCDATASectionsFromCDATA:   true,
        collapseWhitespace:             true,
        collapseBooleanAttributes:      true,
        removeAttributeQuotes:          true,
        removeRedundantAttributes:      true,
        useShortDoctype:                true,
        removeEmptyAttributes:          true,
        /* оставляем, поскольку у нас
         * в элемент fm генерируеться
         * таблица файлов
         */
        removeEmptyElements:            false,
        removeOptionalTags:             true,
        removeScriptTypeAttributes:     true,
        removeStyleLinkTypeAttributes:  true,
        
        minifyJS:                       true,
        minifyCSS:                     false, 
    };
}

