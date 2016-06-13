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
    $.getJSON('http://127.0.0.1:8888/git/mobile/data.php', function(data) {
        slide.init({id: 'slide', images: data});
    });
});