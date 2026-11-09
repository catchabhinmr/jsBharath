import { resolve } from "node:dns";
import http from "node:http";
const server = http.createServer((request, response) => {
    const {method, url} = request;
    console.log(method);
    console.log(url);
    response.end("Hello");
});

server.listen(3000, () => console.log(`Listening on http://localhost:3000`));