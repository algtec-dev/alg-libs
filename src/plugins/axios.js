import Vue from 'vue'
import axios from "axios";

const http = axios.create();

http.defaults.baseURL = Vue.prototype.$apiUrl;

// instance.defaults.headers.common["Authorization"] =
//   "Token" + localStorage.getItem("authToken");

export default http;