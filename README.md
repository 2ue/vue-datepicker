# vue-datepicker

> 使用官方提供的vue-simple-template配置打包，写的一个简单的vue-datepicker。支持选择功能，功能比较简单，欢迎大家拍砖.

## 效果预览([demo](https://2ue.github.io/vue-datepicker/dist/#/Datepicker))

 ![vue-datepicker](https://github.com/2ue/vue-datepicker/blob/master/src/gifShow/vue-datepicker2.gif)

## 项目构建

``` bash
#全局安装vue,vue-cli,webpack，如以安装则跳过
npm install -g vue vue-cli webpack

# 安装依赖
npm install

# 运行项目=>localhost:8080
npm run dev

# 更多的构建信息请参考官网
```

## 更新记录

2017-5-10 22:01:41

- 合并到主分支
- 在devlop分支上重写
- 以前旧版本为v0.0

2017-3-23 16:21:27

- 修正选择日期后高亮错误问题
- 修正多出方法中计算时数字会被转化成字符串问题

2016-12-9 10:12:58

- 更新效果图
- 修正computed计算时数字会被转化成字符串问题
  ``` javascript
  const startNum = self.chooseType ? +self.YearChangeSyboml - 4 : 1;
  ```
2016-12-8 17:30:04

- 增加输入框唤醒日历
- 增加选择功能

2016-12-8 12:10:14

- 上传日历，简单展示版本

## 参考

待整理...