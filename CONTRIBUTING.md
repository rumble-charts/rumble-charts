## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Test `npm test` and check `npm run lint` your code (automatically using husky)
4. Commit your changes: `git commit -m 'fix: your change'` (according to conventional commits: https://www.conventionalcommits.org/)
5. Push to the branch: `git push origin my-new-feature`
6. Submit a pull request :D

## Development and testing

```bash
# 1. Fork it on github

# 2. Clone your repo
git clone git@github.com:rumble-charts/rumble-charts.git
cd rumble-charts

# 3. Install all dependencies (including devDependencies)
npm install

# 4.
# to run all tests and generate test coverage (./coverage)
npm test

# to check code styling (required before you commit your changes and submit a pull request)
npm run lint

# to make a ready-to-use build (unnecessary)
npm run build

# to run storybook dev server
npm run start:storybook

# to run playroom dev server (for storybook)
npm run start:playroom
```
