const util = require('../../util/utils')
const db = wx.cloud.database({
  env: 'lab-4g6ny9jc3e33c759'
});
const lab = db.collection('lab')
const _ = db.command
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
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
        icon: 'error',
        duration: 1500,
      });
      return;
    }

    lab.where({
      _openid: this.data.openid,
      dateRaw: _.gte(new Date().getTime()),
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

  delete(e){
    console.log(e)
    let id = e.currentTarget.dataset.id
    let instance  = e.detail.instance;
    Dialog.confirm({
      message: '确定删除吗？'
    }).then(() => {
      
      this.setData({
        searchInput: '',
        res: '',
        labs: '',
        noRes: false,
      })
      let that = this
      lab.doc(id).remove({
        success: function(res) {
          that.getLab(wx.getStorageSync('openid'))
        },
        fail: function(err) {
          console.log(err)
        }
      })

      instance.close()
    })
    .catch(()=>{
      instance.close()
    });    
  },

  test(e){
    console.log(e)
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