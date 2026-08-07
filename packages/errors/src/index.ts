export type FtvErrorCategory =
  | "validation"
  | "authorization"
  | "ownership"
  | "conflict"
  | "dependency"
  | "system"
  | "external-integration";

export interface FtvErrorOptions {
  readonly code: string;
  readonly category: FtvErrorCategory;
  readonly message: string;
  readonly technicalContext?: Readonly<Record<string, unknown>>;
  readonly cause?: unknown;
}

export class FtvError extends Error {
  readonly code: string;
  readonly category: FtvErrorCategory;
  readonly technicalContext: Readonly<Record<string, unknown>>;

  constructor(options: FtvErrorOptions) {
    super(options.message);
    this.name = "FtvError";
    this.code = options.code;
    this.category = options.category;
    this.technicalContext = options.technicalContext ?? {};
    this.cause = options.cause;
  }
}

export function toSafeErrorOutput(error: unknown): { code: string; category: string; message: string } {
  if (error instanceof FtvError) {
    return {
      code: error.code,
      category: error.category,
      message: error.message
    };
  }

  return {
    code: "FTV-SYSTEM-UNKNOWN",
    category: "system",
    message: "An unexpected system error occurred."
  };
}
