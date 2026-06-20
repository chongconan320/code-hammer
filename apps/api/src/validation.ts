import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { ZodError } from "zod";

type RequestSchemas = {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
};

export function validateRequest(schemas: RequestSchemas) {
  return (request: Request, response: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        request.body = schemas.body.parse(request.body);
      }

      if (schemas.query) {
        request.query = schemas.query.parse(request.query) as Request["query"];
      }

      if (schemas.params) {
        request.params = schemas.params.parse(
          request.params,
        ) as Request["params"];
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        response.status(400).json({
          error: "validation_error",
          issues: error.issues,
        });
        return;
      }

      next(error);
    }
  };
}
