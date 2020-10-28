import request from 'utils/request';
export function getJSON(url,params) {
  return request.get(url,params);
}
// axios({
//   method: 'get',
//   url: method,
//   dataType: "json",
//   crossDomain: true,
//   cache: false
// }).then(res => {
//   resolve(res)
// }).catch(error => {
//   reject(error)
// })
