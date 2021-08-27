module.exports = {
  webpack5: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.experiments = {
      syncWebAssembly: true,
  	};
    config.resolve.fallback = { fs: false, crypto: false };


    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/sync',
    });

    config.module.rules.push({
      test: /\.svg?$/,
      oneOf: [
        {
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                prettier: false,
                svgo: true,
                svgoConfig: {
                  plugins: [{removeViewBox: false}],
                },
                titleProp: true,
              },
            },
          ],
          issuer: {
            and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
          },
        },
      ],
    });

    // Important: return the modified config
    return config;
  },
};
