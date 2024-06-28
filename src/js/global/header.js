import { xGetter, xSetter, lerp, typeOpts } from "../helper/index";
import { lenis } from "../global/lenis";
import { cvUnit, viewportBreak } from "../helper/viewport";
import { SplitText } from "../libs/SplitText";

const setupDot = () => {
    let allSections = $('[data-section]');
    let tempLabel = $('.header-menu-label-item').eq(0).clone();
    let tempProg = $('.header-menu-prog-item-wrap').eq(0).clone();

    $('.header-menu-label').find('.header-menu-label-item').remove();
    $('.header-menu-prog').find('.header-menu-prog-item-wrap').remove();
    allSections.each((idx, el) => {
        let htmlLabel = tempLabel.clone();
        htmlLabel.attr('data-header-id', `${$(el).attr('data-section-id')}`);
        htmlLabel.find('span').text(`${$(el).attr('data-section-id')}`);
        $('.header-menu-label').append(htmlLabel)

        let htmlProg = tempProg.clone();
        htmlProg.attr('href', `#${$(el).attr('data-section-id')}`)
        htmlProg.attr('data-header-id',`${$(el).attr('data-section-id')}`)
        $('.header-menu-prog').append(htmlProg)
    })
}

const updateProgressByScroll = () => {
    let allSections = $('[data-section]');

    const DOM = {
        labelItem: $('.header-menu-label-item'),
        labelById: (id) => $(`.header-menu-label-item[data-header-id="${id}"]`),
        labelSMById: (id) => $(`.header-menu-sm-list [data-header-id="${id}"]`),
        progWrap: $(`.header-menu-prog-item-wrap`),
        progItem: $(`.header-menu-prog-item`),
        progById: (id) => $(`.header-menu-prog-item-wrap[data-header-id="${id}"]`)
    }
    setTimeout(() => {
        let offset = '40%'
        allSections.each((idx, el) => {
            ScrollTrigger.create({
                trigger: el,
                start: `top top+=${offset}`,
                end: `bottom bottom-=${offset}`,
                scrub: true,
                onUpdate: (self) => {
                    let currSection = allSections.eq(idx);
                    let id = currSection.attr('data-section-id')

                    if ($(window).width() > 767) {
                        DOM.labelById(id).addClass('active');
                        DOM.labelItem.not(DOM.labelById(id)).removeClass('active');

                        DOM.progById(id).addClass('active');
                        DOM.progWrap.not(DOM.progById(id)).removeClass('active');

                        DOM.progById(id).find(DOM.progItem).addClass('active');
                        DOM.progWrap.not(DOM.progById(id)).find(DOM.progItem).removeClass('active');

                        let percent = Math.ceil((self.progress * 100) - 100);
                        gsap.to(DOM.progById(id).find('.header-menu-prog-item-inner'), {xPercent: percent, duration: .3, overwrite: true})
                    } else {
                        $('.header-menu-sm-list a').removeClass('active');
                        DOM.labelSMById(id).addClass('active');
                        gsap.set('.header-menu-sm-process-inner-line', {top: `${idx * ($('.header-menu-sm-process-inner').height() - $('.header-menu-sm-process-inner-line').height()) / (allSections.length - 1) / $('.header-menu-sm-process-inner').height() * 100}%`})
                    }
                }
            })
        })
        ScrollTrigger.create({
            trigger: '.home-main',
            start: `top top+=${offset}`,
            end: `bottom bottom-=${offset}`,
            onLeave: () => {
                $(`.header-menu-label-item`).removeClass('active');
                $(`.header-menu-prog-item`).removeClass('active');
            },
            onLeaveBack: () => {
                $(`.header-menu-label-item`).removeClass('active');
                $(`.header-menu-prog-item`).removeClass('active');
            }
        })
    }, 100);


    $('.header-main [data-header-id]').on('click', function (e) {
        let target = $(this).attr('data-header-id');

        if ($('html').hasClass('lenis-smooth')) {
            lenis.scrollTo(`[data-section-id="${target}"]`)
        } else {
            let targetTop = $(`[data-section-id="${target}"]`).get(0).offsetTop + $(window).height();
            $('html').animate({
                scrollTop: targetTop
            });
        }

        history.replaceState({}, '', `${window.location.pathname}#${target}`);
        return false;
    })

    const checkMenuActive = () => {
        if ($('.header-menu-label').length) {
            if ($('.header-menu-label-item.active').length === 0) {
                gsap.set('.header-menu-label', { '--d-width': '0px' });
            }
            else {
                gsap.set('.header-menu-label', { '--d-width': `${$('.header-menu-label-item.active').eq(0).width()}px` });
            }
            requestAnimationFrame(checkMenuActive);
        }
    }
    requestAnimationFrame(checkMenuActive);
}

