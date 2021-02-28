const util = require('../../util/utils')
const db = wx.cloud.database({
  env: 'lab-4g6ny9jc3e33c759'
});
const lab = db.collection('lab')
const user = db.collection('user')
const _ = db.command
const $ = db.command.aggregate

import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,

    openid: '',
    nickName: wx.getStorageSync('nickName'),
    today: {},
    days: [],

    height: 0, //可视高度
    hourpoint: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
  },

  // 获取当前设备的可视高度 以便适配各种机型
  style: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        });
      }
    });
  },

  onLoad: function () {

    this.style();
    this.authorizationCheck();
    this.setData({
      openid: wx.getStorageSync('openid')
    })
    this.getToday();

  },

  onShow: function () {
    this.initDate();
    this.getLab();
  },

  // 日期初始化
  initDate: function () {
    let that = this
    let days = [{}, {}, {}, {}, {}, {}, {}]
    let now = new Date()
    let today = new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate())
    let todayTime = today.getTime()
    let oneday = 24 * 60 * 60 * 1000
    for (let i = 0; i < 7; i++) {
      let date = new Date(todayTime + oneday * i)
      days[i].id = date
      days[i].date = "周" + "日一二三四五六".charAt(date.getDay()) + '&nbsp;&nbsp;&nbsp;' + date.getDate()
    }
    that.setData({
      days: days
    })
  },

  // 查询相应的lab
  getLab: function () {

    let that = this
    let tmp = that.data.days
    that.data.days.map((cur, index) => {
      let date = cur.id
      lab.where({
          date: date
        })
        .get({
          success: function (res) {
            tmp[index].labs = res.data
            that.setData({
              days: tmp
            })
            // new Promise((resolve, reject)=>{
            //   tmp[index].labs = res.data.map((cur2, index2) => {
            //     user.where({
            //       _openid: cur2._openid
            //     }).get({
            //       success: function (res2) {
            //         // console.log(res2)
            //         if (res2.data.length >= 1) {
            //           cur2.nickName = res2.data[0].nickName
            //           cur2.avatarUrl = res2.data[0].avatarUrl
            //           cur2.gender = res2.data[0].gender
            //           return cur2
            //         } else {
            //           console.log("未查到该条记录的创建人信息", cur2._openid)
            //           return
            //         }
            //       }
            //     })
            //   })
            //   resolve(tmp)
            // }).then((suc)=>{
            //   console.log(suc)
            //   that.setData({
            //     days: tmp
            //   })
            // })
          },
          fail: function (err) {
            console.log(err)
          }
        })
    })
  },

  handleLab(e) {
    let id = e.currentTarget.dataset.id
  },

  delete(e) {
    let id = e.currentTarget.dataset.id
    let that = this
    Dialog.confirm({
      title: '',
      message: '取消该会议？',
    }).then(() => {
      lab.doc(id).remove({
        success: function (res) {
          console.log("已成功取消该活动")
          that.onShow()
        }
      })
    }).catch(() => {
      console.log("取消 取消该活动")
    });
  },

  // 授权检查
  authorizationCheck: function () {
    let that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
              // 根据自己的需求有其他操作再补充
              // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
              wx.login({
                success: res => {
                  // 获取到用户的 code 之后：res.code

                  // console.log("用户的code:" + res.code);

                  // 可以传给后台，再经过解析获取用户的 openid
                  // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
                  // wx.request({
                  //     // 自行补上自己的 APPID 和 SECRET
                  //     url: 'https://api.weixin.qq.com/sns/jscode2session?appid=自己的APPID&secret=自己的SECRET&js_code=' + res.code + '&grant_type=authorization_code',
                  //     success: res => {
                  //         // 获取到用户的 openid
                  //         console.log("用户的openid:" + res.data.openid);
                  //     }
                  // });
                }
              });
            }
          });
        } else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          that.setData({
            isHide: true
          });
        }
      }
    });
  },

  // 授权按钮
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下

      // console.log("用户的信息如下：");
      // console.log(e.detail.userInfo);

      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      that.setData({
        isHide: false
      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },

  // 获取时间信息
  getToday: function () {
    let that = this
    let today = {}
    let date = new Date()
    let month = date.getMonth() + 1

    today.date = util.monthFormat(date.getMonth() + 1) + '.' + date.getDate() + ' · ' + date.getFullYear()
    today.year = date.getFullYear()
    today.month = date.getMonth() + 1
    today.day = date.getDate()
    today.week = date.getDay() == 0 ? 7 : date.getDay()

    that.setData({
      today: today,
      month: month
    })
  },

  addLab: function (e) {
    wx.navigateTo({
      url: '../labEdit/labEdit',
    })
  }

})