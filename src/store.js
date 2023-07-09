// store.js
import { createStore } from 'vuex';

const store = createStore({
    state() {
        return {
            authToken: null,
            userId: null,
            playlistId: null,
            playlistLink: null,

        };
    },
    mutations: {
        setAuthToken(state, value) {
            state.authToken = value;
        },
        setUserId(state, value) {
            state.userId = value;
        },
        setPlaylistId(state, value) {
            state.playlistId = value;
        },
        setPlaylistLink(state, value) {
            state.playlistLink = value;
        },
    },
    actions: {
        updateAuthToken({ commit }, value) {
            commit('setAuthToken', value);
        },
        updateUserId({ commit }, value){
            commit("setUserId",value);
        },
        updatePlaylistId({ commit }, value){
            commit("setPlaylistId",value);
        },
        updatePlaylistLink({ commit }, value){
            commit("setPlaylistLink",value);
        },
    },
    getters: {
        getAuthToken: state => () => state.authToken,
        getUserId : state => () =>  state.userId,
        getPlaylistId : state => () =>  state.playlistId,
        getPlaylistLink : state => () =>  state.playlistLink
    },
});

export default store;

