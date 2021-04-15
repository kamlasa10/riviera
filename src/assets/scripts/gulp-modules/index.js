@@include('./libs.js');

const locoScroll = new LocomotiveScroll({
    el: document.querySelector('.page__inner'),
    smooth: true,
    smoothMobile: false,
    inertia: 1,
    lerp: 0.2,
    getDirection: true,
    resetNativeScroll: false,
    onUpdate: function(some) {

    }
});
function handleVisibilityOnScroll(elems = [], direction = 'up') {
    elems.forEach(elem => {
        direction === 'down' ?
            elem[0].classList.add(elem[1]) :
            elem[0].classList.remove(elem[1]);
    })
}
locoScroll.on("scroll", (position, limit, speed, direction) => {
    ScrollTrigger.update;
    if (position.scroll.y > document.documentElement.clientWidth) {
        window.canvasEffectInterval && clearInterval(window.canvasEffectInterval);
        window.removeFirstPageEffect && window.removeFirstPageEffect();
    }
    position.scroll.y > 150 ?
        handleVisibilityOnScroll([
            [document.querySelector('.header'), 'not-on-top'],
        ], 'down') :
        handleVisibilityOnScroll([
            [document.querySelector('.header'), 'not-on-top'],
        ]);
});

ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
        return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
    }, // we don't have to define a scrollLeft because we're only scrolling vertically.
    getBoundingClientRect() {
        return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight
        };
    },
    // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
    pinType: document.body.style.transform ? "transform" : "fixed"
});
gsap.registerPlugin(ScrollTrigger);

function mask(inputName, mask, evt) {
    try {
        var text = document.querySelector(inputName);
        var value = text.value;

        // If user pressed DEL or BACK SPACE, clean the valu
        try {
            var e = evt.which ? evt.which : event.keyCode;
            if (e == 46 || e == 8) {
                text.value = "";
                return;
            }
        } catch (e1) {}

        var literalPattern = /[0\*]/;
        var numberPattern = /[0-9]/;
        var newValue = "";

        for (var vId = 0, mId = 0; mId < mask.length;) {
            if (mId >= value.length) break;

            // Number expected but got a different value, store only the valid portion
            if (mask[mId] == "0" && value[vId].match(numberPattern) == null) {
                break;
            }

            // Found a literal
            while (mask[mId].match(literalPattern) == null) {
                if (value[vId] == mask[mId]) break;

                newValue += mask[mId++];
            }

            newValue += value[vId++];
            mId++;
        }
        text.value = newValue;
    } catch (e) {}
}

function onScrollWindowChange(y) {
    if(y > 100) {
        $('.header').addClass('moving')
        return
    }

    $('.header').removeClass('moving')
}

