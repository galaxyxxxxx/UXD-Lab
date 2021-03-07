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
    title:'',
    date: '',
    timeBegin: '',
    timeEnd: '',
    host: '',
    hostAvatar: '',
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },

  onShow: function (){
    wx.showLoading()
    this.getLab(this.data.id)
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
      this.getHost(res.data[0]._openid)
    })
  },

  getHost(openid){
    let that = this
    db.collection('user').where({
      _openid: openid
    }).get().then((res2)=>{
      let user = res2.data[0]
      console.log("user",res2)
      that.setData({
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