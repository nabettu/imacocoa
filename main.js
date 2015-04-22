var milkcocoa = new MilkCocoa("https://io-ci8scyn06.mlkcca.com");
var potisionDataStore = milkcocoa.dataStore("position");

//初回アクセスの場合はアクセスユーザー固有のpage_idを作成する
if(!getQueryString().page_id){
  var page_id = Math.random().toString(36).slice(-20);
  window.location = "./index.html?page_id="+page_id;
}

window.onload = function(){
  //同じページを見ているユーザー一覧を読み込む

  //地図の拡縮をユーザーが全員入る様に変更する
}

function sendMyPosition(){
  var userName = $("#name")[0].value;
  //データ送信
  potisionDataStore.push({userName : userName},function(data){
    console.log("milkcocoa送信完了!");
  });
}

//データ受信監視
potisionDataStore.on("push",function(data){
  console.log(data.value);
  //page_IDの照合

  var userDom = document.createElement("li");
  userDom.innerHTML = data.value.userName;
  $("#userList").append(userDom);

  //地図の拡縮をユーザーが全員入る様に変更
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

