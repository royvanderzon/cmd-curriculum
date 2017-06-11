var zoncms = {
	ajax : {
		sendData : function(obj,data,cbSucces,cbFailure){
	        $.ajax({
	            type: 'POST',
	            data: JSON.stringify(data),
	            contentType: 'application/json',
	            url: obj.link,                      
	            success: function(data) {
	                // console.log(JSON.stringify(data));
	                if(typeof cbSucces === "function"){
	                    cbSucces(data);
	                }
	            },
	            error: function(data) {
	                if(typeof cbFailure === "function"){
	                    cbFailure(data);
	                }
	            }
	        });
	    },
		sendData2 : function(obj){
			// var obj = {
			// 	data : data,
			// 	link : link,
			// 	cbSucces : cbSucces,
			// 	cbFailure : cbFailure
			// }
	        $.ajax({
	            type: 'POST',
	            data: JSON.stringify(obj.data),
	            contentType: 'application/json',
	            url: obj.link,                      
	            success: function(data) {
	                // console.log(JSON.stringify(data));
	                if(typeof obj.cbSucces === "function"){
	                    obj.cbSucces(data);
	                }
	            },
	            error: function(data) {
	                if(typeof obj.cbFailure === "function"){
	                    obj.cbFailure(data);
	                }
	            }
	        });
	    }
	}
}