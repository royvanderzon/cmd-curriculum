(function() {

    // console.log(years)

    $(document).ready(function() {
        app.init()
    })

    var app = {
        init: function() {
            self = this
            self.function.initNavPos()
            self.function.getClosestCurriculumContainer()
            self.function.initSlider()
            self.function.checkActivity()
            self.function.background.init()
            self.function.qr()
            self.event.modal.init()
            self.event.item.init()
            self.event.viewChange.init()
            self.event.categoryControl.init()
            self.event.hashChange.init()
            self.event.scroll.init()
            self.dom.setSameHeight('.curriculem-item')
        },
        options: {
            menuItems: [],
            window: {
                height: 0,
                width: 0
            },
            document: {
                height: 0
            }
        },
        function: {
            qr : function(){
                var url = ((window.location.href).split('#'))[0]
                var qrcode = new QRCode("qrcode");
                qrcode.makeCode(url);
                $('.set-site-url').html(url)
                $('.set-site-url').attr('href',url)

            },
            background: {
                init: function() {
                    var body = document.body,
                        html = document.documentElement
                    var documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
                    self.options.window.height = window.innerHeight
                    self.options.window.width = window.innerWidth
                    self.options.document.height = documentHeight

                    console.log(self.options)
                },
                move: function(scrollTop) {

                    var totalScrollable = self.options.document.height - self.options.window.height
                    var basis = 0;

                    var scrollDown = 

                    // 0px | 3500px
                    // 100px

                    console.log(scrollTop)

                }
            },
            initSlider: function() {
                if (slideActive) {

                    $('.slider-container').on('click', function() {
                        $(this).hide(200)
                    })

                    var slides = document.querySelectorAll('#slides .slide');
                    var currentSlide = 0;
                    var slideInterval = setInterval(nextSlide, 10000);

                    function nextSlide() {
                        slides[currentSlide].className = 'slide';
                        currentSlide = (currentSlide + 1) % slides.length;
                        slides[currentSlide].className = 'slide showing';
                    }
                    nextSlide()
                }
            },
            checkActivity: function() {
                if (!slideActive) return;
                if (sliderTimeout == null) {
                    var IDLE_TIMEOUT = 60 * 10 //seconds (10 minutes)
                } else {
                    var IDLE_TIMEOUT = sliderTimeout * 60
                }
                var _idleSecondsCounter = 0;
                document.onclick = function() {
                    _idleSecondsCounter = 0;
                };
                document.onmousemove = function() {
                    _idleSecondsCounter = 0;
                };
                document.onkeypress = function() {
                    _idleSecondsCounter = 0;
                };

                var myInterval = window.setInterval(CheckIdleTime, 1000);

                function CheckIdleTime() {
                    _idleSecondsCounter++;
                    // console.log(IDLE_TIMEOUT - _idleSecondsCounter)
                    if (_idleSecondsCounter >= IDLE_TIMEOUT) {
                        _idleSecondsCounter = 0
                        if ($('.slider-container').element.style.visibility == 'hidden') {
                            $('.slider-container').show(200)
                                // console.log('showing slideshow')
                        }
                    }
                }
            },
            initNavPos: function() {
                var menuItems = self.function.calcNavPos()
                years.forEach(function(year) {
                    $('#menu_item_' + year.ID + ' a').on('click', function(e) {
                        $('#year_container_' + year.ID).element.scrollIntoView({
                            behavior: 'smooth'
                        });
                    })
                })

                $('#menu_item_' + 'legenda' + ' a').on('click', function(e) {
                    $('#year_container_' + 'legenda').element.scrollIntoView({
                        behavior: 'smooth'
                    });
                })

                self.options.menuItems = menuItems
            },
            calcNavPos: function() {
                var menuItems = []
                years.forEach(function(year) {
                    var obj = {}
                    var divOffset = self.function.offset($('#year_container_' + year.ID).element);
                    obj.id = year.ID
                    obj.top = divOffset.top
                    menuItems.push(obj)
                })

                function addLegenda() {
                    var obj = {}
                    var divOffset = self.function.offset($('#year_container_' + 'legenda').element);
                    obj.id = 'legenda'
                    obj.top = divOffset.top
                    menuItems.push(obj)
                }
                addLegenda()

                return menuItems
            },
            setNavActive: function(id) {
                $('.menu-item').element.forEach(function(navItem) {
                    $(navItem).removeClass('active')
                })
                $('#menu_item_' + id).addClass('active')
            },
            getClosestCurriculumContainer: function(scrollTop) {

                function getNearestNumber(a, n) {
                    if ((l = a.length) < 2)
                        return l - 1;
                    for (var l, p = Math.abs(a[--l].top - n); l--;)
                        if (p < (p = Math.abs(a[l].top - n)))
                            break;
                    return l + 1;
                }
                var array = self.options.menuItems.sort(function(a, b) {
                    return a.top - b.top;
                });
                var closest = getNearestNumber(array, scrollTop)
                self.function.setNavActive(self.options.menuItems[closest].id)
            },
            offset: function(el) {
                var rect = el.getBoundingClientRect(),
                    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
            },
            viewCategory: function(cat) {
                //design - interaction - code - nothing
                $('.curriculem-item').element.forEach(function(el) {
                    if (cat == 'all') {
                        $(el).removeClass('supress-item')
                    } else {
                        if (!$(el).element.classList.contains('cat_' + cat)) {
                            $(el).addClass('supress-item')
                        } else {
                            $(el).removeClass('supress-item')
                        }
                    }
                })
            }
        },
        dom: {
            setSameHeight: function(domEl) {
                var biggestHeight = 0
                $(domEl).element.forEach(function(el) {
                    elHeight = $(el).height()
                    if (elHeight > biggestHeight) {
                        biggestHeight = elHeight
                    }
                })
                $(domEl).element.forEach(function(el) {
                    $(el).height(biggestHeight)
                })
            }
        },
        event: {
            scroll: {
                init: function() {
                    $(window).on('scroll', function() {
                        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                        self.function.getClosestCurriculumContainer(scrollTop)
                        self.function.background.move(scrollTop)

                    })
                },

            },
            categoryControl: {
                init: function() {
                    $('.cat_control').element.forEach(function(el) {
                        $(el).on('click', function() {
                            $('.cat_control').element.forEach(function(subEl) {
                                $(subEl).removeClass('active')
                            })
                            $(el).addClass('active')
                            var cat = $(el).attr('data-cat')
                            self.function.viewCategory(cat)
                        })
                    })
                }
            },
            hashChange: {
                init: function() {
                    $(window).on('hashchange', function() {
                        var hash = window.location.hash
                        var hashArray = hash.split('#')
                            // self.function.setNavActive(hashArray[1])
                            // $('.modal').show(200)
                    })
                }
            },
            item: {
                init: function() {
                    $('.item-modal').element.forEach(function(item) {
                        $(item).on('click', function() {
                            var id = $(this).attr('data-id')
                            var idArray = id.split('-')
                            var year = Number(idArray[0])
                            var row = Number(idArray[1])
                            var column = Number(idArray[2])
                            var item = Number(idArray[3])
                            var thisItem = years[year].data.rows[row][column].column[item]
                            self.helper.modal(thisItem, function() {
                                $('.modal').show(200, function() {
                                    console.log('hoi')
                                    $('.close-modal').element.focus();
                                })
                            })
                        })
                    })
                }
            },
            viewChange: {
                init: function() {
                    $('.view-button').element.forEach(function(button) {
                        // $('.curriculem-wrapper')
                        $(button).on('click', function() {
                            var view = $(this).attr('data-view')
                            $('.view-button').element.forEach(function(thisButton) {
                                $(thisButton).removeClass('pressed');
                            })
                            $(this).addClass('pressed');
                            switch (view) {
                                case 'list':
                                    $('.curriculem-wrapper').addClass('list-view')
                                    break;
                                case 'table':
                                    $('.curriculem-wrapper').removeClass('list-view')
                                    break;
                            }
                            self.options.menuItems = []
                            self.options.menuItems = self.function.calcNavPos()
                        })
                    })
                }
            },
            modal: {
                init: function() {
                    $('.overlay').on('click', function() {
                        $('.modal').hide(200)
                    })
                    $('.close-modal').on('click', function() {
                        $('.modal').hide(200)
                    })
                }
            }
        },
        helper: {
            modal: function(content, cb) {
                var wysiwyg = JSON.parse(content.content)

                function quillGetHTML(inputDelta) {
                    var tempCont = document.createElement("div");
                    (new Quill(tempCont)).setContents(inputDelta);
                    return tempCont.getElementsByClassName("ql-editor")[0].innerHTML;
                }

                $('.modal .content').html(quillGetHTML(wysiwyg))
                $('.modal header h2').html(content.title)
                if (content.image.length > 0) {
                    $('.modal header').element.style.backgroundImage = 'url("' + content.image + '")'
                } else {
                    $('.modal header').element.style.backgroundImage = 'url("/cms/images/noimg.png")'
                }

                if (typeof cb === 'function') cb()
            }
        }
    }

}());
