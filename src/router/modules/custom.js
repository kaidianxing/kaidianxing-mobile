import $decorator from '@/common/decorator'
const custom = [
    {
        path: '/kdxCustom/index/index',
        name: 'custom_index',
        meta: {
            title: '自定义装修',
            customShareInfo:true,//自定义分享信息
        },
        beforeEnter: (to, from, next) => {
            $decorator.getPage('/kdxCustom/index/index')?.beforeEnter?.(to,from)
            next();
        }
    }]

export default custom