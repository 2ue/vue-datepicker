<template>
    <div class="date_panel f_disselected" 
    v-if="panelStatus" 
    @mouseover="clearPanelTimer" 
    @mouseout="hidePanel"
    @click="hidePickerNow">
        <div class="panel_head" >
            <span class="change_month" @click="changeMonth(-1)">&lt;</span>
            <span class="choose_btn" @click="showPicker" @mouseout="hidePicker" choosetype="y">{{panelChoosed.year}}</span>
            <span class="choose_btn" @click="showPicker" @mouseout="hidePicker" choosetype="m">{{panelChoosed.month}}</span>
            <span class="change_month" @click="changeMonth(1)">&gt;</span>
            <div class="choose_box"
                :class="{'choose_year_box':changeType === 'y'}" 
                @mouseover="clearPickerTimer" 
                @mouseout="hidePicker" 
                v-show="showChooseBox">
                <p class="change_year" v-if="changeType === 'y'">
                    <span @click="changeYearPage(-8)">&lt;</span>
                    <span @click="changeYearPage(8)">&gt;</span>
                </p>
                <span class="item" 
                    v-for="(item,index) in items" 
                    @click="chooseYearMonth(item)"
                >{{item}}</span>
            </div>
        </div>
        <div class="panel_body">
            <p class="weekday_box"><span v-for="(weekday,index) in weekdayArry" class="weekday">{{ weekday }}</span></p>
            <div class="day_box">
                <span v-for="(item,index) in days" 
                :class="{'crn_month':item.isCurMonth,'only_day': item.isChoosed && item.isCurMonth}"
                @click="choosDay(item.dayNum,item.isCurMonth)">{{ item.dayNum }}</span>
            </div>
        </div>
    </div>
</template>
<script>

var curDate = new Date();
var curYear = curDate.getFullYear();
var curMonth = curDate.getMonth() + 1;
var curDay = curDate.getDate();

export default {
    name: 'dataPanel',
    props: ['panelStatus','clearPanelTimer','hidePanel','choosed'],
    data () {
        return {
            weekdayArry: ['日','一','二','三','四','五','六'],
            showChooseBox: false,
            changeYear: '',
            //渲染切换年或者月的标记，''表示不渲染，'y'表示年，‘m’表示切换月
            changeType: '',
            panelChoosed:{
                year: this.choosed.year ? this.choosed.year : curYear,
                month: this.choosed.month ? this.choosed.month : curMonth
            },
            hidePickerTimer: ''
        }
    },
    computed: {
        days: function () {
            return getDayArry(this.panelChoosed,this.choosed)
        },
        items: function () {
            var type = this.changeType;
            var reslt = [];
            var start = 0, end = 0;

            if(type === 'y' && this.changeYear) {
                start = this.changeYear - 4;
                end = this.changeYear + 4;
            };
            if(type === 'm') {
                start = 1;
                end = 12;
            };
            for(var i = start; i <= end; i++){
                reslt.push(i);
            };
            return reslt;
        }
    },
    methods: {
        changeMonth: function (_val) {
            var _self = this;
            if(!_val || isNaN(_val)) return;
            var month = _self.panelChoosed.month + _val;
            switch (month) {
                case (0):{
                    _self.panelChoosed.year = _self.panelChoosed.year - 1;
                    _self.panelChoosed.month = 12;
                    break;
                };
                case (13):{
                    _self.panelChoosed.year = _self.panelChoosed.year + 1;
                    _self.panelChoosed.month = 1;
                    break;
                };
                default:{
                    _self.panelChoosed.month = _self.panelChoosed.month + _val;
                    break;
                }
            }
        },
        showPicker: function(event){
            event.stopPropagation();
            var type = event.target.getAttribute('choosetype');
            this.clearPickerTimer();
            this.changeType = type ? type : 'm';
            this.changeYear = this.panelChoosed.year;
            this.showChooseBox = true;
        },
        hidePicker: function(){
            var _self = this;
            _self.clearPickerTimer();
            _self.hidePickerTimer = setTimeout(function(){
                _self.showChooseBox = false;
            }, 500)
        },
        hidePickerNow: function(){
            this.clearPickerTimer();
            this.showChooseBox = false;
        },
        clearPickerTimer: function(){
            clearTimeout(this.hidePickerTimer);
        },
        chooseYearMonth: function(_val){
            this.changeType === 'y' ? this.panelChoosed.year = _val : this.panelChoosed.month = _val;
            this.showChooseBox = false;
        },
        changeYearPage: function(_val){
            this.changeYear = this.changeYear + _val;
        },
        choosDay: function (_day,_isCurMonth) {
            if(!_isCurMonth) return;
            this.choosed.year = this.panelChoosed.year;
            this.choosed.month = this.panelChoosed.month;
            this.choosed.day = _day;
            this.hidePanel(4)
        }
    }
};
//-------------------------月份数组拼接 START------------------------------------
function getDayArry(showDate, chooseReslt) {
    
    var year = showDate.year;
    var month = showDate.month;
    var day = showDate.day;
    var chooseDateArry = chooseReslt.year && chooseReslt.month && chooseReslt.day ? [chooseReslt.year,chooseReslt.month,chooseReslt.day] : [curYear,curMonth,curDay];
    //获取当前月天数数组
    var curMonthDays = getMonthDays(month);
    var preMonthDays = getMonthDays(month == 0 ? 11 : month - 1);
    var firstDay = getDayInWeek(year, (month - 1), 1); //当前月第一天是星期几
    var allDays =  Math.ceil((+curMonthDays + firstDay) / 7) * 7;
    
    let dayArry = [];

    for(let i = 1; i <= allDays; i++){

        var isPre = i <= firstDay;
        var isNxt = i > (firstDay + curMonthDays);
        var isCurMonth = !isPre && !isNxt;
        var day = isPre ? preMonthDays - firstDay + i : isNxt ? i - firstDay - curMonthDays : i - firstDay;

        dayArry.push({
            dayNum: day,
            isChoosed: (chooseDateArry[0] == year && chooseDateArry[1] == month && chooseDateArry[2] == (i - firstDay)),
            isSpecailDay: false,
            isCurMonth: isCurMonth,
            color: false
        })
    };
    return dayArry;

};

