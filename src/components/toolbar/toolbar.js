export default {
    computed: {
        activeRect() {
            return this.$store.getters['getActive'];
        },
       
        width() {
            return this.activeRect === null ? '' : this.$store.state.dragLesize.rects[this.activeRect].width
        },

        height() {
            return this.activeRect === null ? '' : this.$store.state.dragLesize.rects[this.activeRect].height
        },

        top() {
            return this.activeRect === null ? '' : this.$store.state.dragLesize.rects[this.activeRect].top
        },

        left() {
            return this.activeRect === null ? '' : this.$store.state.dragLesize.rects[this.activeRect].left
        },

        minw() {
            return this.activeRect === null ? '' : this.$store.state.dragLesize.rects[this.activeRect].minw
        },

        minh() {
            return this.activeRect === null ? '' : this.$store.state.dragLesize.rects[this.activeRect].minh
        },

        aspectRatio() {
            return this.activeRect === null ? false : this.$store.state.dragLesize.rects[this.activeRect].aspectRatio;
        },

        parentLim() {
            return this.activeRect === null ? false : this.$store.state.dragLesize.rects[this.activeRect].parentLim;
        },

        draggable() {
            return this.activeRect === null ? false : this.$store.state.dragLesize.rects[this.activeRect].draggable;
        },

        resizable() {
            return this.activeRect === null ? false : this.$store.state.dragLesize.rects[this.activeRect].resizable;
        },

        snapToGrid() {
            return this.activeRect === null ? false : this.$store.state.dragLesize.rects[this.activeRect].snapToGrid;
        },

        topIsLocked() {
            if (this.activeRect === null) {
                return false;
            }
            return (this.$store.state.dragLesize.rects[this.activeRect].axis === 'x' ||
                this.$store.state.dragLesize.rects[this.activeRect].axis === 'none')
        },

        leftIsLocked() {
            if (this.activeRect === null) {
                return false;
            }
            return (this.$store.state.dragLesize.rects[this.activeRect].axis === 'y' ||
                this.$store.state.dragLesize.rects[this.activeRect].axis === 'none')
        },

        zIndex() {
            if (this.activeRect === null) {
                return null;
            }

            return this.$store.state.dragLesize.rects[this.activeRect].zIndex === 1 ? 'isFirst' :
                this.$store.state.dragLesize.rects[this.activeRect].zIndex === this.$store.state.dragLesize.rects.length ? 'isLast' : 'normal'

        }
    },
    methods: {
        toggleYLock() {
            if (this.activeRect === null) {
                return
            }

            this.$store.dispatch('dragLesize/changeYLock', {id: this.activeRect});
        },
        toggleXLock() {
            if (this.activeRect === null) {
                return
            }

            this.$store.dispatch('dragLesize/changeXLock', {id: this.activeRect});
        },

        toggleAspect() {
            if (this.activeRect === null) {
                return
            }
            if (!this.$store.state.dragLesize.rects[this.activeRect].aspectRatio) {
                this.$store.dispatch('dragLesize/setAspect', {id: this.activeRect});
            } else {
                this.$store.dispatch('dragLesize/unsetAspect', {id: this.activeRect});
            }
        },

        toggleParentLimitation() {
            this.$store.dispatch('dragLesize/toggleParentLimitation', {id: this.activeRect});
        },

        toggleResizable() {
            this.$store.dispatch('dragLesize/toggleResizable', {id: this.activeRect});
        },

        toggleDraggable() {
            this.$store.dispatch('dragLesize/toggleDraggable', {id: this.activeRect});
        },

        toggleSnapToGrid() {
            this.$store.dispatch('dragLesize/toggleSnapToGrid', {id: this.activeRect});
        },

        toTop() {
            this.$store.dispatch('dragLesize/changeZToTop', {id: this.activeRect});
        },

        toBottom() {
            this.$store.dispatch('dragLesize/changeZToBottom', {id: this.activeRect});
        },

        changeMinWidth(ev) {
            let minw = parseInt(ev.target.value);
            if (typeof minw !== 'number' || isNaN(minw)) {
                minw = 1;
            }

            if (minw <= 0) {
                minw = 1;
            } else if (minw > this.$store.state.dragLesize.rects[this.activeRect].width) {
                minw = this.$store.state.dragLesize.rects[this.activeRect].width;
            }

            ev.target.value = minw;

            this.$store.dispatch('dragLesize/setMinWidth', {id: this.activeRect, width: minw});
        },

        changeMinHeight(ev) {
            let minh = parseInt(ev.target.value);

            if (typeof minh !== 'number' || isNaN(minh)) {
                minh = 1;
            }

            if (minh <= 0) {
                minh = 1;
            } else if (minh > this.$store.state.dragLesize.rects[this.activeRect].height) {
                minh = this.$store.state.dragLesize.rects[this.activeRect].height;
            }

            ev.target.value = minh;

            this.$store.dispatch('dragLesize/setMinHeight', {id: this.activeRect, height: minh});
        },

        changeTop(ev) {
            let top = parseInt(ev.target.value);

            if (typeof top !== 'number' || isNaN(top)) {
                top = this.$store.state.dragLesize.rects[this.activeRect].top;
                ev.target.value = top;
                return
            }

            this.$store.dispatch('dragLesize/setTop', {id: this.activeRect, top: top});
        },

        changeLeft(ev) {
            let left = parseInt(ev.target.value);

            if (typeof left !== 'number' || isNaN(left)) {
                left = this.$store.state.dragLesize.rects[this.activeRect].left;
                ev.target.value = left;
            }

            this.$store.dispatch('dragLesize/setLeft', {id: this.activeRect, left: left});
        },

        changeWidth(ev){
            let width = parseInt(ev.target.value);

            if (typeof width !== 'number' || isNaN(width)) {
                width = this.$store.state.dragLesize.rects[this.activeRect].width;
                ev.target.value = width;
            }

            this.$store.dispatch('dragLesize/setWidth', {id: this.activeRect, width: width});
        },

        changeHeight(ev){
            let height = parseInt(ev.target.value);

            if (typeof height !== 'number' || isNaN(height)) {
                height = this.$store.state.dragLesize.rects[this.activeRect].height;
                ev.target.value = height;
            }

            this.$store.dispatch('dragLesize/setHeight', {id: this.activeRect, height: height});
        }
    }
}