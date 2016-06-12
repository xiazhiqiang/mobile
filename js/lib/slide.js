/**
 * 轮播组件
 */
define(['zepto'], function ($) {
    "use strict";

    var Slide = {
        slide: {},

        /**
         * 轮播必要的dom
         */
        prevSlideDom: {},
        currentSlideDom: {},
        nextSlideDom: {},

        /**
         * 轮播必要的索引
         */
        prevSlideIndex: 0,
        currentSlideIndex: 0,
        nextSlideIndex: 0,

        /**
         * 图片库资源
         */
        imagesArr: [],
        length: 0,

        eachSlideWidth: 0,
        timerInterval: 8,

        init: function (id) {
            id = id || 'slide';// 默认轮播div ID
            this.initData(id);
            this.renderView();
            this.bindEvent();
        },

        /**
         * 初始化数据
         */
        initData: function (id) {
            this.slide = document.getElementById(id);
            this.eachSlideWidth = this.slide.clientWidth;
            this.imagesArr = ['images/scenery1.png', 'images/scenery2.png', 'images/scenery3.png', 'images/scenery4.png'];
            this.length = this.imagesArr.length;

            this.nextSlideIndex = this.length > 0 ? 1 : 0;
            this.prevSlideIndex = this.length > 0 ? this.length - 1 : 0;
        },

        /**
         * 渲染视图
         */
        renderView: function () {
            var that = this,
                li = [];

            li.push('<li><img src="images/process.png" class="process" id="prev-slide" alt=""></li>');
            li.push('<li><img src="images/process.png" class="process" id="cur-slide" alt=""></li>');
            li.push('<li><img src="images/process.png" class="process" id="next-slide" alt=""></li>');

            this.slide.innerHTML = '<ul>' + li.join('') + '</ul>';

            this.prevSlideDom = $("#prev-slide");
            this.currentSlideDom = $("#cur-slide");
            this.nextSlideDom = $("#next-slide");

            this.preloadImage({
                src: that.imagesArr[that.currentSlideIndex],
                index: that.currentSlideIndex
            }, function (index) {
                that.currentSlideDom.removeClass('process').attr({src: that.imagesArr[index]});
            });

            this.slide.scrollLeft = this.eachSlideWidth;
        },

        /**
         * 绑定事件
         */
        bindEvent: function () {
            // 绑定移动端左划和右划事件
            $(this.slide).find('img').swipeLeft($.proxy(this.swipeLeft, this)).swipeRight($.proxy(this.swipeRight, this));
        },

        /**
         * 向左滑动
         */
        swipeLeft: function () {
            console.log('swipeLeft');

            var that = this;

            // 更新指针
            that.prevSlideIndex = that.currentSlideIndex;
            that.currentSlideIndex = that.nextSlideIndex;
            that.nextSlideIndex = that.currentSlideIndex >= that.length - 1 ? 0 : that.currentSlideIndex + 1;

            // 加载下一张图片
            that.preloadImage({
                src: that.imagesArr[that.currentSlideIndex],
                index: that.currentSlideIndex,
            }, function (index) {
                that.nextSlideDom.removeClass('process').attr({src: that.imagesArr[index]});
            });

            // 展现
            var Timer1 = setInterval(function () {
                var scrollLeft = that.slide.scrollLeft;
                scrollLeft = (scrollLeft + that.timerInterval >= 2 * that.eachSlideWidth) ? 2 * that.eachSlideWidth : scrollLeft + 2 * that.timerInterval;

                that.slide.scrollLeft = scrollLeft;
                if (scrollLeft >= 2 * that.eachSlideWidth) {
                    clearInterval(Timer1);

                    // 更新cur-slide区域为当前索引的图片
                    that.currentSlideDom.removeClass('process').attr({src: that.imagesArr[that.currentSlideIndex]});

                    // 将cur-slide拉回视窗区域
                    that.slide.scrollLeft = that.eachSlideWidth;

                    // 更新next-slide区域为预加载图片
                    that.nextSlideDom.addClass('process').attr({src: "images/process.png"});

                    // 预加载图片，为下一次左划准备
                    that.preloadImage({
                        src: that.imagesArr[that.nextSlideIndex],
                        index: that.nextSlideIndex,
                    }, function (index) {
                        that.nextSlideDom.removeClass('process').attr({src: that.imagesArr[index]});
                    });
                }
            }, that.timerInterval);
        },

        /**
         * 向右滑动
         */
        swipeRight: function () {
            console.log('swipeRight');

            var that = this;

            // 更新指针
            that.nextSlideIndex = that.currentSlideIndex;
            that.currentSlideIndex = that.prevSlideIndex;
            that.prevSlideIndex = that.currentSlideIndex <= 0 ? that.length - 1 : that.currentSlideIndex - 1;

            // 加载上一张图片
            that.preloadImage({
                src: that.imagesArr[that.currentSlideIndex],
                index: that.currentSlideIndex,
            }, function (index) {
                that.prevSlideDom.removeClass('process').attr({src: that.imagesArr[index]});
            });

            // 展现
            var Timer1 = setInterval(function () {
                var scrollLeft = that.slide.scrollLeft;
                scrollLeft = (scrollLeft - that.timerInterval <= 0) ? 0 : scrollLeft - 2 * that.timerInterval;

                that.slide.scrollLeft = scrollLeft;
                if (scrollLeft <= 0) {
                    clearInterval(Timer1);

                    // 更新cur-slide区域为当前索引的图片
                    that.currentSlideDom.removeClass('process').attr({src: that.imagesArr[that.currentSlideIndex]});

                    // 将cur-slide拉回视窗区域
                    that.slide.scrollLeft = that.eachSlideWidth;

                    // 更新prev-slide区域为预加载图片
                    that.prevSlideDom.addClass('process').attr({src: "images/process.png"});

                    // 预加载图片，为下一次右划准备
                    that.preloadImage({
                        src: that.imagesArr[that.prevSlideIndex],
                        index: that.prevSlideIndex,
                    }, function (index) {
                        that.prevSlideDom.removeClass('process').attr({src: that.imagesArr[index]});
                    });
                }
            }, that.timerInterval);
        },



        /**
         * 图片预加载
         * @param data
         * @param callback
         */
        preloadImage: function (data, callback) {
            var image = new Image();
            image.src = data.src;

            if (image.complete) {
                callback(data.index);
            } else {
                image.onload = callback(data.index);
            }
        }
    };

    return Slide;
});