/**
 * 轮播组件
 */
define(['zepto'], function ($) {
    "use strict";

    /**
     * 公共变量
     */
    var slide = {},
        length = 0,
        timerInterval = 10,
        currentSlideIndex = 0,
        nextSlideIndex = 0,
        prevSlideIndex = 0,
        eachSlideWidth = 0,
        imagesArr = [];

    var init = function () {
        initData();
        renderView();
        bindEvent();
    };

    /**
     * 初始化数据
     */
    var initData = function () {
        slide = document.getElementById("slide");
        eachSlideWidth = slide.clientWidth;
        imagesArr = ['images/scenery1.png', 'images/scenery2.png', 'images/scenery3.png', 'images/scenery4.png'];
        length = imagesArr.length;

        nextSlideIndex = length > 0 ? 1 : 0;
        prevSlideIndex = length > 0 ? length - 1 : 0;
    };

    /**
     * 渲染视图
     */
    var renderView = function () {
        var li = [];
        li.push('<li><img src="images/process.png" class="process" id="prev-slide" alt=""></li>');
        li.push('<li><img src="images/process.png" class="process" id="cur-slide" alt=""></li>');
        li.push('<li><img src="images/process.png" class="process" id="next-slide" alt=""></li>');
        slide.innerHTML = '<ul>' + li.join('') + '</ul>';

        preloadImage({
            src: imagesArr[currentSlideIndex],
            index: currentSlideIndex
        }, function (index) {
            $("#cur-slide").removeClass('process').attr({src: imagesArr[index]});
        });

        slide.scrollLeft = eachSlideWidth;
    };

    /**
     * 绑定事件
     */
    var bindEvent = function () {
        $(".slide-pictures img").swipeLeft(function () {
            console.log('swipeLeft');

            // 更新指针
            prevSlideIndex = currentSlideIndex;
            currentSlideIndex = nextSlideIndex;
            nextSlideIndex = currentSlideIndex >= length - 1 ? 0 : currentSlideIndex + 1;

            // 加载下一张图片
            preloadImage({
                src: imagesArr[currentSlideIndex],
                index: currentSlideIndex,
            }, function (index) {
                $("#next-slide").removeClass('process').attr({src: imagesArr[index]});
            });

            // 展现
            var Timer1 = setInterval(function () {
                var scrollLeft = slide.scrollLeft;
                scrollLeft = (scrollLeft + timerInterval >= 2 * eachSlideWidth) ? 2 * eachSlideWidth : scrollLeft + 2 * timerInterval;

                slide.scrollLeft = scrollLeft;
                if (scrollLeft >= 2 * eachSlideWidth) {
                    clearInterval(Timer1);

                    // 更新cur-slide区域为当前索引的图片
                    $("#cur-slide").removeClass('process').attr({src: imagesArr[currentSlideIndex]});

                    // 将cur-slide拉回视窗区域
                    slide.scrollLeft = eachSlideWidth;

                    // 更新next-slide区域为预加载图片
                    $("#next-slide").addClass('process').attr({src: "images/process.png"});

                    // 预加载图片，为下一次左划准备
                    preloadImage({
                        src: imagesArr[nextSlideIndex],
                        index: nextSlideIndex,
                    }, function (index) {
                        $("#next-slide").removeClass('process').attr({src: imagesArr[index]});
                    });
                }
            }, timerInterval);

        }).swipeRight(function () {
            console.log('swipeRight');

            // 更新指针
            nextSlideIndex = currentSlideIndex;
            currentSlideIndex = prevSlideIndex;
            prevSlideIndex = currentSlideIndex <= 0 ? length - 1 : currentSlideIndex - 1;

            // 加载上一张图片
            preloadImage({
                src: imagesArr[currentSlideIndex],
                index: currentSlideIndex,
            }, function (index) {
                $("#prev-slide").removeClass('process').attr({src: imagesArr[index]});
            });

            // 展现
            var Timer1 = setInterval(function () {
                var scrollLeft = slide.scrollLeft;
                scrollLeft = (scrollLeft - timerInterval <= 0) ? 0 : scrollLeft - 2 * timerInterval;

                slide.scrollLeft = scrollLeft;
                if (scrollLeft <= 0) {
                    clearInterval(Timer1);

                    // 更新cur-slide区域为当前索引的图片
                    $("#cur-slide").removeClass('process').attr({src: imagesArr[currentSlideIndex]});

                    // 将cur-slide拉回视窗区域
                    slide.scrollLeft = eachSlideWidth;

                    // 更新prev-slide区域为预加载图片
                    $("#prev-slide").addClass('process').attr({src: "images/process.png"});

                    // 预加载图片，为下一次右划准备
                    preloadImage({
                        src: imagesArr[prevSlideIndex],
                        index: prevSlideIndex,
                    }, function (index) {
                        $("#prev-slide").removeClass('process').attr({src: imagesArr[index]});
                    });
                }
            }, timerInterval);

        });

    };

    var preloadImage = function (data, callback) {
        var image = new Image();
        image.src = data.src;

        if (image.complete) {
            callback(data.index);
        } else {
            image.onload = callback(data.index);
        }
    };

    return {
        init: init
    };
});