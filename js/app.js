require.config({
    baseUrl: 'js',
    paths: {
        'zepto': 'lib/zepto',
        'slide': 'lib/slide'
    }
});

require(['zepto', 'slide'], function($, slide){
    console.log('load zepto');

    // 初始化轮播组件
    slide.init('slide');
});