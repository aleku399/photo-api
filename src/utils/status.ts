export enum Status {
  success = "success",
  pending = "pending",
  failed = "failed"
}

export const { pending, success, failed } = Status;

export const statuses = [pending, success, failed];

export function unsafeFromString(status: string): Status {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value = (<any>Status)[status];
  return value || status;
}
