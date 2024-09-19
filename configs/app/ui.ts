import type { ContractCodeIde } from 'types/client/contract';
import { NAVIGATION_LINK_IDS, type NavItemExternal, type NavigationLinkId, type NavigationLayout } from 'types/client/navigation';
import { HOME_STATS_WIDGET_IDS, type ChainIndicatorId, type HeroBannerConfig, type HomeStatsWidgetId } from 'types/homepage';
import type { NetworkExplorer } from 'types/networks';
import type { ColorThemeId } from 'types/settings';
import type { FontFamily } from 'types/ui';

import { COLOR_THEMES } from 'lib/settings/colorTheme';

import * as features from './features';
import * as views from './ui/views';
import { getEnvValue, getExternalAssetFilePath, parseEnvJson } from './utils';

const hiddenLinks = (() => {
  const parsedValue = parseEnvJson<Array<NavigationLinkId>>(getEnvValue('NEXT_PUBLIC_NAVIGATION_HIDDEN_LINKS')) || [];

  if (!Array.isArray(parsedValue)) {
    return undefined;
  }

  const result = NAVIGATION_LINK_IDS.reduce((result, item) => {
    result[item] = parsedValue.includes(item);
    return result;
  }, {} as Record<NavigationLinkId, boolean>);

  return result;
})();

const homePageStats: Array<HomeStatsWidgetId> = (() => {
  const parsedValue = parseEnvJson<Array<HomeStatsWidgetId>>(getEnvValue('NEXT_PUBLIC_HOMEPAGE_STATS'));

  if (!Array.isArray(parsedValue)) {
    const rollupFeature = features.rollup;

    if (rollupFeature.isEnabled && [ 'zkEvm', 'zkSync', 'arbitrum' ].includes(rollupFeature.type)) {
      return [ 'latest_batch', 'average_block_time', 'total_txs', 'wallet_addresses', 'gas_tracker' ];
    }

    return [ 'total_blocks', 'average_block_time', 'total_txs', 'wallet_addresses', 'gas_tracker' ];
  }

  return parsedValue.filter((item) => HOME_STATS_WIDGET_IDS.includes(item));
})();

const highlightedRoutes = (() => {
  const parsedValue = parseEnvJson<Array<NavigationLinkId>>(getEnvValue('NEXT_PUBLIC_NAVIGATION_HIGHLIGHTED_ROUTES'));
  return Array.isArray(parsedValue) ? parsedValue : [];
})();

const defaultColorTheme = (() => {
  const envValue = getEnvValue('NEXT_PUBLIC_COLOR_THEME_DEFAULT') as ColorThemeId | undefined;
  return COLOR_THEMES.find((theme) => theme.id === envValue);
})();

