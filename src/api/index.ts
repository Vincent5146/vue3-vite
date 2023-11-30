import axios from "axios";

let baseURL = "https://app.design-edg.com/spinfit/api";
// 根据条件切换 baseURL
if (window.location.hostname === "spinfit-eartip.com") {
  baseURL = "https://spinfit-eartip.com/api";
}
const userRequest = axios.create({ baseURL });

const apiGetLanguages = () => {
  return userRequest.get("/languages");
};
const apiGetHome = (data) => {
  return userRequest.get("/home", data);
};
const apiGetAbout = (data) => {
  return userRequest.get("/about", data);
};
const apiGetNewsTypes = (data) => {
  return userRequest.get("/news/types", data);
};
const apiGetNewsList = (data) => {
  return userRequest.get("/news/list", data);
};
const apiGetNews = (data) => {
  return userRequest.get("/news", data);
};
const apiGetFAQ = (data) => {
  return userRequest.get("/faq", data);
};
const apiGetService = (data) => {
  return userRequest.get("/contact", data);
};
const apiGetMarkets = (data) => {
  return userRequest.get("/markets", data);
};
const apiGetProductBrands = () => {
  return userRequest.get("/product/brands");
};
const apiGetProductList = (data) => {
  return userRequest.get("/product/list", data);
};
const apiGetProduct = (data) => {
  return userRequest.get("/product", data);
};
const apiPostContact = (data) => {
  return userRequest.post("/contact", data);
};
export {
  apiGetLanguages,
  apiGetHome,
  apiGetAbout,
  apiGetNewsTypes,
  apiGetNewsList,
  apiGetNews,
  apiGetFAQ,
  apiGetService,
  apiGetMarkets,
  apiGetProductBrands,
  apiGetProductList,
  apiGetProduct,
  apiPostContact,
};
