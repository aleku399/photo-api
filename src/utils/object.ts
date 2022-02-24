import R from "ramda";

export function removeNullableProps(
  obj: Record<string, unknown>
): Record<string, unknown> {
  return R.pickBy(R.compose(R.not, R.isNil), obj);
}
