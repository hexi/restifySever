exports.handleQueryResult = function(error, result, options){
  if(error){
    console.log(error);
    if(options.error){
      options.error(error);
    }
  }else{
    options.success(result);
  }
}