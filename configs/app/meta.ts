import app from './app';
import { getEnvValue, getExternalAssetFilePath, parseEnvJson } from './utils';

const defaultImageUrl = '/static/og_placeholder.png';
const path = getExternalAssetFilePath('NEXT_PUBLIC_OG_IMAGE_URL');
let ogImageUrl: URL;

// Handle Next.js to collect page data
try {
  ogImageUrl = new URL(path || defaultImageUrl, app.baseUrl);
} catch (e) {
  ogImageUrl = new URL('', 'https://placehodler');
}

const meta = Object.freeze({
  promoteBlockscoutInTitle: parseEnvJson<boolean>(getEnvValue('NEXT_PUBLIC_PROMOTE_BLOCKSCOUT_IN_TITLE')) ?? true,
  og: {
    title: getEnvValue('NEXT_PUBLIC_OG_TITLE') || '',
    description: getEnvValue('NEXT_PUBLIC_OG_DESCRIPTION') || '',
    imageUrl: ogImageUrl,
    enhancedDataEnabled: getEnvValue('NEXT_PUBLIC_OG_ENHANCED_DATA_ENABLED') === 'true',
  },
});

export default meta;
