// sum累加
export function sum(...args) {
  return args.reduce((pre, cur) => {
    return pre + cur;
  }, 0);
}
