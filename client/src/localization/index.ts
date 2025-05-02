import { FluentBundle, FluentResource, type FluentValue } from "@fluent/bundle";
import { plainText as enCA } from "../../localization/en-CA.ftl";

const bundle: FluentBundle = new FluentBundle(["en-CA"], {
  useIsolating: true,
  functions: {
    REF: ([key]: FluentValue[], params: { [key: string]: FluentValue }) => {
      const message = bundle.getMessage(key as string);
      if (!message || !message.value) {
        console.error(`\`ref\` lookup failed. Unknown key ${key}`);
        return key;
      }
      return bundle.formatPattern(message.value, params);
    },
  },
});
const errors = bundle.addResource(new FluentResource(enCA));
for (const error of errors) {
  console.error(error);
}

export default async function loc(
  key: string,
  params?: { [key: string]: string | number },
) {
  const b = await bundle;
  const message = b.getMessage(key);
  if (!message || !message.value) {
    console.error(`Unknown message ${key}`);
    return key;
  }
  const errors: Error[] = [];
  const result = b.formatPattern(message.value, params, errors);
  for (const error of errors) {
    console.error(error);
  }
  return result;
}
