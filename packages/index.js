import vPrinceTab from './tab'

const components = [
    vPrinceTab
];

const install = function (Vue) {
// 判断是否安装
    if (install.installed) return;
// 遍历注册全局组件
    components.map(component => Vue.component(component.name, component))
};

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    install,
    vPrinceTab
}
