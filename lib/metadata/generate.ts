import type { ApiData, Metadata } from './types';
import type { RouteParams } from 'nextjs/types';

import type { Route } from 'nextjs-routes';

import config from 'configs/app';
import getNetworkTitle from 'lib/networks/getNetworkTitle';

import compileValue from './compileValue';
import * as templates from './templates';

export default function generate<Pathname extends Route['pathname']>(route: RouteParams<Pathname>, apiData: ApiData<Pathname> = null): Metadata {
  const params = {
    ...route.query,
    ...apiData,
    network_name: config.chain.name,
    network_title: getNetworkTitle(),
  };

  const compiledTitle = compileValue(templates.title.make(route.pathname, Boolean(apiData)), params);
  const title = compiledTitle ? compiledTitle + (config.meta.promoteBlockscoutInTitle ? ' | Blockscout' : '') : '';
  const description = compileValue(templates.description.make(route.pathname), params);

  return {
    title: title,
    description,
    opengraph: {
      title: config.meta.og.title || title,
      description: config.meta.og.description || description,
      imageUrl: config.meta.og.imageUrl,
    },
  };
}
