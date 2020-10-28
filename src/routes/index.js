import Vue from 'vue'
// const Vue = require('vue')
import VueRouter from 'vue-router'
// const Router = require('vue-router')
import 	routes from './routes';
import user from "utils/user";
Vue.use(VueRouter)

const scrollBehavior = (to, from, savedPosition) => {
	return {
		x: 0,
		y: 0
	}
}

const router = new VueRouter({
	scrollBehavior,
	routes
})

router.beforeEach((to, from, next) => {
	//判断是否需要登陆
	// if (!to.meta.noLogin) {
	// 	if (!user.isLogin()) {
	// 		user.updateUserInfo();
	// 	}
	// }
	next();
})

export default router
