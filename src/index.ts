import http from "http";
import { router } from './routes';

const server = http.createServer(router);

server.listen(8000, () => {
  console.log('Server is running on port 8000. Go to http://localhost:8000/')
});
