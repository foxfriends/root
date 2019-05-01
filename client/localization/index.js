import { FluentBundle } from 'fluent';
import enCA from '../../localization/en-CA.ftl';

const bundle = fetch(enCA)
  .then(response => response.text())
  .then(src => {
    const bundle = new FluentBundle('en-CA');
    const errors = bundle.addMessages(src);
    for (const error of errors) {
      console.error(error);
    }
    return bundle;
  });

export default async function loc (key, params) {
  const b = await bundle;
  const message = b.getMessage(key);
  if (!message) {
    console.error(`Unknown message ${key}`);
    return key;
  }
  return b.format(message, params);
}
