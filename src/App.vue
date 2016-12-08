<template>
    <div id="app">
        <div class="datePicker f_disselected">
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
                        :class="{ 'u_cf30': item.color, 'hasHover': item.isCurMonth, 'isToday': item.isToday}"
                        v-for="(item,index) in days"
                        @click="chooseDay(index)
                    ">{{ item.dayNum }}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    // import Choosebox from 'chooseBox';
    export default {
        name: 'app',
        data () {
            return {
                year: curYear,
                month: curMonth + 1,
                items: [], //选择年月存放数据
                days:getDayArry(curYear, curMonth + 1),
                showChooseBox: false, //选择年月容器状态
                timer: '', //定时器
                chooseType: false, //选择年月界定，false为月(month)，true为年(year)
                weekdayArry: ['日','一','二','三','四','五','六'],
                YearChangeSyboml: curYear //切换年月时标记
            }
        },
        computed: {
            days: function () {//生成当前月的日期数据
                var self = this;
                return getDayArry(self.year, self.month);
            },
            items: function () {
                var self = this;
                var tempArry = [];
                var startNum = self.chooseType ? self.YearChangeSyboml - 4 : 1;
                var endNum = self.chooseType ? self.YearChangeSyboml + 4 : 12;
                for(var i = startNum; i <= endNum; i++){
                    tempArry.push(i);
                };
                self.items = [];
                return tempArry;
            }
        },
        methods: {
            showChooseYearBox: function () {//显示选择年
                var self = this;
                this.YearChangeSyboml = this.year;
                self.showChooseBox = true;
                self.items = [];
                self.chooseType = true;
            },
            showChooseMonthBox: function () {//显示选择月
                var self = this;
                self.showChooseBox = true;
                self.items = [];
                self.chooseType = false;
            },
            hideChooseBox: function (time) {//隐藏选择年月
                var self = this;
                var t = time || 300;
                self.timer = setTimeout(function () {
                    self.showChooseBox = false;
                }, t);
            },
            clearTimeQue: function () {//清除队列
                var self = this;
                clearTimeout(self.timer);
            },
            chooseYearMonth: function (type,value) {//选择年月
                var self = this;
                var chooseType = !!type ? 'year' : 'month';
                self[chooseType] = value || self[chooseType];
                this.hideChooseBox(1);
            },
            preMonth: function () {//上一月
                var isFirstMonth = this.month == 1;
                this.month = isFirstMonth ? 12 : this.month - 1;
                this.year = isFirstMonth ? this.year - 1 : this.year;
            },
            nxtMonth: function () {//下一月
                var isLastMonth = this.month == 12;
                this.month = isLastMonth ? 1 : this.month + 1;
                this.year = isLastMonth ? this.year + 1 : this.year;
            },
            changeYearPagePre: function () {//年翻页：上一页
                var self = this;
                self.YearChangeSyboml = self.YearChangeSyboml - 12;
            },
            changeYearPageNxt: function () {//年翻页：下一页
                var self = this;
                self.YearChangeSyboml = self.YearChangeSyboml + 12;
            },
            chooseDay: function (index) {//选择天
                if(!!!index && index != 0) return;
                this.days[index].color = !this.days[index].color;
            }
        }
    };
    //-------------------------月份数组拼接 START------------------------------------
    var curDate = new Date();
    var curYear = curDate.getFullYear();
    var curMonth = curDate.getMonth();
    var curDay = curDate.getDate();
    function getDayArry(year, month) {
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
            // var isToday = curDay == (i - firstDay);
            dayArry.push({
                dayNum: isPre ? preMonthDays - firstDay + i : isNxt ? i - firstDay - curMonthDays : i - firstDay,
                isToday: curDay == (i - firstDay) && curMonth == (month - 1) && curYear == year,
                isSpecailDay: false,
                isCurMonth: !isPre && !isNxt,
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
