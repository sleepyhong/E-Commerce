$(function() {
    const prevBtns = $('.previous_btn');
    const nextBtns = $('.next_btn');

    const brands = $('.brand');
    for (let brand of brands) {
        const products = $(brand).find('.product');

        for (let count = 0; count < (products.length < 4 ? products.length : 4); count++) {
            const product = $(products[count]).show();
        }
    }

    prevBtns.each(function() {
        $(this).on('click', function() {
            const container = $(this).siblings('div');
            const products = $(container).find('a');
            
            if (products.length > 4) {
                $(products[products.length - 1])
                    .prependTo(container)
                    .show();
                $(products[3])
                    .hide();
            }
        });
    })
    nextBtns.each(function() {
        $(this).on('click', function() {
            const container = $(this).siblings('div');
            const products = $(container).find('a');
            if (products.length > 4) {
                $(products[0])
                    .appendTo(container)
                    .hide();
                $(products[4])
                    .show();
            }
        });
    })
});