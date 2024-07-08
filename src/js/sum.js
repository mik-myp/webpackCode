// 多个数累加
export default function sum(...args) {
  return args.reduce((prev, cur) => {
    return prev + cur
  }, 0)
}