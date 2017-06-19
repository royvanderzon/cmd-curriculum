(function() {

	$(document).ready(function(){
		app.init()
	})

	var app = {
		init : function(){
			self = this
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
		}
	}

}());