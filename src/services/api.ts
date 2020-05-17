import axios from 'axios';

// yarn json-server --host YOUR_PC_IP -p PORT --watch server.json
// yarn json-server --host 192.168.2.136 -p 3333 --watch server.json
const api = axios.create({
  baseURL: 'http://192.168.2.136:3333',
});

export default api;
