(function() {

    console.log(years)

    $(document).ready(function() {
        app.init()
    })

    var app = {
        init: function() {
            self = this
            self.function.initNavPos()
            self.function.getClosestCurriculumContainer()
            self.event.modal.init()
            self.event.item.init()
            self.event.hashChange.init()
            self.event.scroll.init()
            self.dom.setSameHeight('.curriculem-item')
        },
        options: {
            menuItems: []
        },
        function: {
            initNavPos: function() {
                var menuItems = []
                years.forEach(function(year) {
                    var obj = {}
                    var divOffset = self.function.offset($('#year_container_' + year.ID).element);
                    obj.id = year.ID
                    obj.top = divOffset.top
                    menuItems.push(obj)
                    $('#menu_item_' + year.ID + ' a').on('click', function() {
                        $('#year_container_' + year.ID).element.scrollIntoView({
                            behavior: 'smooth'
                        });
                    })
                })
                self.options.menuItems = menuItems
                console.log(self.options.menuItems)
            },
            setNavActive: function(id) {
                $('.menu-item').element.forEach(function(navItem) {
                    $(navItem).removeClass('active')
                })
                $('#menu_item_' + id).addClass('active')
            },
            getClosestCurriculumContainer: function() {
                var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                function getNearestNumber(a, n) {
                    if ((l = a.length) < 2)
                        return l - 1;
                    for (var l, p = Math.abs(a[--l].top - n); l--;)
                        if (p < (p = Math.abs(a[l].top - n)))
                            break;
                    return l + 1;
                }
                var array = self.options.menuItems.sort(function(a, b){
					return a.top - b.top;
				});
                var closest = getNearestNumber(array,scrollTop)
                self.function.setNavActive(self.options.menuItems[closest].id)
            },
            offset: function(el) {
                var rect = el.getBoundingClientRect(),
                    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
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
                        self.function.getClosestCurriculumContainer()
                    })
                },

            },
            hashChange: {
                init: function() {
                    $(window).on('hashchange', function() {
                        var hash = window.location.hash
                        var hashArray = hash.split('#')
                        // self.function.setNavActive(hashArray[1])
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
                                $('.modal').show(200)
                            })
                        })
                    })
                }
            },
            modal: {
                init: function() {
                    $('.overlay').on('click', function() {
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
