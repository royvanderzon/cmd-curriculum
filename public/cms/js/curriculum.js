//sendData post:
// //1# data
// //2# succes callback
// //3# failure callback
// sendData(data,function(){
//     // success
//     $('#status_'+data.key).removeClass('red-text');
//     $('#status_'+data.key).addClass('green-text');
//     $('#status_'+data.key).html('checkmark');

//     $('#status_'+data.key).tooltip({
//         delay : 50,
//         tooltip : 'Saved',
//         position : 'right'
//     });
// },function(){
//     // failure
//     $('#status_'+data.key).removeClass('green-text');
//     $('#status_'+data.key).addClass('red-text');
//     $('#status_'+data.key).html('close');

//     $('#status_'+data.key).tooltip({
//         delay : 50,
//         tooltip : 'No connection',
//         position : 'right'
//     });
// });