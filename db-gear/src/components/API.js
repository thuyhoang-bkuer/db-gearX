import axios from 'axios';

export default axios.create({
  baseURL: `http://${window.location.hostname}:7070/api`,
  headers: {
    'Accept': 'application/json;charset=utf-8',
    'Content-Type': 'application/json;charset=utf-8',
  }
});