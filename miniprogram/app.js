//app.js
App({
  globalData: {
    openid: ''
},
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'lab-4g6ny9jc3e33c759',
        traceUser: true,
      })
    }
    this.getopenid(this.cb);

    // 查看是否授权
    wx.getSetting({
      success: function(res){
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {

              // console.log("authoried already", res.userInfo)
              //用户已经授权过
            }
          })
        }
      }
    })
  },

  getopenid: function (cb) {
    let that = this;
    const promiseGetOpenid = function () {
      return new Promise((resolve, reject) => {

        if (that.globalData.openid) {
          typeof cb == 'function' && cb(that.globalData.openid);
        } else {
          // 调用云函数 获取openid
          wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
              //闭包函数内，可以用this,而不需要用that=this
              that.globalData.openid = res.result.openid;
              wx.setStorageSync('openid', res.result.openid);
              typeof cb == 'function' && cb(that.globalData.openid);
              resolve();
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '获取 openid 失败，请检查 login 云函数',
              });
              console.log('获取 openid 失败，请检查是否有部署云函数，错误信息：', err);
              reject();
            },
          });
        }
      });
    };

    promiseGetOpenid().then(suc => {
      // 更新user表里的昵称和头像 并加入缓存
      wx.getUserInfo({
        success(res) {
          // console.log("info", res)
          var userInfo = res.userInfo;
          var nickName = userInfo.nickName;
          var avatarUrl = userInfo.avatarUrl;
          var gender = userInfo.gender;

          wx.setStorageSync('nickName', nickName);
          wx.setStorageSync('avatarUrl', avatarUrl);
          wx.setStorageSync('gender', gender);
        },
        fail(err){
          console.log(err)
        }
      })
    })
  }       
})