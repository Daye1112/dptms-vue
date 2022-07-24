import defaultSettings from '@/settings'

const title = defaultSettings.title

export default function getPageTitle(pageTitle) {
  if (pageTitle === 'java技术学习网') {
    return `${pageTitle}`;
  }
  if (pageTitle) {
    return `${pageTitle} - ${title}`;
  }
  return `${title}`;
}
