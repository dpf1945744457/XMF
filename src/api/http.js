
import axios from 'axios'
import qs from 'qs'

//          router.push('/phoneLogin')
// 默认axios不发送cookie，需要全局设置以下项，允许跨域发送cookie。
// axios.defaults.withCredentials = true;
// 全局请求拦截器
axios.interceptors.request.use(function(config) {
    // 如果已经登陆

    return config;
}, function(error) {
    return Promise.reject(error);
})

// 全局响应拦截器
axios.interceptors.response.use(function(response) {
    const config = response.config;

    // 关闭loading...
//  store.dispatch('closeGlobalLoading');
const data = response.data;
        return data;
    // 如果状态吗正常直接返回data中的数据
    if (response && response.status === 200) {
//  	console.info('----------------')
//  	console.info(response)

        if (data.errno === 401) {
//          router.push('/phoneLogin')
            return data;
//          return Promise.reject('该用户已注册')
        } else if (data.errno === 501) {
            store.dispatch('reLogin');
            return Promise.reject('系统未登录，请重新登录')
        } else if (data.errno === 504) {
            router.push(`/bind-mobile?redirect=${base.oaIp}`)
            return Promise.reject('未绑定手机号')
        } else if (data.errno === 502) {
            router.push(`/error?statusCode=${data.errno}&msg=${data.errmsg}`)
            return Promise.reject('服务器错误！')
        } else if (data.errno === 503) {
            router.push(`/error?statusCode=${data.errno}&msg=${data.errmsg}`)
            return Promise.reject('请求业务目前未支持！')
        } else if (data.errno === 403) {
            return data;
        } else if (data.errno === 302) {
            return data;
        } else if (data.errno === 301) {
            return data;
        } else if (config.isGetCode) {
            return data;
        } else if (data.errno === 0) {
//			console.info('-------------------')
//			console.info(data.data)
          if (data.data == undefined) {
            return data;
          } else {
            return data.data;
          }
        } else {
          // 提示具体错误信息

            return Promise.reject(data.errmsg);
        }
    }
}, function(error) {
    // 关闭loading...

console.log(error);
})

export default {
    post: function(baseURL, url, data, loading, isCode) {
        const isLoading = loading || false;
        const isGetCode = isCode || false;
        return axios({
            method: 'post',
            url: url,
            baseURL: baseURL,
            data: data,
            timeout: 20000,
            isLoading,
            isGetCode,
            headers: {
                'Cache-Control': 'no-cache'
            }
        })
    },
    post2: function(baseURL, url, data, loading, isCode) {
        const isLoading = loading || false;
        const isGetCode = isCode || false;
        return axios({
            method: 'post',
            url: url,
            baseURL: baseURL,
            data: qs.stringify(data),
            timeout: 20000,
            isLoading,
            isGetCode,
            headers: {
                'Cache-Control': 'no-cache',
                // "Content-Type": "text/html"
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        })
    },
    get: function(baseURL, url, params, loading, isCode) {
        const isLoading = loading || false;
        const isGetCode = isCode || false;
        return axios({
            method: 'GET',
            url: url,
            baseURL: baseURL,
            params: params,
            timeout: 20000,
            isLoading,
            isGetCode,
            headers: {
                'Cache-Control': 'no-cache'
            }
        })
    }
}
