import api from '../../api/pluginstore'

/**
 * State
 */
const state = {
    categories: [],
    developer: null,
    expiryDateOptions: [],
    featuredPlugins: [],
    featuredSection: null,
    featuredSections: [],
    plugin: null,
    pluginChangelog: null,

    // plugin index
    plugins: [],
}

/**
 * Getters
 */
const getters = {
    getCategoryById(state) {
        return id => {
            return state.categories.find(c => c.id == id)
        }
    },

    getPluginEdition() {
        return (plugin, editionHandle) => {
            return plugin.editions.find(edition => edition.handle === editionHandle)
        }
    },

    getPluginIndexParams() {
        return context => {
            const perPage = context.perPage ? context.perPage : null
            const page = context.page ? context.page : 1
            const orderBy = context.orderBy
            const direction = context.direction

            return {
                perPage,
                page,
                orderBy,
                direction,
            }
        }
    },

    isPluginEditionFree() {
        return edition => {
            return edition.price === null
        }
    },
}

/**
 * Actions
 */
const actions = {
    cancelRequests() {
        return api.cancelRequests()
    },

    getCoreData({commit}) {
        return new Promise((resolve, reject) => {
            api.getCoreData()
                .then(response => {
                    commit('updateCoreData', {response})
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },

    getDeveloper({commit}, developerId) {
        return api.getDeveloper(developerId)
            .then(response => {
                commit('updateDeveloper', response.data)
            })
    },

    getFeaturedSectionByHandle({commit}, featuredSectionHandle) {
        return api.getFeaturedSectionByHandle(featuredSectionHandle)
            .then(response => {
                commit('updateFeaturedSection', response.data)
            })
    },

    getFeaturedSections({commit}) {
        return api.getFeaturedSections()
            .then(response => {
                commit('updateFeaturedSections', response.data)
            })
    },

    getPluginChangelog({commit}, pluginId) {
        return new Promise((resolve, reject) => {
            api.getPluginChangelog(pluginId)
                .then(response => {
                    commit('updatePluginChangelog', response.data)
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },

    getPluginDetails({commit}, pluginId) {
        return new Promise((resolve, reject) => {
            api.getPluginDetails(pluginId)
                .then(response => {
                    commit('updatePluginDetails', response.data)
                    resolve(response)
                })
                .catch(error => {
                    reject(error.response)
                })
        })
    },

    getPluginDetailsByHandle({commit}, pluginHandle) {
        return api.getPluginDetailsByHandle(pluginHandle)
            .then(response => {
                commit('updatePluginDetails', response.data)
            })
    },

    getPluginsByCategory({getters, dispatch}, context) {
        return new Promise((resolve, reject) => {
            const pluginIndexParams = getters['getPluginIndexParams'](context)

            api.getPluginsByCategory(context.categoryId, pluginIndexParams)
                .then(response => {
                    dispatch('updatePluginIndex', {context, response})
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },

    getPluginsByDeveloperId({getters, dispatch}, context) {
        return new Promise((resolve, reject) => {
            const pluginIndexParams = getters['getPluginIndexParams'](context)

            api.getPluginsByDeveloperId(context.developerId, pluginIndexParams)
                .then(response => {
                    dispatch('updatePluginIndex', {context, response})
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },

    getPluginsByFeaturedSectionHandle({getters, dispatch}, context) {
        return new Promise((resolve, reject) => {
            const pluginIndexParams = getters['getPluginIndexParams'](context)
            
            return api.getPluginsByFeaturedSectionHandle(context.featuredSectionHandle, pluginIndexParams)
                .then(response => {
                    dispatch('updatePluginIndex', {context, response})
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },

    searchPlugins({getters, dispatch}, context) {
        return new Promise((resolve, reject) => {
            const pluginIndexParams = getters['getPluginIndexParams'](context)


            api.searchPlugins(context.searchQuery, pluginIndexParams)
                .then(response => {
                    dispatch('updatePluginIndex', {context, response})
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },

    updatePluginIndex({commit}, {context, response}) {
        if (context.appendData && context.appendData === true) {
            commit('appendPlugins', response.data.plugins)
        } else {
            commit('updatePlugins', response.data.plugins)
        }
    },
}

/**
 * Mutations
 */
const mutations = {
    appendPlugins(state, plugins) {
        state.plugins = [...state.plugins, ...plugins]
    },

    updateCoreData(state, {response}) {
        state.categories = response.data.categories
        state.expiryDateOptions = response.data.expiryDateOptions
    },

    updateDeveloper(state, developer) {
        state.developer = developer
    },

    updateFeaturedSection(state, featuredSection) {
        state.featuredSection = featuredSection
    },

    updateFeaturedSections(state, featuredSections) {
        state.featuredSections = featuredSections
    },

    updatePluginChangelog(state, changelog) {
        state.pluginChangelog = changelog
    },

    updatePluginDetails(state, pluginDetails) {
        state.plugin = pluginDetails
    },

    updatePlugins(state, plugins) {
        state.plugins = plugins
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
