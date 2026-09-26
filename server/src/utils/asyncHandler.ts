import type { RequestHandler } from "express";

type AsyncRequestHandler = (
    ...args: Parameters<RequestHandler>
) => ReturnType<RequestHandler> | Promise<unknown>;

class AsyncHandler {
    static wrap(requestHandler: AsyncRequestHandler): RequestHandler {
        return (req, res, next) => {
            Promise.resolve()
                .then(() => requestHandler(req, res, next))
                .catch(next);
        };
    }
}

export { AsyncHandler };
