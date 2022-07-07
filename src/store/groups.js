export default {
    namespaced: true,
    state: {
        groupPosterData: {},
        groupsTeamId: null
    },
    mutations: {
        setGroupsPoster(state, res) {
            state.groupPosterData = {...res}
        },
        // 设置拼团teamid
        setGroupsTeamId(state, id){
            state.groupsTeamId = id
        }
    }
}