var milkcocoa = new MilkCocoa("https://io-ci8scyn06.mlkcca.com");
var potisionDataStore = milkcocoa.dataStore("position");

console.log(getQueryString().token);
//アクセスユーザー固有のtokenを作成する
if(!getQueryString().token){
  var token = Math.random().toString(36).slice(-8);
  window.location = "./index.html?token="+token;
}

window.onload = function(){
}

function sendControl(valueX,valueY){
  potisionDataStore.push({positionX : valueX,positionY : valueY},function(data){
    console.log("milkcocoa送信完了!");
  });
}

potisionDataStore.on("push",function(data){
  console.log(data.value);
});

//URLの文字列を取得
function getQueryString(){
    var result = {};
    if( 1 < window.location.search.length ){
        var query = window.location.search.substring( 1 );
        var parameters = query.split( '&' );
        for( var i = 0; i < parameters.length; i++ ){
            var element = parameters[ i ].split( '=' );
            var paramName = decodeURIComponent( element[ 0 ] );
            var paramValue = decodeURIComponent( element[ 1 ] );
            result[ paramName ] = paramValue;
        }
    }
    return result;
}

