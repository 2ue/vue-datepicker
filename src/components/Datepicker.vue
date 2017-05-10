<template>
    <div class="date_picker">
        <div class="date_input_box">
            <input type="text" class="date_input" readonly :value="reslt" @click="showPanel" @mouseout="hidePanel">
            <span class="f_disselected" @click="clearChoosed">清空</span>
        </div>
        <datePanel :panelStatus="panelStatus" :clearPanelTimer="clearPanelTimer" :hidePanel="hidePanel" :choosed="choosed"></datePanel>
    </div>
</template>
<script>

import DatePanel from './DatePanel'
export default {
    name: 'datepicker',
    components:{ DatePanel },
    data () {
        return {
            //panel是否显示
            panelStatus: false,
            //一个setTimeout的储存器
            panelTimer:'',
            //保存选择的年月日
            choosed:{
                year: '',
                month: '',
                day: ''
            }
        }
    },
    computed: {
        //根据选择的年月计算最终显示的结果
        reslt:function () {
            var _self = this;
            var year = _self.choosed.year;
            var month = _self.choosed.month;
            var day = _self.choosed.day;
            return !year || !month || !day ? 'please choose date' : (year + '-' + month + '-' + day);
        }  
    },
    methods: {
        showPanel: function () {
            this.panelStatus = true;
        },
        hidePanel: function (_t) {
            var _self = this;
            _self.clearPanelTimer();
            var timer = !!_t && !isNaN(parseInt(_t)) ? parseInt(_t) : 500;
            _self.panelTimer = setTimeout(function() {
                _self.panelStatus = false;
            }, timer);
        },
        clearPanelTimer: function () {
            clearTimeout(this.panelTimer);
        },
        clearChoosed: function(){
            this.choosed = {
                year: '',
                month: '',
                day: ''
            }
        }
    }
}
</script>
<style lang="less" scoped>
.date_picker {
    width: 360px;
    margin: 20px auto;
}

.date_input_box {
    position: relative;
    width: 100%;
    background: #fff;

    span {
        display: inline-block;
        float: right;
        position: absolute;
        top: 0;
        right: 0;
        height: 35px;
        line-height: 35px;
        padding: 0 10px;
        border-left: 1px solid #9D94B0;
        cursor: pointer;
    }
}

.date_input {
    width: 100%;
    box-sizing: border-box;
    height: 35px;
    line-height: 35px;
    border: 1px solid #9D94B0;
    font-size: 14px;
    text-indent: 1em;
    cursor: pointer;
}
</style>

