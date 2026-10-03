const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Permite ao Metro resolver arquivos .cjs usados internamente pelo Firebase SDK
config.resolver.sourceExts.push('cjs');

// Prioriza o bundle nativo (react-native) antes do browser para pacotes com suporte
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;
