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
var userList = [];
var centerLat=35.5;
var centerLon=139.6;

window.onload = function(){
   map = new GMaps({
                div: "#map",
                lat: 35.5,
                lng: 139.6,
                zoom: 10,
            });

  map.addStyle({
      styledMapName:"Styled Map",
      styles: styles,
      mapTypeId: "map_style"
  });
  map.setStyle("map_style");

  //すでに同じページを見ているユーザー一覧を読み込む
  var query = potisionDataStore.query({pageId : getQueryString().pageId });
  query.limit(30);
  query.done(function(data){
//    console.log(data);
    for(var i=0; i<data.length; i++){
      if(getQueryString().pageId == data[i].pageId){
        userList.push(data[i]);
      }
    }
    dataUpdate();
  });
}


function sendMyPosition(){
  if(!$("#name")[0].value){
    alert("名前を入力してください");
    return 0;
  }
  userName = $("#name")[0].value;
  $("#sender").hide();
  $("#done").show();

  //位置情報取得
  navigator.geolocation.watchPosition(
    function(position){

      //GPSなぜか勝手にたくさん何度も送るので１回だけにさせる→更新したい場合はflgをtrueにする
      if(sendFlg){
        sendFlg = false;
        var lat=position.coords.latitude;
        var lon=position.coords.longitude;

        var time = new Date().getTime();

        //データ送信
        potisionDataStore.push({
          pageId : getQueryString().pageId,
          userName : userName,
          userId : userId,
          lat : lat,
          lon : lon,
          time : time
        },
          function(data){
            //console.log("milkcocoa送信完了!");
          }
        );
      };
    }
  );
}

//データ受信監視
potisionDataStore.on("push",function(data){
  if(getQueryString().pageId == data.value.pageId){
    userList.push(data.value);
    dataUpdate();
    
    map.setCenter(data.value.lat,data.value.lon);
  }
});

//userListに値を入れる＋domを追加
function dataUpdate(){
  $("#userList")[0].innerHTML = "";
  map.removeMarker();

  centerLat=0;
  centerLon=0;

  for(var i=0; i<userList.length;i++){
    var userDom = document.createElement("li");
    userDom.innerHTML = userList[i].userName+"さんが参加しました。";
    $("#userList").append(userDom);

    map.addMarker({
        lat: userList[i].lat,
        lng: userList[i].lon,
        infoWindow: {
            content: "<p class='tag'>"+userList[i].userName+"</p>"
        }
    });

    //中間地点を割り出す
    centerLat = centerLat + userList[i].lat;
    centerLon = centerLon + userList[i].lon;
  }

//中心マーカー
  if(userList.length>1){
    centerLat = centerLat / userList.length;
    centerLon = centerLon / userList.length;
    map.addMarker({
        lat: centerLat,
        lng: centerLon,
        infoWindow: {
            content: "<p class='tag'>中心</p>"
        }
    });

  //中心地の最寄り駅を持ってくる
    var centerStationUrl = "http://express.heartrails.com/api/json?method=getStations&x="+centerLon+"&y="+centerLat+"&callback=?";

    $.getJSON(centerStationUrl,
      {},
      function(data){
        //リクエストが成功した際に実行する関数
        $("#centerStationName")[0].innerHTML = data.response.station[0].name;
        $("#centerStation").show();
      }
    );

  }
}

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
