function useNginxProxy(req) {
    return req.get("X-Real_IP");
}

exports.GetRealIP=useNginxProxy;
