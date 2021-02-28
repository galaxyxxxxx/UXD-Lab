const util = require('../../util/utils')
const db = wx.cloud.database({
  env: 'lab-4g6ny9jc3e33c759'
});
const lab = db.collection('lab')
const _ = db.command

Page({

  data: {

    openid: '',
    nickName: '',
    title: '',
    date: '',  //年月日的日期
    dateRaw: '',  //用于与当天日期比较的日期
    dateSelect: '',  //好看的日期

    timeBegin: '13:00',
    timeEnd: '14:00',

    minHour: 9,
    maxHour: 18,
    filter(type, options) {
      if (type === 'minute') {
        return options.filter((option) => option % 15 === 0);
      }
      return options;
    },
    
    datePicker: false,
    timePicker1: false,
    timePicker2: false,

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 

  },
  
  onShow: function(){
    this.setTitle()
    this.setDate()
  },

  setTitle: function(){
    let that = this
    let nickName = wx.getStorageSync('nickName')
    that.setData({
      nickName
    })
  },

  setDate: function(){
    let that = this
    let now = new Date()
    let todayDate = new Date(now.getFullYear() + '/' + (now.getMonth()+1) + '/' + now.getDate())
    let nowHour = now.getHours()
    let reserveDate = todayDate

    // 当今日日期已过18点时  可从次日开始预定会议
    if (nowHour >= 18){
      reserveDate = new Date(todayDate.getTime() + 24 * 60 * 60 * 1000)
      that.setData({
        timeBegin: "9:00",
        timeEnd: "10:00"
      })
    }else{
      reserveDate = todayDate
      that.setData({
        timeBegin: nowHour + ":00",
        timeEnd: (nowHour+1) + ":00"
      })
    }
    
    new Promise((resolve,reject) => {
      resolve(util.dateFormat(reserveDate))
    }).then((today)=>{
      that.setData({
        date: reserveDate,
        dateRaw: reserveDate.getTime(),
        dateSelect: today
      })
    })
  },

  // 将字符串的time转换成数字型  便于compare time
  timeTrans(t){
    return parseInt(t.split(':')[0]) * 60 + parseInt(t.split(':')[1]) - 1
  },
  clickCreate(e){
    // 检查时间段是否有重叠

    let timeBegin = this.data.timeBegin
    let timeEnd = this.data.timeEnd

    let check = new Promise((resolve, reject)=>{
      lab.where({
        date : this.data.date
      }).get().then((res)=>{

        

        let checkTime = (cur)=>{
          console.log(cur)
          let max = [this.timeTrans(cur.timeBegin), this.timeTrans(timeBegin)]
          let min = [this.timeTrans(cur.timeEnd), this.timeTrans(timeEnd)]
          if(Math.max.apply(null,max)<=Math.min.apply(null,min)){
            return false;
          }else{
            return true
          }
        }

        if(res.data.every(checkTime)){
          resolve();
        }else{
          wx.showToast({
            title: '该时段不可用',
            icon: 'fail'
          })
        }  
      })
    })

    check.then((res)=>{
      this.create()
    })
  },

  create(e){
    let that = this
    new Promise((resolve, reject) => {
      let that = this
      lab.add({
        data: {
          title: that.data.title || that.data.nickName+'的会议',
          host: wx.getStorageSync('nickName'),
          date: that.data.date,
          dateRaw: that.data.dateRaw,
          timeBegin: that.data.timeBegin,
          timeEnd: that.data.timeEnd,
          duration: parseInt(that.data.timeEnd.split(':')[0]) + parseInt(that.data.timeEnd.split(':')[1]) / 15 * 0.25 - (parseInt(that.data.timeBegin.split(':')[0]) + parseInt(that.data.timeBegin.split(':')[1]) / 15 * 0.25),
          top: ((parseInt(that.data.timeBegin.split(':')[0])) - 9) * 4  + parseInt(that.data.timeBegin.split(':')[1]) / 15
        },
        success: function (res) {
            resolve();
        }
      });
  }).then(() => {
      wx.showToast({
          title: '已成功发布',
          icon: 'success',
          duration: 3000
      });
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        });
      }, 1000);
  });
  },

  cancel(e){
    wx.navigateBack({
      delta: 1,
    })
  },

  // 日期选择
  dateClick(e){
    if(this.datePicker){
      this.onCloseCalendar();
    }else{
      this.onDisplayCalendar();
    }
  },

  onDisplayCalendar() {
    this.setData({ datePicker: true });
  },

  onCloseCalendar(e){
    this.setData({ datePicker: false });
  },

  onConfirmCalendar(e){
    console.log(e.detail)
    let date = e.detail
    let dateRaw = date.getTime()
    let dateSelect = util.dateFormat(e.detail)

    this.setData({
      datePicker: false,
      dateRaw: dateRaw,
      date: date,
      dateSelect: dateSelect
    });
  },

  // 开始时间选择
  timeClick1(e){
    if(this.timePicker1){
      this.onCloseTimePicker1();
    }else{
      this.onDisplayTimePicker1();
    }
  },

  onDisplayTimePicker1() {
    this.setData({ timePicker1: true });
  },

  onCloseTimePicker1(e){
    this.setData({ timePicker1: false });
  },

  // 改变开始时间时  也改变了结束时间  
  onConfirmTimePicker1(e){
    let begin = e.detail
    let beginHour = parseInt(e.detail.split(":")[0])
    let beginMinite = e.detail.split(":")[1]
    console.log(beginHour,beginMinite)
    let end = (beginHour + 1) + ":" + (beginMinite)
    console.log(end)
    this.setData({
      timePicker1: false,
      timeBegin: begin,
      timeEnd: end
    });
  },

  // 结束时间选择
  timeClick2(e){
    if(this.timePicker2){
      this.onCloseTimePicker2();
    }else{
      this.onDisplayTimePicker2();
    }
  },

  onDisplayTimePicker2() {
    this.setData({ timePicker2: true });
  },

  onCloseTimePicker2(e){
    this.setData({ timePicker2: false });
  },

  // 首先检查这个时间是否是晚于开始时间的
  onConfirmTimePicker2(e){
    let begin = this.data.timeBegin
    let beginHour = parseInt(begin.split(":")[0])
    let beginMinite = parseInt(begin.split(":")[1])

    let end = e.detail
    let endHour = parseInt(e.detail.split(":")[0])
    let endMinite = parseInt(e.detail.split(":")[1])

    let check = ((beginHour * 60 + beginMinite) < (endHour * 60 + endMinite)) ? true : false

    console.log(check)
    if(check){
      wx.hideToast({
        success: (res) => {
          this.setData({
            timePicker2: false,
            timeEnd: end
          });
        },
      })
      
    }else{
      wx.showToast({
        title: '晚于开始时间',
        icon: 'error',
        duration: 3000
    });
    }

    
  },
  
  // 创建与撤销
  

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})