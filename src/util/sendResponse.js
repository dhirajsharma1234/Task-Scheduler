const sendResponse = (res, status, message) => {
    return res.status(status).json({ status, message });
};

export {sendResponse};
  