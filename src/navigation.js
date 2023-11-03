import { getPermalink, getBlogPermalink, getTravelPermalink, getAsset } from './utils/permalinks';
import { findCategories } from '~/utils/blog';

const allCategories = await findCategories();

export const headerData = {
  links: [
    {
      text: 'Article',
      href: getBlogPermalink(),
    },
    {
      text: 'Category',
      links: allCategories.map((category) => ({
        text: category,
        href: getPermalink(category, 'category'),
      })),
    },
    {
      text: 'Travel',
      href: getTravelPermalink(),
    },
  ],
  actions: [{ text: 'Porfolio', href: getPermalink('/personal') }],
};

export const footerData = {
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/onwidget/astrowind' },
  ],
  footNote: `
    <span class="w-5 h-5 md:w-6 md:h-6 md:-mt-0.5 bg-cover mr-1.5 rtl:mr-0 rtl:ml-1.5 float-left rtl:float-right rounded-sm bg-[url(https://onwidget.com/favicon/favicon-32x32.png)]"></span>
    Made by <a class="text-blue-600 hover:underline dark:text-gray-200" href="https://onwidget.com/"> onWidget</a> · All rights reserved.
  `,
};
