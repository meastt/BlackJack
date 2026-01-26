const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Watch all files in the monorepo
config.watchFolders = [workspaceRoot];

// Let Metro know where to look for node_modules
config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
];

// Make sure symlinks are followed
config.resolver.unstable_enableSymlinks = true;

// Add the shared package and workspace root to extraNodeModules
config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    '@card-counter-ai/shared': path.resolve(workspaceRoot, 'shared'),
};

module.exports = config;
