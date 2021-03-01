const util = require('../../util/utils')
const db = wx.cloud.database({
  env: 'lab-4g6ny9jc3e33c759'
});
const lab = db.collection('lab')
const _ = db.command
Page({
  data: {
    openid: '',
    searchInput: '',
    res: '',
    labs: '',
    noRes: false
  },

  onLoad: function (options) {
    this.setData({
      openid: wx.getStorageSync('openid')
    })
  },

  onReady: function () {

  },

  onShow: function () {
    this.getLab(wx.getStorageSync('openid'))
  },

  getLab(openid) {
    lab.where({
        _openid: openid,
        dateRaw: _.gte(new Date().getTime())
      })
      .orderBy('dateRaw', 'asc')
      .get()
      .then((res) => {
        let labs = res.data
        labs.forEach((cur) => {
          let date = cur.date
          let dateFormat = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
          cur.date = dateFormat
        })
        this.setData({
          labs
        })
      })
  },

  focus(){
    this.setData({
      res: '',
      noRes: false
    })
  },

  blur(){
    this.setData({
      res: '',
      noRes: false
    })
  },

  search() {
    if (this.data.searchInput == '') {
      wx.showToast({
        title: '得先输点儿什么',
        icon: 'fail',
        duration: 1500,
      });
      return;
    }

    lab.where({
      _openid: this.data.openid,
      title: db.RegExp({
        regexp: '.*' + this.data.searchInput,
        options: 'i',
      })
    }).get().then((res) => {
      if (res.data.length == 0) {
        console.log("未查到记录",this.data.searchInput)
        this.setData({
          noRes: true
        })
      } else {
        let labs = res.data
        labs.forEach((cur) => {
          let date = cur.date
          let dateFormat = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
          cur.date = dateFormat
        })
        this.setData({
          res :labs,
          noRes: false
        })
      }
    })
  },

  viewMore(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../labEdit/labEdit?id=' + id,
    })
  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})