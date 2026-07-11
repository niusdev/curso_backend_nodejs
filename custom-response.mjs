export function customResponse(res) {
    res.status = (statusCode) => {
        res.statusCode = statusCode;
        return res;
    }
    res.json = (value) => {
        try {
            const body = JSON.stringify(value);
            res.setHeader("Content-Type", "application/json");
            res.end(body);
        } catch (error) {
            res.status(500).end("error");
        }
    };
    return res;
}