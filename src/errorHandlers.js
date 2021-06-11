export const badRequest = (err, req, res, next) => {
  if (err.httpStatusCode === 400) {
    res.status(400).send(err.message)
  }
  next(err)
} // 400

export const notFound = (err, req, res, next) => {
  if (err.httpStatusCode === 404) {
    res.status(404).send(err.message || "Resource not found!")
  }
  next(err)
} 

export const unauthorized = (err, req, res, next) => {
  if (err.httpStatusCode === 401) {
    res.status(401).send(err.message || "Unauthorized!")
  }
  next(err)
} 

export const genericError = (err, req, res, next) => {
  if (!res.headersSent) {
    // checks if another error middleware already sent a response
    res.status(err.httpStatusCode || 500).send(err.message)
  }
}