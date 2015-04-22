var milkcocoa = new MilkCocoa("https://io-ci8scyn06.mlkcca.com");
var potisionDataStore = milkcocoa.dataStore("position");

//初回アクセスの場合はアクセスユーザー固有のpage_idを作成する
if(!getQueryString().pageId){
  var pageId = Math.random().toString(36).slice(-10);
  window.location = "./index.html?pageId="+pageId;
}

var userId = Math.random().toString(36).slice(-5);
var userName = "";
var sendFlg = true;
var map;

window.onload = function(){
   map = new GMaps({
                div: "#map",
                lat: 35.56,
                lng: 139.69,
                zoom: 6,
            });

            map.addStyle({
                styledMapName:"Styled Map",
                styles: styles,
                mapTypeId: "map_style"
            });

            map.setStyle("map_style");
            //すでに同じページを見ているユーザー一覧を読み込む


  //地図の拡縮をユーザーが全員入る様に変更する
}


function sendMyPosition(){
  if(!$("#name")[0].value){
    alert("名前を入力してください");
    return 0;
  }
  userName = $("#name")[0].value;
  $("#sender").hide();

  //位置情報取得
  navigator.geolocation.watchPosition(
    function(position){

      //GPSなぜか勝手にたくさん何度も送るので１回だけにさせる→更新したい場合はflgをtrueにする
      if(sendFlg){
        var lat=position.coords.latitude;
        var lon=position.coords.longitude;

        //データ送信
        potisionDataStore.push({
          pageId : getQueryString().pageId,
          userName : userName,
          userId : userId,
          lat : lat,
          lon : lon
        },
          function(data){
            sendFlg = false;
            console.log("milkcocoa送信完了!");
          }
        );
      };
    }
  );
}

//データ受信監視
potisionDataStore.on("push",function(data){
  console.log(data.value);

  //page_IDの照合
  if(getQueryString().pageId == data.value.pageId){
    var userDom = document.createElement("li");
    userDom.innerHTML = data.value.userName+"さんが参加しました。";
    $("#userList").append(userDom);

    map.addMarker({
        lat: data.value.lat,
        lng: data.value.lon,
        infoWindow: {
            content: "<p class='tag'>"+data.value.userName+"</p>"
        }
    });
    //地図の拡縮をユーザーが全員入る様に変更
  }
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
