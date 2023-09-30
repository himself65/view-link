import psl from 'psl';

import { extractHostname } from './utils';

export const getImageSearchString = (
  title: string,
  url: string,
  siteName?: string
) => {
  const rootDomain = psl.get(extractHostname(url));
  let searchString = title;
  if (rootDomain) {
    const domainSearchMask = rootDomain;
    const domainRegEx = new RegExp(domainSearchMask, 'ig');
    const stripRootDomain = title.replace(domainRegEx, '');
    if (/\S/.test(stripRootDomain)) {
      searchString = stripRootDomain;
    }
  }

  // Can remove site name here for more specificity but generally leads to worse results
  // const siteNameSearchMask = siteName ? siteName : '';
  // const siteNameRegEx = new RegExp(siteNameSearchMask, 'ig');
  // const stripSiteName = searchString.replace(siteNameRegEx, '');
  // searchString = stripSiteName;

  const stripSpecialChars = searchString
    .replace(/[&\/\\#,+()$~%.'":*?<>{}|—]/g, ' ')
    .trim();
  searchString = stripSpecialChars;

  return searchString;
};

export const getBingImageSearch = async (
  search: string
): Promise<{ results?: Array<any>; error?: any }> => {
  const subscriptionKey = process.env.AZURE_BING_SEARCH_KEY;
  const url = 'https://api.bing.microsoft.com/v7.0/images/search';
  if (search) {
    try {
      const res = await fetch(
        url + '?q=' + encodeURIComponent(search) + '&aspect=Square',
        {
          method: 'GET',
          headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey,
          },
        }
      ).then(res => res.json());
      return {
        results: res.data.value,
      };
    } catch (error) {
      return {
        error: error,
      };
    }
  } else {
    return {
      error: 'No search string for image',
    };
  }
};
