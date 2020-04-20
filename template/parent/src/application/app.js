import { NOT_LOADED, notLoadError, notSkip, isActive, isntLoaded, shouldBeActivity, shouldntBeActivity, isLoaded, isntActive,   } from './appsHelper';
import { invoke } from '../navigations/invoke';

/**
 * @function 注册App
 * @param {string} appName 要注册的app的名称
 * @param {Function: Promise | Object} loadFunction app异步加载函数， 或者app的内容
 * @param {Function: boolean} activityWhen  判断该app应该何时启动
 * @param {Object} customProps  自定义参数配置
 * return Promise
 */
const APPS = []
export function registerApplication(appName, loadFunction, activityWhen, customProps = {}) {
    // 判断参数是否合法
    if(!appName || typeof appName !== 'string') {
        throw new Error('appName不可以是一个空字符串')
    }
    if(!loadFunction) {
        throw new Error('loadFunction must be a function or object')
    }
    if(typeof loadFunction !== 'function') {
        loadFunction = () => Promise.resolve(loadFunction)
    }
    if(typeof activityWhen !== 'function') {
        throw new Error('activityWhen must be a function')
    }

    APPS.push({
        name: appName,
        loadFunction,
        activityWhen,
        customProps,
        status: NOT_LOADED
    })

    invoke();
}

/**
 * @function 获取需要被加载的app
 * 当前app 的状态不是SKIP_BECAUSE_BROKEN, 不是LOAD_ERROR，是NOT_LOADED 同时是应该被加载
 */
export function getAppsToLoad() {
    return APPS.filter(notSkip).filter(notLoadError).filter(isntLoaded).filter(shouldBeActivity)
}

/**
 * @function 获取需要被卸载的app
 * 当前app 的状态不是SKIP_BECAUSE_BROKEN, 不是LOAD_ERROR，是NOT_LOADED 同时是应该被加载
 */
export function getAppsToUnmount() {
    return APPS.filter(notSkip).filter(isActive).filter(shouldntBeActivity)
}

/**
 * @function 获取需要被挂载的app
 * 当前app 的状态不是SKIP_BECAUSE_BROKEN, 已经加载过，没有被激活， 同时是应该挂载
 */
export function getAppsTomount() {
    return APPS.filter(notSkip).filter(isLoaded).filter(isntActive).filter(shouldBeActivity)
}

/**
 * @function 获取需要被加载的app
 * 当前app 的状态不是SKIP_BECAUSE_BROKEN, 不是LOAD_ERROR，是NOT_LOADED 同时是应该被加载
 */
export function getMountedApps() {
    return APPS.filter(app => {
        return isActive(app)
    })
}