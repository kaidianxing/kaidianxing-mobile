/* eslint-disable */
import {
    mapState,
    mapGetters,
    mapMutations
} from 'vuex'
import { px2rpx } from '@/assets/jsTools/environment'
export default {
    computed: {
        ...mapState('decorate', {
            pageList: state => state.pageList,
        })
    },
    props: {
        startLoadImg:{//是否可以加载图片，配合PC端懒加载图片
            type: Boolean,
            default:true
        },
        componentData: {
            type: Object,
            default: () => ({
                style: {},
                params: {}
            })
        }
    },
    methods: {
        px2rpx,
    }
}