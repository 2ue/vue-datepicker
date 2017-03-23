<template>
    <div id="app" class="content">
        <div class="datePikcerInputBoX">
            <input type="text" :value="chooseReslt"  class="chooseTimeInput" @mouseout="hideDatePicker()" @click="showDatePicker" :year="chooseDate.year" :month="chooseDate.month" :day="chooseDate.day" readonly>
            <span @click="clearChoosedTime" class="f_disselected">清空</span>
        </div>
        <div class="datePicker f_disselected" @mouseover="clearTimeWarpQue" @mouseout="hideDatePicker" v-if="showDatePickerBox">
            <div class="datePickerHead" @mouseout="hideChooseBox()" @mouseover="clearTimeQue()">
                <span @click="preMonth()" class="changeMomth">&lt;</span>
                <span @click="showChooseYearBox()" class="chooseYearMonth">{{ chooseDate.year }}</span>
                <span @click="showChooseMonthBox()" class="chooseYearMonth">{{ chooseDate.month }}</span>
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
                        :class="{ 'u_cf30': item.color, 'hasHover': item.isCurMonth, 'isToday': item.isChoosed && item.isCurMonth}"
                        :title="item.isChoosed"
                        v-for="(item,index) in days"
                        @click="chooseDay(index)
                    ">{{ item.dayNum }}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>

    const curDate = new Date();
    const curYear = curDate.getFullYear();
    const curMonth = curDate.getMonth() + 1;
    const curDay = curDate.getDate();

    export default {
        name: 'app',
        data () {
            return {
                chooseReslt: '请选择时间',
                chooseDate: {
                    year: curYear,
                    month: curMonth,
                    day: curDay
                },
                items: [1,2,3,4,5,6,7,8,9,10,11,12], //选择年月存放数据
                days: getDayArry({year: curYear,month: curMonth,day:curDay}),
                showChooseBox: false, //选择年月容器状态
                showDatePickerBox: false, //日历容器
                chooseBoxTimer: '', //定时器
                datePickerBoxTimer: '', //定时器
                chooseType: false, //选择年月界定，false为月(month)，true为年(year)
                weekdayArry: ['日','一','二','三','四','五','六'],
                YearChangeSyboml: '' //切换年月时标记
            }
        },
        // computed: {
        //     items: function () {
        //         var startNum, endNum, tempArry = [];
        //         if(this.chooseType){
        //             startNum = this.chooseDate.year - 4;
        //             endNum = this.chooseDate.year + 4;
        //         }else{
        //             startNum = 1;
        //             endNum = 12;
        //         }
        //         for(var i = startNum; i <= endNum; i++){
        //             tempArry.push(i);
        //         };
        //         this.items = [];
        //         console.trace(tempArry);
        //         return tempArry;
        //     }
        // },
        watch: {
            chooseDate: {
                handler: function(val,oldVal){
                    this.days = getDayArry(this.chooseDate,this.chooseReslt);
                    console.log(this.days)
                },
                deep: true
            }
        },
        methods: {
            //----------- 选择年月面板 START ---------------
            showChooseYearBox: function() {//显示选择年
                this.YearChangeSyboml = this.chooseDate.year;
                this.showChooseBox = true;
                this.chooseType = true;
                this.getItems();
            },
            showChooseMonthBox: function() {//显示选择月
                this.showChooseBox = true;
                this.chooseType = false;
                this.getItems();
            },
            hideChooseBox: function(time) {//隐藏选择年月
                const self = this;
                const t = time || 50;
                self.chooseBoxTimer = setTimeout(function () {
                    self.showChooseBox = false;
                }, t);
            },
            clearTimeQue: function() {//清除队列
                clearTimeout(this.chooseBoxTimer);
            },
            chooseYearMonth: function(type,value) {//选择年月
                const chooseType = !!type ? 'year' : 'month';
                this.chooseDate[chooseType] = value || this.chooseDate[chooseType];
                this.hideChooseBox();
            },
            getItems: function(){
                let startNum, endNum, tempArry = [];
                if(this.chooseType){
                    startNum = this.YearChangeSyboml - 4;
                    endNum = +this.YearChangeSyboml + 4;
                }else{
                    startNum = 1;
                    endNum = 12;
                }
                for(let i = startNum; i <= endNum; i++){
                    tempArry.push(i);
                };
                this.items = tempArry;
                console.trace(tempArry);
            },
            //----------- 选择年月面板 END ---------------
            //
            //----------- 时间选择面板 START ---------------
            showDatePicker: function(event) {//显示选择日期
                const value = event.target.value;
                const choosedDayArry = value.indexOf('-') > 0 ? value.split('-') : [curYear, curMonth, curDay];
                this.showDatePickerBox = true;
                this.chooseDate = {
                    year: choosedDayArry[0],
                    month: choosedDayArry[1],
                    day: choosedDayArry[2],
                };
            },
            hideDatePicker: function(time) {
                const self = this;
                const t = time || 50;
                self.datePickerBoxTimer = setTimeout(function () {
                    self.showDatePickerBox = false;
                }, t)
            },
            clearTimeWarpQue: function() {
                clearTimeout(this.datePickerBoxTimer);
            },
            //----------- 时间选择面板 END ---------------
            //
            //----------- 切换月 START ---------------
            preMonth: function() {//上一月
                const isFirstMonth = this.chooseDate.month == 1;
                this.chooseDate.month = isFirstMonth ? 12 : this.chooseDate.month - 1;
                this.chooseDate.year = isFirstMonth ? this.chooseDate.year - 1 : this.chooseDate.year;
            },
            nxtMonth: function() {//下一月
                const isLastMonth = this.chooseDate.month == 12;
                this.chooseDate.month = isLastMonth ? 1 : +this.chooseDate.month + 1;
                this.chooseDate.year = isLastMonth ? +this.chooseDate.year + 1 : this.chooseDate.year;
            },
            //----------- 切换月 END ---------------
            changeYearPagePre: function() {//年翻页：上一页
                this.YearChangeSyboml = this.YearChangeSyboml - 12;
                this.getItems();
            },
            changeYearPageNxt: function() {//年翻页：下一页
                this.YearChangeSyboml = +this.YearChangeSyboml + 12;
                this.getItems();
            },
            chooseDay: function(index) {//选择天
                if(!!!index && index != 0) return;
                if(!this.days[index].isCurMonth) return;
                this.days[index].color = !this.days[index].color;
                this.chooseDate.day = this.days[index].dayNum;
                console.log(this.chooseDate)
                this.showDatePickerBox = false;
                if(!this.chooseDate.year || !this.chooseDate.month || !this.chooseDate.day){
                    this.chooseReslt = '请选择时间';
                }else{
                    this.chooseReslt = this.chooseDate.year + '-' + this.chooseDate.month + '-' + this.chooseDate.day;
                }
            },
            //清空选择
            clearChoosedTime: function(){
                this.chooseDate.year = '';
                this.chooseDate.month = '';
                this.chooseDate.day = '';
            }
        }
    };
    //-------------------------月份数组拼接 START------------------------------------
    function getDayArry(showDate, chooseReslt) {
        
        const year = showDate.year;
        const month = showDate.month;
        const day = showDate.day;
        const chooseDateArry = !!chooseReslt && chooseReslt.indexOf('-') >= 0 ? chooseReslt.split('-') : [curYear,curMonth,curDay];

        //获取当前月天数数组
        const curMonthDays = getMonthDays(month);
        const preMonthDays = getMonthDays(month == 0 ? 11 : month - 1);
        // const nxtMonthDays = getMonthDays(month == 11 ? 0 : month + 1);
        const firstDay = getDayInWeek(year, (month - 1), 1); //当前月第一天是星期几
        const allDays =  Math.ceil((+curMonthDays + firstDay) / 7) * 7;
        
        let dayArry = [];

        for(let i = 1; i <= allDays; i++){

            const isPre = i <= firstDay;
            const isNxt = i > (firstDay + curMonthDays);
            const isCurMonth = !isPre && !isNxt;
            const day = isPre ? preMonthDays - firstDay + i : isNxt ? i - firstDay - curMonthDays : i - firstDay;

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
        const tempDate = new Date(2016, month, 0).getDate();
        return tempDate;
    };

    function getDayInWeek(year, month, day) {
        //返回某年某月某日是星期几
        if(!!!year || !!!month || !!!day || month - 1 < 0) return 0;
        const tempDate = new Date(year, month, day).getDay();
        return tempDate;
    };
    //-------------------------月份数组拼接 END------------------------------------
</script>

<style>
    @import url('./css/public.css');
    .pageBox{padding: 100px 0;width:100%;min-width: 500px;color: #999;}
    .content{margin: 0 auto;width:360px;}
    .datePikcerInputBoX{position: relative;width: 100%;background: #fff;}
    .chooseTimeInput{width:100%;box-sizing: border-box;height:35px;line-height:35px;border: 1px solid #9D94B0;font-size: 14px;text-indent: 1em;cursor: pointer;}
    .datePikcerInputBoX span{float: right;position: absolute;top: 0;right: 0;display: inline-block;height: 35px;line-height: 35px;padding: 0 10px;border-left: 1px solid #9D94B0;cursor: pointer;}
    .datePicker{margin-top:10px;}
    .datePicker{width:350px;border: 1px solid #9D94B0;padding: 4px;background: #fff;}
    .datePickerHead{/*height: 30px;*/color: #999;text-align: center;width: 100%;position: relative;margin-bottom: 10px;border-bottom: 1px solid #9D94B0;cursor: pointer;font-size: 0;}
    .datePickerHead > span{display: inline-block;height: 50px;line-height: 50px;font-size: 16px;}
    .datePickerHead > span:hover{color: #333;}
    .datePickerHead .chooseYearMonth{width: 150px;}
    .datePickerHead .changeMomth{font-family: aril;font-weight: bold;width: 25px;}
    .datePickerHead .chooseBox {width:150px;overflow: hidden;border: 1px solid #9D94B0;background: #fff;position: absolute;top:50px;left:175px;z-index: 99;color: #666;}
    .datePickerHead .chooseYearBox{left:25px;}
    .datePickerHead .chooseBox > span{display: inline-block;height: 30px;line-height: 30px;width:50px;font-size:12px;cursor: pointer;text-align: center;border-top:1px solid #eee;border-left:1px solid #9D94B0;margin: -1px 0 0 -1px;}
    .datePickerHead .yearPage span{display: inline-block;height: 30px;line-height: 30px;width:50%;cursor: pointer;text-align: center;border-bottom:1px solid #9D94B0;font-size: 16px;font-family: aril;color: #333;}
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