<<<<<<< HEAD
const fs = require('fs');
const path = require('path');

if (!process.env.CHROME_BIN && process.platform === 'win32') {
  const carpetas = [process.env.ProgramFiles, process.env['ProgramFiles(x86)'], process.env.LOCALAPPDATA].filter(Boolean);
  const existe = (ruta) => fs.existsSync(ruta);

  const chrome = carpetas.map((c) => path.join(c, 'Google', 'Chrome', 'Application', 'chrome.exe')).find(existe);
  const edge = carpetas.map((c) => path.join(c, 'Microsoft', 'Edge', 'Application', 'msedge.exe')).find(existe);

  if (!chrome && edge) {
    process.env.CHROME_BIN = edge;
  }
}
=======
// Configuración de Karma: ejecuta las pruebas de Jasmine en un navegador real (Chrome).
// Webpack + Babel transforman los archivos .jsx y los CSS Modules para el navegador.

>>>>>>> 98150b63559c62e74fc4a86962ffa6bbb1586d8b
module.exports = function (config) {
  config.set({
    // Jasmine es el framework de pruebas; webpack empaqueta los archivos de prueba
    frameworks: ['jasmine', 'webpack'],

    // Archivos de prueba: todo lo que termine en .spec.jsx dentro de src
    files: [{ pattern: 'src/**/*.spec.jsx', watched: false }],

    preprocessors: {
      'src/**/*.spec.jsx': ['webpack'],
    },

    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      resolve: { extensions: ['.js', '.jsx'] },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  ['@babel/preset-react', { runtime: 'automatic' }],
                ],
<<<<<<< HEAD
=======
                // istanbul marca el código para medir la cobertura (sin contar los .spec)
>>>>>>> 98150b63559c62e74fc4a86962ffa6bbb1586d8b
                plugins: [['istanbul', { exclude: ['**/*.spec.jsx'] }]],
              },
            },
          },
          {
            test: /\.module\.css$/,
            // "import styles from './x.module.css'" igual que en Vite
            use: ['style-loader', {
              loader: 'css-loader',
              options: { modules: { namedExport: false, exportLocalsConvention: 'as-is' } },
            }],
          },
          {
            test: /\.css$/,
            exclude: /\.module\.css$/,
            use: ['style-loader', 'css-loader'],
          },
        ],
      },
    },

    // progress: resultado de cada prueba | coverage: reporte de cobertura
    reporters: ['progress', 'coverage'],

    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'text-summary' },
      ],
    },

    browsers: ['ChromeHeadless'],
    singleRun: false,
  });
<<<<<<< HEAD
};
=======
};
>>>>>>> 98150b63559c62e74fc4a86962ffa6bbb1586d8b
