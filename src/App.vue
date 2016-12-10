<template>
    <div id="app">
        <div class="datePikcerInputBoX">
            <input type="text" :value="message"  class="chooseTimeInput" @mouseout="hideDatePicker()" @click="showDatePicker" :year="year" :month="month" :day="hasDay" readonly>
            <span @click="clearChoosedTime">清空</span>
        </div>
        <div class="datePicker f_disselected" @mouseover="clearTimeWarpQue" @mouseout="hideDatePicker" v-if="showDatePickerBox">
            <div class="datePickerHead" @mouseout="hideChooseBox()" @mouseover="clearTimeQue()">
                <span @click="preMonth()" class="changeMomth">&lt;</span>
                <span @click="showChooseYearBox()" class="chooseYearMonth">{{ year }}</span>
                <span @click="showChooseMonthBox()" class="chooseYearMonth">{{ month }}</span>
                <span @click="nxtMonth()" class="changeMomth">&gt;</span>
                <!-- <Choosebox></Choosebox> -->
                <div class="chooseBox"
                    :class="{'chooseYearBox':chooseType}"
                    v-show="showChooseBox">
                    <p class="yearPage" v-if="chooseType">
                        <span @click="changeYearPagePre()">&lt;</span>
                        <span @click="changeYearPageNxt()">&gt;</span>
                    </p>
                    <span class="item"
                        v-for="(item,index) in items"
                        @mouseover="clearTimeQue()"
                        @mouseout.stop="hideChooseBox(500)"
                        @click="chooseYearMonth(chooseType,item)"
                    >{{item}}</span>
                </div>
            </div>
            <div class="datePickerBody">
                <p><span v-for="(weekday,index) in weekdayArry" class="weekday">{{ weekday }}</span></p>
                <p class="datePickerNum">
                    <span
                        class="day"
                        :class="{ 'u_cf30': item.color, 'hasHover': item.isCurMonth, 'isToday': item.isToday || item.isChoosed}"
                        v-for="(item,index) in days"
                        @click="chooseDay(index)
                    ">{{ item.dayNum }}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'app',
        data () {
            return {
                message: '请选择时间',
                year: curYear,
                month: curMonth + 1,
                hasDay:'',
                items: [], //选择年月存放数据
                days:getDayArry(curYear, curMonth + 1),
                showChooseBox: false, //选择年月容器状态
                showDatePickerBox: false, //日历容器
                chooseBoxTimer: '', //定时器
                datePickerBoxTimer: '', //定时器
                chooseType: false, //选择年月界定，false为月(month)，true为年(year)
                weekdayArry: ['日','一','二','三','四','五','六'],
                YearChangeSyboml: curYear //切换年月时标记
            }
        },
        computed: {
            days: function () {//生成当前月的日期数据
                const self = this;
                return getDayArry(self.year, self.month, this.hasDay);
            },
            items: function () {
                const self = this;
                const tempArry = [];
                const startNum = self.chooseType ? +self.YearChangeSyboml - 4 : 1;
                const endNum = self.chooseType ? +self.YearChangeSyboml + 4 : 12;
                for(var i = startNum; i <= endNum; i++){
                    tempArry.push(i);
                };
                self.items = [];
                return tempArry;
            }
        },
        methods: {
            //----------- 选择年月面板 START ---------------
            showChooseYearBox: function () {//显示选择年
                this.YearChangeSyboml = this.year;
                this.showChooseBox = true;
                this.items = [];
                this.chooseType = true;
            },
            showChooseMonthBox: function () {//显示选择月
                this.showChooseBox = true;
                this.items = [];
                this.chooseType = false;
            },
            hideChooseBox: function (time) {//隐藏选择年月
                const self = this;
                const t = time || 300;
                self.chooseBoxTimer = setTimeout(function () {
                    self.showChooseBox = false;
                }, t);
            },
            clearTimeQue: function () {//清除队列
                clearTimeout(this.chooseBoxTimer);
            },
            chooseYearMonth: function (type,value) {//选择年月
                const chooseType = !!type ? 'year' : 'month';
                this[chooseType] = value || this[chooseType];
                this.hideChooseBox(1);
            },
            //----------- 选择年月面板 END ---------------
            //
            //----------- 时间选择面板 START ---------------
            showDatePicker: function (event) {//显示选择年
                const value = event.target.value;
                const choosedDayArry = value.indexOf('-') > 0 ? value.split('-') : [this.year, this.month, this.hasDay];
                this.showDatePickerBox = true;
                this.year = choosedDayArry[0];
                this.month = choosedDayArry[1];
                this.hasDay = choosedDayArry[2];
            },
            hideDatePicker: function (time) {
                const self = this;
                const t = time || 300;
                self.datePickerBoxTimer = setTimeout(function () {
                    self.showDatePickerBox = false;
                }, t)
            },
            clearTimeWarpQue: function () {
                clearTimeout(this.datePickerBoxTimer);
            },
            //----------- 时间选择面板 END ---------------
            //
            //----------- 切换月 START ---------------
            preMonth: function () {//上一月
                const isFirstMonth = this.month == 1;
                this.month = isFirstMonth ? 12 : this.month - 1;
                this.year = isFirstMonth ? this.year - 1 : this.year;
            },
            nxtMonth: function () {//下一月
                const isLastMonth = this.month == 12;
                this.month = isLastMonth ? 1 : this.month + 1;
                this.year = isLastMonth ? this.year + 1 : this.year;
            },
            //----------- 切换月 END ---------------
            changeYearPagePre: function () {//年翻页：上一页
                this.YearChangeSyboml = this.YearChangeSyboml - 12;
            },
            changeYearPageNxt: function () {//年翻页：下一页
                this.YearChangeSyboml = this.YearChangeSyboml + 12;
            },
            chooseDay: function (index) {//选择天
                if(!!!index && index != 0) return;
                if(!this.days[index].isCurMonth) return;
                this.days[index].color = !this.days[index].color;
                this.message = this.year + '-' + this.month + '-' + this.days[index].dayNum;
                this.hasDay = this.days[index].dayNum;
                this.showDatePickerBox = false;
            },
            //清空选择
            clearChoosedTime: function(){
                this.message = '请选择时间';
                this.year = curYear;
                this.month = curMonth + 1;
                this.hasDay = '';
            }
        }
    };
    //-------------------------月份数组拼接 START------------------------------------
    var curDate = new Date();
    var curYear = curDate.getFullYear();
    var curMonth = curDate.getMonth();
    var curDay = curDate.getDate();
    function getDayArry(year, month, hasDay) {
        //获取当前月天数数组
        var curMonthDays = getMonthDays(month);
        var preMonthDays = getMonthDays(month == 0 ? 11 : month - 1);
        // var nxtMonthDays = getMonthDays(month == 11 ? 0 : month + 1);
        var firstDay = getDayInWeek(year, (month - 1), 1); //当前月第一天是星期几
        var allDays =  Math.ceil((curMonthDays + 4) / 7) * 7;
        var dayArry = [];
        for(var i = 1; i <= allDays; i++){
            var isPre = i <= firstDay;
            var isNxt = i > (firstDay + curMonthDays);
            var isCurMonth = !isPre && !isNxt;
            var day = isPre ? preMonthDays - firstDay + i : isNxt ? i - firstDay - curMonthDays : i - firstDay;
            dayArry.push({
                dayNum: day,
                isToday: !hasDay ? curDay == (i - firstDay) && curMonth == (month - 1) && curYear == year : false && isCurMonth,
                isChoosed: !!hasDay && hasDay == day && isCurMonth,
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

<style>
    @import url('css/public.css');
    .datePikcerInputBoX{position: relative;width: 360px;}
    .chooseTimeInput{width:360px;height:35px;line-height:35px;border: 1px solid #eee;font-size: 14px;text-indent: 1em;cursor: pointer;}
    .datePikcerInputBoX span{position: absolute;top: 0;right: 0;display: inline-block;height: 100%;line-height: 35px;padding: 0 10px;border-left: 1px solid #eee;cursor: pointer;}
    .datePicker{margin-top:10px;}
    .pageBox{margin: 100px;}
    .datePicker{width:350px;border: 1px solid #eee;padding: 5px;}
    .datePickerHead{/*height: 30px;*/color: #999;text-align: center;width: 100%;position: relative;margin-bottom: 10px;border-bottom: 1px solid #eee;cursor: pointer;font-size: 0;}
    .datePickerHead > span{display: inline-block;height: 50px;line-height: 50px;font-size: 16px;}
    .datePickerHead > span:hover{color: #333;}
    .datePickerHead .chooseYearMonth{width: 150px;}
    .datePickerHead .changeMomth{font-family: aril;font-weight: bold;width: 25px;}
    .datePickerHead .chooseBox {width:150px;overflow: hidden;border: 1px solid #eee;background: #fff;position: absolute;top:50px;left:175px;z-index: 99;color: #666;}
    .datePickerHead .chooseYearBox{left:25px;}
    .datePickerHead .chooseBox > span{display: inline-block;height: 30px;line-height: 30px;width:50px;font-size:12px;cursor: pointer;text-align: center;border-top:1px solid #eee;border-left:1px solid #eee;margin: -1px 0 0 -1px;}
    .datePickerHead .yearPage span{display: inline-block;height: 30px;line-height: 30px;width:72px;cursor: pointer;text-align: center;border-bottom:1px solid #eee;font-size: 16px;font-family: aril;color: #333;}
    .datePickerHead .chooseBox span:hover{background: #f8f8f8;color: #333;}
    .datePickerBody{font-size: 0;}
    .datePickerBody p{margin-left:-5px;}
    .datePickerBody span{display: inline-block;width:45px;font-size: 12px;margin-bottom: 5px;text-align: center;border-radius: 5px;background: #fff;margin-left: 5px;height: 25px;line-height: 25px;color: #999;}
    .datePickerBody .weekday{color: #666;}
    .datePickerBody .weekday:nth-child(7n+1),
    .datePickerBody .weekday:nth-child(7n),
    .datePickerBody .hasHover:nth-child(7n+1),
    .datePickerBody .hasHover:nth-child(7n){color: #f30;}
    .datePickerBody .hasHover{background: #FAFAFA;color: #666;}
    .datePickerBody .hasHover:hover{background: #B2B2B2;color: #fff;cursor: pointer;}
    .datePickerBody .isToday,
    .datePickerBody .hasHover.u_cf30{color: #fff;background: #8585AD;}
</style>
