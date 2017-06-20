(function() {

	console.log(years)

	$(document).ready(function(){
		app.init()
	})

	var app = {
		init : function(){
			self = this
			self.event.modal.init()
			self.event.item.init()
			self.event.hashChange.init()
			// self.dom.setSameHeight('.curriculem-item')
		},
		dom : {
			setSameHeight : function(domEl){
				var biggestHeight = 0
				$(domEl).element.forEach(function(el){
					elHeight = $(el).height()
					if(elHeight > biggestHeight){
						biggestHeight = elHeight
					}
				})
				$(domEl).element.forEach(function(el){
					$(el).height(biggestHeight)
				})
			}
		},
		event : {
			hashChange : {
				init : function(){
					$(window).on('hashchange',function(){
						console.log(window.location.hash)
						var hash = window.location.hash
						var hashArray = hash.split('#')
						$('.menu-item').element.forEach(function(navItem){
							console.log($(navItem))
							// if($(navItem).hasClass('active')){
								$(navItem).removeClass('active')
							// }
						})
						$('#menu_item_'+hashArray[1]).addClass('active')
					})
				}
			},
			item : {
				init : function(){


					$('.item-modal').element.forEach(function(item){
						$(item).on('click',function(){
							var id = $(this).attr('data-id')
							var idArray = id.split('-')
							var year = Number(idArray[0])
							var row = Number(idArray[1])
							var column = Number(idArray[2])
							var item = Number(idArray[3])
							var thisItem = years[year].data.rows[row][column].column[item]
							self.helper.modal(thisItem,function(){
								$('.modal').show(200)
							})
						})
					})
				}
			},
			modal : {
				init : function(){
					$('.overlay').on('click',function(){
						$('.modal').hide(200)
					})
				}
			}
		},
		helper : {
			modal : function(content,cb){
				var wysiwyg = JSON.parse(content.content)

				function quillGetHTML(inputDelta) {
				    var tempCont = document.createElement("div");
				    (new Quill(tempCont)).setContents(inputDelta);
				    return tempCont.getElementsByClassName("ql-editor")[0].innerHTML;
				}

				$('.modal .content').html(quillGetHTML(wysiwyg))
				$('.modal header h2').html(content.title)
				if(content.image.length > 0){
					$('.modal header').element.style.backgroundImage = 'url("'+content.image+'")'
				}else{
					$('.modal header').element.style.backgroundImage = 'url("/cms/images/noimg.png")'
				}

				if(typeof cb === 'function') cb()
			}
		}
	}

}());