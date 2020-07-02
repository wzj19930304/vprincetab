// 导入组件，组件必须声明 name
import PrinceTab from './tab'

// 为组件提供 install 安装方法，供按需引入
PrinceTab.install = function (Vue) {
    Vue.component(PrinceTab.name, PrinceTab)
}

// 默认导出组件
export default PrinceTab
