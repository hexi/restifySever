exports.isNotBlank = function(holder){
  var _temp;
  for (var i in holder) {
    _temp = holder[i];
    if(!_temp.content || _temp.content === ''){
      throw Error(_temp.message);
    }
  };
}