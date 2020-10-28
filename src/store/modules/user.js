// import Vue from 'vue'
// import Vuex from 'vuex'

// Vue.use(Vuex)

const state = {
    user:{}
}

const mutations = {
    changeUser(state,userObj) 
	{
		if(userObj&&userObj.token)
		{
			state.user=userObj;
		}
		else
		{
			state.user={};
		}
	},
}

const actions = {
}

// const getters = {
//     close: function () {
//         return state.isShow;
//     },
// }
export default {
	state,
	mutations,
	actions,
	// getters
}
// export default new Vuex.Store({
//     state,
//     mutations,
//     actions,
//     getters
// })
