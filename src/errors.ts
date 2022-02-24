import { NextFunction, Request, Response } from "express";
import { EmptyResultError, ValidationError } from "sequelize";

export interface ApplicationError {
  statusCode?: number;
  message: string;
}

export class HTTPError extends Error implements ApplicationError {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class LoginError extends Error implements ApplicationError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
}

export class VerifyError extends Error implements ApplicationError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 500;
  }
}
export class AuthError extends Error implements ApplicationError {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class LoanError extends Error implements ApplicationError {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class PaymentError extends Error implements ApplicationError {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class WorkerError extends Error implements ApplicationError {
  constructor(message: string) {
    super(message);
  }
}

export class WalletError extends Error implements ApplicationError {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class AccountError extends Error implements ApplicationError {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class SavingError extends Error implements ApplicationError {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class PermissionDeniedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 403;
  }
}

export function handleError(
  next: NextFunction,
  statusCode: number,
  message?: string
): (error: Error) => void {
  return (error: Error) => {
    return next({
      message: message || error.message,
      statusCode
    } as ApplicationError);
  };
}

export function catchErrors(
  error: ApplicationError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line
  _next: NextFunction
): Response<unknown> {
  const stubErrorMessage = "Something went wrong";

  if (error instanceof ValidationError) {
    return catchValidationError(res)(error as ValidationError);
  }

  if (error instanceof EmptyResultError) {
    return handleEmptyResultError(res);
  }

  return res
    .status(error.statusCode || 500)
    .json({ message: error.message || stubErrorMessage });
}

function catchValidationError(res: Response) {
  return (error: ValidationError) => {
    const message = error.errors.map(error => error.message).join(", ");
    return res.status(400).json({ message });
  };
}

function handleEmptyResultError(res: Response) {
  return res.status(400).json({ message: "Requested record does not exist" });
}
