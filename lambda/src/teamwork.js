export function teamwork(event, context, callback) {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      id: 1,
      msg: 'test'
    })
  })
}