window.addEventListener('DOMContentLoaded', () => {
    if($(window).width() > 1025) {
        function onScrollWindowChange(y) {
            if(y > 100) {
                $('.header').addClass('moving')
                return
            }

            $('.header').removeClass('moving')
        }

        // locoScroll.on('scroll', ({delta}) => {
        //     let y = delta.y
        //     onScrollWindowChange(y)
        // })
    }

    window.addEventListener('scroll', (e) => {
        onScrollWindowChange(document.documentElement.scrollTop)
    })

    new Swiper('.js-partners__slider', {
        speed: 600,
        // slidesPerView: 4,
        allowTouchMove: false,

        navigation: {
            nextEl: '.js-partners-right',
            prevEl: '.js-partners-left',
            disabledClass: 'lock'
        },
        breakpoints: {
            320: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                // slidesPerColumn: 2,
            },
            768: {
                slidesPerGroup: 2,
                slidesPerView: 2,
                // slidesPerColumn: 1,
            },
            1024: {
                slidesPerGroup: 4,
                slidesPerView: 4,
                // slidesPerColumn: 1,
            },
          }
    });

    new Swiper('.js-projects-top', {
        speed: 600,
        slidesPerView: 1,
        allowTouchMove: false,
        navigation: {
            nextEl: '.js-projects-top-right',
            prevEl: '.js-projects-top-left',
            disabledClass: 'lock'
        },
        pagination: {
            el: '.js-projects__pagination',
            type: 'bullets',
            clickable: true
        },
    });

    new Swiper('.js-projects2', {
        speed: 600,
        slidesPerView: 1,
        allowTouchMove: false,
        navigation: {
            nextEl: '.js-projects2-right',
            prevEl: '.js-projects2-left',
            disabledClass: 'lock'
        },
        pagination: {
            el: '.js-projects__pagination2',
            type: 'bullets',
            clickable: true
        },
    });

    $('.js-btn-top').click((e) => {
        if($(window).width() > 1025) {
            window.locoScroll.scrollTo(0)
            return
        }

        $('html, body').stop().animate({
            scrollTop: 0
        }, 1000)
    })

    $('[name="phone"]')[0].addEventListener("keyup", (e) => {
        mask('[data-phone]', "(000) 000-00-00", e);
    });

    let currentLanguage = $('html').attr('lang')

    const msgWarnForForm = {
        allWarn: {
            uk: 'не корректне значення',
            en: 'not the correct value'
        },
        phone: {
            uk: 'не корректний телефон',
            en: 'enter the correct phone number'
        }
    }

    function removeFormTextWarn(input) {
        input.parent().find(".field__error-msg").remove();
    }

    function removeAllFormTextWarn(inputs) {
        inputs.each(function () {
            $(this).parent().find(".field__error-msg").remove();
        });
    }

    function addIndicateWarnForNode(node, classes, isAdded = true) {
        if (isAdded) {
            $(node).closest(".field").addClass(classes);
            return;
        }

        $(node).closest(".field").removeClass(classes);
    }

    function removeNodeByDelay(node, delay) {
        setTimeout(() => {
            node.remove();
        }, delay);
    }

    function validateForm(inputs) {
        console.log(inputs)
        let isValid = true;
        inputs.each(function () {
            $(this).on("input", (e) => {
                if ($(e.target).val().replace(/\s+/g, "") && $(e.target).attr('name') === 'name'  && e.currentTarget.value.length < 2) {
                    removeFormTextWarn($(this));
                    $(this)
                        .parent()
                        .append(
                            `<div class="field__error-msg">${msgWarnForForm.allWarn[currentLanguage]}</div>`
                        );

                    addIndicateWarnForNode($(this), "field--error", false);
                    isValid = false;
                    return;
                } else if($(e.target).attr('name') === 'phone' && e.currentTarget.value.length < 13) {
                    removeFormTextWarn($(this));
                    $(this)
                        .parent()
                        .append(`<div class="field__error-msg">${msgWarnForForm.phone[currentLanguage]}</div>`);
                    addIndicateWarnForNode($(this), "field--error", true);
                    isValid = false;
                    return
                } else {
                    removeFormTextWarn($(this));
                    isValid = true;
                    return
                }
            });

            if($(this).attr('name') === 'phone' && this.value.length < 12) {
                removeFormTextWarn($(this));
                $(this)
                    .parent()
                    .append(`<div class="field__error-msg">${msgWarnForForm.phone[currentLanguage]}</div>`);
                addIndicateWarnForNode($(this), "field--error", true);
                isValid = false;
                return
            }

            if (!$(this).val().replace(/\s+/g, "")) {
                removeFormTextWarn($(this));
                $(this)
                    .parent()
                    .append(`<div class="field__error-msg">${msgWarnForForm.allWarn[currentLanguage]}</div>`);
                addIndicateWarnForNode($(this), "field--error", true);
                isValid = false;
            }
        });

        return isValid;
    }

    $('[data-form]').on("submit", (e) => {
        e.preventDefault();
        let $form = $(e.currentTarget)
        const inputs = $form.find($("[name]"));
        console.log($form[0])
        const isValid = validateForm(inputs);

        if (isValid) {
            sendAjaxForm("static/mail.php", $form);
        }
    });

    function sendAjaxForm(url, selectorForm) {
        console.log(selectorForm)
        const status = {
            sucess: {
                uk: "Спасибо за заявку мы с вами свяжемся в ближайшее время",
                en: "Thank you for your application, we will contact you soon"
            },
            error: {
                uk: "Помилка на сервері спробуйте ще раз",
                en: "Error on server try again later"
            },
        };

        $.ajax({
            url: url, //url страницы (action_ajax_form.php)
            type: "POST", //метод отправки
            dataType: "html", //формат данных
            data: $(selectorForm).find('form').serialize(), // Сеарилизуем объект
            success: function (response) {
                //Данные отправлены успешно
                $('.form__status').remove()
                $(selectorForm).append(
                    `<div class="form__status">${status.sucess[currentLanguage]}</div>`
                );
                const msg = $(selectorForm).find(".form__status");
                removeNodeByDelay(msg, 5000);
                if(selectorForm[0].tagName.toLowerCase() === 'form') {
                    selectorForm[0].reset();
                } else {
                    selectorForm.find('form')[0].reset();
                }
            },
            error: function (response) {
                // Данные не отправлены
                $('.form__status').remove()
                $(selectorForm).append(
                    `<div class="form__status">${status.error[currentLanguage]}</div>`
                );
                const msg = $(selectorForm).find(".form__status");

                removeNodeByDelay(msg, 5000);

                if(selectorForm[0].tagName.toLowerCase() === 'form') {
                    selectorForm[0].reset();
                } else {
                    selectorForm.find('form')[0].reset();
                }
            },
        });
    }

    function animateForFirstScreen() {
        const tl = gsap.timeline()

        return tl
    }

    function animateForSecondScreen() {
        const tl = gsap.timeline()
        return tl
    }

    function animateForThreeScreen() {
        const tl = gsap.timeline()

        tl.fromTo('.projects__title', {
            y: -30,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 1,
        })
        .fromTo('.projects__content--1 .projects__left', {
            x: '-40%',
            autoAlpha: 0,
        }, {
            x: 0,
            duration: 1.5,
            autoAlpha: 1,
            ease: Power4.easeInOut
        }, '<')
        .fromTo('.projects__content--1 .projects__right', {
            x: '40%',
            autoAlpha: 0,
        }, {
            x: 0,
            duration: 1.5,
            autoAlpha: 1,
            ease: Power4.easeInOut
        }, '<')

        return tl
    }

    function animateForFourScreen() {
        const tl = gsap.timeline()

        tl.fromTo('.projects__content--2 .projects__left', {
            x: '35%',
            autoAlpha: 0
        }, {
            x: 0,
            duration: 1.5,
            autoAlpha: 1,
            ease: Power4.easeInOut
        }, 0.6)
        .fromTo('.projects__content--2 .projects__right', {
            x: '-35%',
            autoAlpha: 0
        }, {
            x: 0,
            duration: 1.5,
            autoAlpha: 1,
            ease: Power4.easeInOut
        }, 0.7)

        return tl
    }

    function animateForFiveScreen() {
        const tl = gsap.timeline()

        tl.fromTo('.features__title', {
            y: -30,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 1
        })
        .fromTo('.features__item', {
            opacity: 0,
            y: 30
        }, {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 1.5
        }, 0.6)

        return tl
    }

    function animateForSixScreen() {
        const tl = gsap.timeline()

        tl.fromTo('.principles__icon', {
            y: '30',
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 1
        })
        .fromTo('.principles__title', {
            y: -30,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 1
        }, 0.4)
        .fromTo('.principles__item', {
            y: 40,
            opacity: 0
        }, {
            y: 0,
            opacity: 1.3,
            stagger: 0.15
        }, 0.7)

        return tl
    }

    function animateForSevenScreen() {
        const tl = gsap.timeline()

        tl.fromTo('.partners__top', {
            y: -30,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 1
        })
        .fromTo('.js-partners__slider', {
            y: 40,
            opacity: 0
        }, {
            y: 0,
            opacity: 1
        }, 0.5)

        return tl
    }

    function animateForEightScreen() {
        const tl = gsap.timeline()

        tl.fromTo('.team__title', {
            y: -30,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 1
        })
        .fromTo('.team__item', {
            y: 40,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 1.3,
            stagger: 0.15
        }, 0.6)
        return tl
    }

    function animateForNinetScreen() {
        const tl = gsap.timeline()

        tl.fromTo('.js-btn-top', {
            x: 150,
        }, {
            x: 0,
            duration: 1
        })
        .fromTo('.contacts__left', {
            y: 40,
            opacity: 0
        }, {
            y: 0,
            opacity: 1
        }, 0.5)
        .fromTo('.contacts-form', {
            x: '100%',
        }, {
            x: 0,
            duration: 1
        }, 0.5)

        return tl
    }

    const animateObj = {
        first: animateForFirstScreen,
        second: animateForSecondScreen,
        three: animateForThreeScreen,
        four: animateForFourScreen,
        five: animateForFiveScreen,
        six: animateForSixScreen,
        seven: animateForSevenScreen,
        eight: animateForEightScreen,
        nine: animateForNinetScreen
    }

    gsap.utils.toArray('[data-section]').forEach((sec) => {
        const animationName = $(sec).data().section
        const fn = animateObj[animationName]

        switch (animationName) {
            case 'first': {
                createScrollTrigger({
                    trigger: sec
                }, fn)
                break
            }
            case 'second': {
                createScrollTrigger({
                    trigger: sec
                }, fn)
                break
            }
            case 'three': {
                createScrollTrigger({
                    trigger: sec
                }, fn, false)
                break
            }
            case 'four': {
                createScrollTrigger({
                    trigger: sec
                },fn, false)
                break
            }
            case 'five': {
                createScrollTrigger({
                    trigger: sec
                }, fn, false)
                break
            }
            case 'six': {
                createScrollTrigger({
                    trigger: sec
                }, fn, false)
                break
            }
            case 'seven': {
                createScrollTrigger({
                    trigger: sec
                }, fn, false)
                break
            }
            case 'eight': {
                createScrollTrigger({
                    trigger: sec
                }, fn, false)
                break
            }
            // case 'nine': {
            //     createScrollTrigger({
            //         trigger: sec
            //     }, fn, false)
            //     break
            // }
        }
    })

    function createScrollTrigger(opts, fn, scrub = true) {
        ScrollTrigger.create({
            scrub,
            animation: fn(),
            ...opts,
        })
    }
})



