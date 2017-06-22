## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Test `npm test` and check `npm run check` your code
4. Commit your changes: `git commit -am 'Add some feature'`
5. Push to the branch: `git push origin my-new-feature`
6. Submit a pull request :D

## Development and testing

```bash
# 1. Fork it on github

# 2. Clone your repo
git clone ...
cd rumble-js-charts

# 3. Install all dependencies (including devDependecies)
npm install

# 4.
# to run all tests and generate test coverage (./coverage)
npm test

# to run tests in watch mode for development
npm start

# to check code styling (required before you commit your changes and submit a pull request)
npm run check

# to make a ready-to-use build (unnecessary)
npm run build

# to run styleguidist dev server
npm run styleguide-server

# to build docs using styleguidist
npm run styleguide-build
```

## Troubleshooting

In order to install "canvas" module on OSX you have to:

    xcode-select --install
    brew install pkgconfig
    brew install pixman
    brew install libjpeg
    brew install giflib 
    brew install cairo

If you have node 8 and get the error "Cannot find module 'minimatch'" 
in node-gyp rebuild for canvas, please, use node 7 or 6.
