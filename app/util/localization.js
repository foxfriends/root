import { FluentBundle } from 'fluent';
import enCA from 'url:../../localization/en-CA.ftl';

const bundle = fetch(enCA)
  .then(response => response.text())
  .then(src => {
    const bundle = new FluentBundle(['en-CA'], {
      useIsolating: true,
      functions: {
        REF: ([key], params) => {
          const message = bundle.getMessage(key);
          if (!message) {
            console.error(`\`ref\` lookup failed. Unknown key ${key}`);
            return key;
          }
          return bundle.format(message, params);
        },
      },
    });
    const errors = bundle.addMessages(src);
    for (const error of errors) {
      console.error(error);
    }
    return bundle;
  });

export default async function loc(key, params) {
  const b = await bundle;
  const message = b.getMessage(key);
  if (!message) {
    console.error(`Unknown message ${key}`);
    return key;
  }
  const errors = []
  const result = b.format(message, params, errors);
  for (const error of errors) {
    console.error(error);
  }
  return result;
}