const amplitude = document.documentElement.clientWidth < 576 ? 20 : 40;
const doublePartImages = document.querySelectorAll('[data-double-part-block]');
const slideLeftImages = document.querySelectorAll('[data-slide-left]');
const slideRightImages = document.querySelectorAll('[data-slide-right]');
slideRightImages.forEach(paralaxImg => {
    let imgToAnimate = paralaxImg.querySelector('.double-part-block__img-main img') || paralaxImg;
    let height = imgToAnimate.getBoundingClientRect().height;
    gsap.set(paralaxImg, { autoAlpha: 0, x: '100%' })
    // gsap.set(imgToAnimate, { scale: scaleCoef })
    ScrollTrigger.create({
        trigger: paralaxImg,
        end: "bottom",
        onEnter: self => {
            if (!imgToAnimate.cliPathed) {
                imgToAnimate.cliPathed = true;
                gsap.to(paralaxImg, { autoAlpha: 1, x: 0,ease: Power4.easeInOut, duration: 2.5 })
            }
        },

    });
})
slideLeftImages.forEach(paralaxImg => {
    let imgToAnimate = paralaxImg.querySelector('.double-part-block__img-main img') || paralaxImg;
    let height = imgToAnimate.getBoundingClientRect().height;
    gsap.set(paralaxImg, { autoAlpha: 0, x: '-100%' })
    // gsap.set(imgToAnimate, { scale: scaleCoef })
    ScrollTrigger.create({
        trigger: paralaxImg,
        end: "bottom",
        onEnter: self => {
            if (!imgToAnimate.cliPathed) {
                imgToAnimate.cliPathed = true;
                gsap.to(paralaxImg, { autoAlpha: 1, x: 0,ease: Power4.easeInOut, duration: 2 })
            }
        },

    });
})
doublePartImages.forEach(paralaxImg => {
    let imgToAnimate = paralaxImg.querySelector('.double-part-block__img-main img') || paralaxImg;
    let height = imgToAnimate.getBoundingClientRect().height;
    let scaleCoef = (height + (amplitude)) / height;
    gsap.set('.promo__title', { autoAlpha: 0, x: 50 })
    // gsap.set(imgToAnimate, { scale: scaleCoef })
    gsap.set(imgToAnimate, { scale: scaleCoef })
    gsap.set(imgToAnimate, { webkitClipPath: `polygon(100% 0px, 100% 0px, 100% 100%, 100% 100%)`, });
    ScrollTrigger.create({
        trigger: paralaxImg,
        end: "bottom",
        onEnter: self => {
            if (!imgToAnimate.cliPathed) {
                gsap.to(imgToAnimate, { webkitClipPath: `polygon(100% 0px, 0px 0px, 0px 100%, 100% 100%)`, ease: Power4.easeInOut, duration: 1.5 });
                imgToAnimate.cliPathed = true;
                gsap.to('.promo__title', { autoAlpha: 1, x: 0,ease: Power4.easeInOut, duration: 1.5 })
            }
        },
        onUpdate: self => {
            gsap.to(imgToAnimate, { scale: 1 + self.progress / 10, y: amplitude / -2 + self.progress * amplitude, duration: 0.25 });
        },

    });
})