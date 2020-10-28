const getters = {
    fileQueue: state =>state.fileHasher.fileQueue,
    close: function () {
        return state.isShow;
    },
    getActive: state => {//激活的组件
        for (let i = 0, l = state.dragLesize.rects.length; i < l; i++) {
            let rect = state.dragLesize.rects[i];

            if (rect.active) {
                return i;
            }
        }
        return null;
    },
    getAllActive: state => {//激活的组件
        let activeArr = state.dragLesize.rects.filter(item=>!!item.active)
        return activeArr.length<1?null:activeArr;
    },
}
export default getters
