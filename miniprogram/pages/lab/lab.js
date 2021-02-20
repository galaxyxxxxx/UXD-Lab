const util = require('../../util/utils')
const db = wx.cloud.database({
  env: 'lab-4g6ny9jc3e33c759'
});
const lab = db.collection('lab')
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {

    openid: '',
    title: '',
    date: '',  //年月日的日期
    dateRaw: '',  //用于与当天日期比较的日期
    dateSelect: '',  //好看的日期
    timeBegin: '13:00',
    timeEnd: '14:00',

    currentDate: '12:00',
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

    member:[{
      avatar: '1',
      name: 'Hi'
    },{
      avatar: '1',
      name: 'Hi'
    },{
      avatar: '1',
      name: 'Hi'
    }]
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let that = this
    this.setData({
      openid: wx.getStorageSync('openid')
    })
    new Promise((resolve,reject) => {
      resolve(util.dateFormat(new Date()))
    }).then((today)=>{
      that.setData({
        date: new Date().toLocaleDateString(),
        dateRaw: new Date().getTime(),
        dateSelect: today
      })
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
    let dateRaw = e.detail.getTime()
    let date = e.detail.toLocaleDateString()
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
    console.log(e)
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

  onConfirmTimePicker1(e){
    let time = e.detail
    this.setData({
      timePicker1: false,
      timeBegin: time
    });
  },

  // 开始时间选择
  timeClick2(e){
    console.log(e)
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

  onConfirmTimePicker2(e){
    let time = e.detail
    this.setData({
      timePicker2: false,
      timeEnd: time
    });
  },
  
  // 创建与撤销
  create(e){
    let that = this
    new Promise((resolve, reject) => {
      let that = this
      lab.add({
        data: {
          title: 'LAB',
          host: wx.getStorageSync('nickName'),
          date: that.data.date,
          dateRaw: that.data.dateRaw,
          timeBegin: that.data.timeBegin,
          timeEnd: that.data.timeEnd,
          duration: parseInt(that.data.timeEnd.split(':')[0]) + parseInt(that.data.timeEnd.split(':')[1]) / 15 * 0.25 - (parseInt(that.data.timeBegin.split(':')[0]) + parseInt(that.data.timeBegin.split(':')[1]) / 15 * 0.25),
          top: (parseInt(that.data.timeBegin.split(':')[0]) - 9 + parseInt(that.data.timeBegin.split(':')[1]) / 15 * 0.25 ) * 118
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