const hoverDot = () => {
    $('.header-menu-prog-item-wrap').on('mouseenter', function (e) {
        let content = $(this).attr('data-header-id');
        $('.header-menu-prog-label').text(content);
        gsap.to('.header-menu-prog-label', { autoAlpha: 1 });
    })
    $('.header-menu-prog-item-wrap').on('mouseleave', function (e) {
        gsap.to('.header-menu-prog-label', { autoAlpha: 0 })
    })
}

function checkHoverDot() {
    if ($('.header-menu-prog-item-wrap:hover').length) {
        let target = $('.header-menu-prog-item-wrap:hover')
        let currX = xGetter('.header-menu-prog-label')
        xSetter('.header-menu-prog-label')(lerp(currX, target.get(0).offsetLeft - $('.header-menu-prog-label').outerWidth() / 2 + target.outerWidth() / 2));
    }
    requestAnimationFrame(checkHoverDot);
}

const updateHeaderBarByScroll = () => {
    if ($('.home-main').length) {
        let offsetHeaderMain = $('.header-main').offset().left;

        let tlHeaderTrigger = gsap.timeline({
            scrollTrigger: {
                trigger: '.home-main',
                start: `top+=${$('.header').outerHeight()} top`,
                onEnter: () => {
                    $('.header-logo').addClass('active')

                    if ($(window).width() > 767) {
                        $('.header-menu').addClass('active')
                        $('.header-hamburger').addClass('active')

                        if ($(window).width() <= 991) {
                            gsap.to('.header-main-schedule', {width: 0, overwrite: true})
                            gsap.to('.header-hamburger', {width: 0, overwrite: true})
                            gsap.to('.header-menu-label', {marginLeft: '1rem'})
                        }
                    }

                    if ($(window).width() <= 767) {
                        gsap.to('.header-main', { marginRight: 0 })
                        gsap.to('.header-hamburger', {width: cvUnit(60, "rem"), overwrite: true})
                        gsap.to('.header-logo', {width: 'auto', marginRight: cvUnit(32, "rem")})
                    }
                },
                onLeaveBack: () => {
                    $('.header-logo').removeClass('active')
                    $('.header-hamburger').removeClass('active')
                    $('.header-menu-sm').slideUp(400)

                    if ($(window).width() > 767) {
                        $('.header-menu').removeClass('active')
                    }
                    if ($(window).width() <= 991) {
                        gsap.to('.header-main-schedule', {width: 'auto', overwrite: true})
                        gsap.to('.header-hamburger', {width: cvUnit(60, "rem"), overwrite: true})
                        gsap.to('.header-menu-label', {marginLeft: '0'})
                    }
                    if ($(window).width() <= 767) {
                        gsap.to('.header-main', { marginRight: offsetHeaderMain })
                        gsap.to('.header-hamburger', {width: 0, overwrite: true})
                        gsap.to('.header-logo', {width: 0, marginRight: 0})
                    }
                }
            }
        })
    }
    $('.header-menu-sm').slideUp(50)
    $('.header-hamburger').on('click', function(e) {
        e.preventDefault();
        if (!$(this).hasClass('active')) {
            if  ($(window).width() > 767) {
                $('.header-menu').addClass('active')

                if ($(window).width() <= 991) {
                    gsap.to('.header-menu-label', {marginLeft: '1rem'})
                }
            } else {
                $('.header-menu-sm').slideDown(400)
                gsap.set('.header-menu-sm-process-inner-line', {top: `${$('[data-section]').length/2 * ($('.header-menu-sm-process-inner').height() - $('.header-menu-sm-process-inner-line').height()) / ($('[data-section]').length - 1) / $('.header-menu-sm-process-inner').height() * 100}%`})
            }
            $(this).addClass('active')
        } else {
            if  ($(window).width() > 767) {
                $('.header-menu').removeClass('active')

                if ($(window).width() <= 991) {
                    gsap.to('.header-menu-label', {marginLeft: '0'})
                }
            } else {
                $('.header-menu-sm').slideUp(400)
            }
            $(this).removeClass('active')
        }
    })

    if ($(window).width() <= 767) {
        $('html').on('click', function(e) {
            if (!$('.header:hover').length) {
                $('.header-menu').removeClass('active')
                $('.header-menu-sm').slideUp(400)
                $('.header-hamburger').removeClass('active')
            }
        })
    }
}

const header = {
    setup() {
        setupDot();
    },
    init() {
        updateProgressByScroll();
        updateHeaderBarByScroll();
        if ($(window).width() > 991) {
            hoverDot();
            checkHoverDot();
        }
    }
}

const initHeader = () => {
    header.setup();
    header.init();
}

export default initHeader;