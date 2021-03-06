# vprincetab

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### 引用
```
import VPrinceTab from 'vprincetab'
import 'vprincetab/lib/vprincetab.css'
```

### 参数：
```
btnLabel: { // 添加按钮的文字
  type: String,
  default: '添加'
},
customAddBtn: { // 是否自定义下拉菜单
    type: Boolean,
    default: false
}
btnChildrenLabel: { // 若不是自定义下拉菜单，默认下拉菜单按钮为一个li,此项为按钮文字
  type: String,
  default: '添加信息'
},
tabsList: { // tabs列表
  type: Array,
  default: () => []
},
tabId: { // 默认点开的tab
  type: String,
  default: ''
}
tabWidth: { // tab的宽度(最小50)
    type: String,
    default: "148px"
}
```
### 事件：
```
handleClickCurrentTab：当前点击的tab，参数为当前tab的信息与index。 --this.$emit('handleClickCurrentTab', item, index);
addItem： 添加tab方法
```

### slot
```
name="left-btn"： tab出现滚动条时向左滑动按钮
name="right-btn"： tab出现滚动条时右滑动按钮
name="customAddBtn"： 自定义添加按钮
name="add-menu"： 自定义点击按钮后的下拉菜单
```
#### tips

```
无论customAddBtn是否为true，自定义添加按钮的slot的name一直为customAddBtn
```
[GitHub地址](https://github.com/wzj19930304/vprincetab)
