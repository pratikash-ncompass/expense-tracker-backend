const send_response = (res, status, success, message, data) => {
  let response = {
    status: status,
    success: success,
    message: message,
    data: data,
  };
  res.send(response);
};

const error_response = (res, status, success, message, data) => {
    let response = {
        status: status,
        success: success,
        message: message,
        data:data
      };
      res.send(response);
}

module.exports = { send_response, error_response };
