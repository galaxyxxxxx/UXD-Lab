const util = require('../../util/utils')
const db = wx.cloud.database({
  env: 'lab-4g6ny9jc3e33c759'
});
const lab = db.collection('lab')
const user = db.collection('user')
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    title:'hi',
    date: '1',
    timeBegin: '1',
    timeEnd: '1',
    host: '1',
    hostAvatar: '1',
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.showLoading()
    this.setData({
      id: options.id
    })
    this.getLab(options.id)
   
  },

  getLab(id){
    lab.where({
      _id:id
    }).get().then((res)=>{
      let lab = res.data[0]
      this.setData({
        title: lab.title,
        date: util.dateFormat(lab.date),
        timeBegin: lab.timeBegin,
        timeEnd: lab.timeEnd
      })
      this.getHost(lab._openid)
    })
  },

  getHost(openid){
    user.where({
      _openid: openid
    }).get().then((res)=>{
      let user = res.data[0]
      this.setData({
        host: user.nickName,
        hostAvatar: user.avatarUrl,
        loading : true
      })
      setTimeout(()=>{
        wx.hideLoading()
      },0)
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})