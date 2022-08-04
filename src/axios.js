import axios from 'axios'
import Element from 'element-ui'
import router from "./router";
import store from './store'
/**
 * axios前置拦截和后置拦截
 */

//默认url前缀
axios.defaults.baseURL = "http://139.196.153.239:8081"
//axios.defaults.baseURL = "http://localhost:8081"

//前置拦截
axios.interceptors.request.use(config => {
    return config
})

//后置拦截
axios.interceptors.response.use(response => {
    let res = response.data;
    console.log("===================")
    console.log(res)
    console.log("===================")

    if (res.code === 200) {
        return response
    } else {
        Element.Message.error(res.msg);
        return Promise.reject(response.data.message)
    }
},
    error => {
        if (error.response.status === 401) {
            store.commit("REMOVE_INFO")
            router.push("/login")
        }

        Element.Message.error(error.response.data.msg)
        return Promise.reject(error)
    }

)