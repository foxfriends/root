export default function wait(duration) {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}
