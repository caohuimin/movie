// pages/movies/more-movie/more-movie.js
var app =  getApp();
var util = require("../../../utils/util.js") 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies:{},
    navigateTitle:"",
    requestUrl:"",
    totalCount:0,
    isEmpty:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var category = options.category;
    var dataUrl="";
    switch(category){
      case "正在热映":
        dataUrl = app.globalData.doubanBase +"/v2/movie/in_theaters"
      break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon"
      break;
      case "豆瓣电影Top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250"
      break;
    }
    this.setData({
      navigateTitle: category,
      requestUrl:dataUrl
    })
    util.http(dataUrl, this.processDoubanData);
  },

  lower:function(event){
    var nextUrl = this.data.requestUrl+"?start="+this.data.totalCount+"&count=20";
     util.http(nextUrl, this.processDoubanData);
     wx.showNavigationBarLoading();
  },

  onPullDownRefresh:function(event){
    var refreshUrl = this.data.requestUrl+"?start=0&count=20";
    this.data.movies={};
    this.data.isEmpty=true;
    util.http(refreshUrl,this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  processDoubanData:function (moviesDouban){
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var tmp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(tmp);
    }
    var totalMovies ={}
    if(!this.data.isEmpty){
      totalMovies = this.data.movies.concat(movies);
    }
    else{
      totalMovies = movies;
      this.setData({
        isEmpty:false
      })
    }
    this.setData({
      movies: totalMovies,
      totalCount:this.data.totalCount+20
    })
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (event) {
   wx.setNavigationBarTitle({
     title: this.data.navigateTitle
   })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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