const UI = Object.freeze({
  theme: {
    statisticBgColor: getEnvValue('NEXT_PUBLIC_THEME_STATISTIC_BG_COLOR'),
    statisticBgDarkColor: getEnvValue('NEXT_PUBLIC_THEME_STATISTIC_BG_DARK_COLOR'),
    statisticTextColor: getEnvValue('NEXT_PUBLIC_THEME_STATISTIC_TEXT_COLOR'),
    statisticTextDarkColor: getEnvValue('NEXT_PUBLIC_THEME_STATISTIC_TEXT_DARK_COLOR'),
    linkColor: getEnvValue('NEXT_PUBLIC_THEME_LINK_COLOR') || 'blue.600',
    linkDarkColor: getEnvValue('NEXT_PUBLIC_THEME_LINK_DARK_COLOR') || 'blue.300',
    linkHoverColor: getEnvValue('NEXT_PUBLIC_THEME_LINK_HOVER_COLOR') || 'blue.400',
    linkHoverDarkColor: getEnvValue('NEXT_PUBLIC_THEME_LINK_HOVER_DARK_COLOR') || 'blue.200',
    textColor: getEnvValue('NEXT_PUBLIC_THEME_TEXT_COLOR') || 'blackAlpha.800',
    textDarkColor: getEnvValue('NEXT_PUBLIC_THEME_TEXT_DARK_COLOR') || 'whiteAlpha.800',
    textSecondaryColor: getEnvValue('NEXT_PUBLIC_THEME_TEXT_SECONDARY_COLOR') || 'gray.500',
    textSecondaryDarkColor: getEnvValue('NEXT_PUBLIC_THEME_TEXT_SECONDARY_DARK_COLOR') || 'gray.400',
    errorColor: getEnvValue('NEXT_PUBLIC_THEME_ERROR_COLOR') || 'red.500',
    errorDarkColor: getEnvValue('NEXT_PUBLIC_THEME_ERROR_DARK_COLOR') || 'red.500',
    dividerColor: getEnvValue('NEXT_PUBLIC_THEME_DIVIDER_COLOR') || 'blackAlpha.200',
    dividerDarkColor: getEnvValue('NEXT_PUBLIC_THEME_DIVIDER_DARK_COLOR') || 'whiteAlpha.200',
  },
  navigation: {
    logo: {
      'default': getExternalAssetFilePath('NEXT_PUBLIC_NETWORK_LOGO'),
      dark: getExternalAssetFilePath('NEXT_PUBLIC_NETWORK_LOGO_DARK'),
    },
    icon: {
      'default': getExternalAssetFilePath('NEXT_PUBLIC_NETWORK_ICON'),
      dark: getExternalAssetFilePath('NEXT_PUBLIC_NETWORK_ICON_DARK'),
    },
    hiddenLinks,
    highlightedRoutes,
    otherLinks: parseEnvJson<Array<NavItemExternal>>(getEnvValue('NEXT_PUBLIC_OTHER_LINKS')) || [],
    featuredNetworks: getExternalAssetFilePath('NEXT_PUBLIC_FEATURED_NETWORKS'),
    layout: (getEnvValue('NEXT_PUBLIC_NAVIGATION_LAYOUT') || 'vertical') as NavigationLayout,
  },
  footer: {
    links: getExternalAssetFilePath('NEXT_PUBLIC_FOOTER_LINKS'),
    frontendVersion: getEnvValue('NEXT_PUBLIC_GIT_TAG'),
    frontendCommit: getEnvValue('NEXT_PUBLIC_GIT_COMMIT_SHA'),
  },
  homepage: {
    title: getEnvValue('NEXT_PUBLIC_HOMEPAGE_TITLE') || 'blockchain explorer',
    chart: {
      containerBorder: getEnvValue('NEXT_PUBLIC_HOMEPAGE_CHART_CONTAINER_BORDER'),
      lineColor: getEnvValue('NEXT_PUBLIC_HOMEPAGE_CHART_LINE_COLOR'),
      areaStartColor: getEnvValue('NEXT_PUBLIC_HOMEPAGE_CHART_AREA_START_COLOR'),
      areaStartDarkColor: getEnvValue('NEXT_PUBLIC_HOMEPAGE_CHART_AREA_START_DARK_COLOR'),
      areaStopColor: getEnvValue('NEXT_PUBLIC_HOMEPAGE_CHART_AREA_STOP_COLOR'),
      areaStopDarkColor: getEnvValue('NEXT_PUBLIC_HOMEPAGE_CHART_AREA_STOP_DARK_COLOR'),
    },
    charts: parseEnvJson<Array<ChainIndicatorId>>(getEnvValue('NEXT_PUBLIC_HOMEPAGE_CHARTS')) || [],
    stats: homePageStats,
    heroBanner: parseEnvJson<HeroBannerConfig>(getEnvValue('NEXT_PUBLIC_HOMEPAGE_HERO_BANNER_CONFIG')),
    // !!! DEPRECATED !!!
    plate: {
      background: getEnvValue('NEXT_PUBLIC_HOMEPAGE_PLATE_BACKGROUND'),
      textColor: getEnvValue('NEXT_PUBLIC_HOMEPAGE_PLATE_TEXT_COLOR'),
      title: getEnvValue('NEXT_PUBLIC_HOMEPAGE_PLATE_TITLE'),
    },
  },
  views,
  indexingAlert: {
    blocks: {
      isHidden: getEnvValue('NEXT_PUBLIC_HIDE_INDEXING_ALERT_BLOCKS') === 'true' ? true : false,
    },
    intTxs: {
      isHidden: getEnvValue('NEXT_PUBLIC_HIDE_INDEXING_ALERT_INT_TXS') === 'true' ? true : false,
    },
  },
  maintenanceAlert: {
    message: getEnvValue('NEXT_PUBLIC_MAINTENANCE_ALERT_MESSAGE'),
  },
  explorers: {
    items: parseEnvJson<Array<NetworkExplorer>>(getEnvValue('NEXT_PUBLIC_NETWORK_EXPLORERS')) || [],
  },
  ides: {
    items: parseEnvJson<Array<ContractCodeIde>>(getEnvValue('NEXT_PUBLIC_CONTRACT_CODE_IDES')) || [],
  },
  hasContractAuditReports: getEnvValue('NEXT_PUBLIC_HAS_CONTRACT_AUDIT_REPORTS') === 'true' ? true : false,
  colorTheme: {
    'default': defaultColorTheme,
  },
  fonts: {
    heading: parseEnvJson<FontFamily>(getEnvValue('NEXT_PUBLIC_FONT_FAMILY_HEADING')),
    body: parseEnvJson<FontFamily>(getEnvValue('NEXT_PUBLIC_FONT_FAMILY_BODY')),
  },
  maxContentWidth: getEnvValue('NEXT_PUBLIC_MAX_CONTENT_WIDTH_ENABLED') === 'false' ? false : true,
});

export default UI;
