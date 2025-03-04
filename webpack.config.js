const path = require('path'); // ����������� ������ "path" ��� ������ � ������ ������
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js', // ����� ����� ��� ������ �������

    output: {
        filename: 'bundle.js', // ��� ��������� ����� ������
        path: path.resolve(__dirname, 'dist'), // ���� ��� ��������� ����� ������
    },

    module: {
        rules: [
            {
                test: /\.css$/, // ���������� ��������� ��� ��������� ������ � ����������� .css
                use: ['style-loader', 'css-loader'], // ����������, ������������ ��� ��������� CSS-������
            },
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
    ],

    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'), // ������� ��� �������
        },
        open: true, // ������������� ��������� �������
    },

    mode: 'development', // ����� ������
};