function getMonthDays(month) {
    //获取某年某月有多少天
    if(!!!month) return;
    var tempDate = new Date(2016, month, 0).getDate();
    return tempDate;
};

function getDayInWeek(year, month, day) {
    //返回某年某月某日是星期几
    if(!!!year || !!!month || !!!day || month - 1 < 0) return 0;
    var tempDate = new Date(year, month, day).getDay();
    return tempDate;
};
//-------------------------月份数组拼接 END------------------------------------
</script>
<style lang="less" scoped>
.date_panel {
    margin-top: 10px;
}

.date_panel {
    width: 350px;
    border: 1px solid #9D94B0;
    padding: 4px;
    background: #fff;
}

.panel_head{
    position: relative;
    height: 40px;
    line-height: 40px;
    font-size: 0;
    margin-bottom: 5px;

    span{
        display: inline-block;
        font-size: 16px;
        color: #666;
        cursor: pointer;
        &:hover{
            background: #F0F0F0;
        }
    }
    .change_month{
        width:50px;
    }
    .choose_btn{
        width: 120px;
    }
}

.choose_box{
    position: absolute;
    top:45px;
    left: 175px;
    width: 120px;
    background: #fff;    
    border: 1px solid #9D94B0;
    font-size: 0;
    line-height: 25px;
    span{
        display: inline-block;
        width: 40px;
        height: 25px;
        font-size: 12px;
    }
    .change_year span{
        width: 50%;
        font-size: 16px;
    }
    &.choose_year_box{
        left: 55px;
    }
}


.panel_body{
    border-top: 1px solid #9D94B0;
    font-size: 0;
    span{
        display: inline-block;
        width:50px;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        color: #666;
    }
    span:nth-child(7n),
    span:nth-child(7n+1){
        color: #f30;
    }
    .day_box span{
        width:40px;
        margin:5px;
        border-radius: 3px;
        cursor: pointer;
    }
    .day_box span:not(.crn_month){
        color: #999;
        cursor: inherit;
    }
    .day_box .only_day,.crn_month:hover{
        background: #141414;
        color: #fff;
    }
}
</style>

