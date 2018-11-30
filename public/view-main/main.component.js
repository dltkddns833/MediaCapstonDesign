angular.module('main', [
    'ui.bootstrap',
    'ui.router',
    'color.picker',
    'core'
]).
component('main',{
    templateUrl : 'view-main/main.template.html',
    controller : [
        '$scope', 
        'capstonshared',
        'restService',
        '$http',
        '$anchorScroll',
        '$window',
        '$document',
        function mainController($scope, capstonshared, restService, $http, $anchorScroll, $window, $document){
            var ctrl = this;
            var keyword_q;

            ctrl.item_data = [];
            ctrl.reitem_data = [];
            ctrl.reitem_data_value = [];
            ctrl.isSearching = false;
            ctrl.isShowCanvas = false;
            ctrl.isShowReitem = false;
            ctrl.isCompleteSearchBottle = false;
            ctrl.isCompleteCanvasBottle = false;
            ctrl.scrollPos = 0;
            ctrl.showHighlight = false;

            $anchorScroll.yOffset = 50;
            // Alert
            ctrl.alerts = [];

            ctrl.addAlert = function(message_type, message) {
                var ty = '';
                if(message_type == 200){
                    ty = 'success'
                }else{
                    ty = 'danger'
                }
                ctrl.alerts.push({type: ty, msg: message});
            };
            
            ctrl.closeAlert = function(index) {
                ctrl.alerts.splice(index, 1);
            }

            $scope.gotoAnchor = function(x) {
                var offset = $("#" + x).offset();
                $('html, body').animate({scrollTop : offset.top}, 400);
            }

            $document.on('scroll', function() {
                // do your things like logging the Y-axis
                // or pass this to the scope
                $scope.$apply(function() {
                    ctrl.scrollPos = $window.scrollY;
                    if(ctrl.scrollPos >= 700){
                        ctrl.showHighlight = true;
                    }else{
                        ctrl.showHighlight = false;
                    }
                })
            });
            
            // Init

            var parsingImage = function(q){
                ctrl.isShowReitem = false;
                var count = 1;
                keyword_q = q;
                restService.capston.getParsingImage({
                    keyword : q
                }).$promise.then(function(response){
                    console.log('검색 및 저장 완료');
                    ctrl.addAlert(200, q + '검색을 완료하였습니다.');
                    for(var i = 0; i < 80; i++){
                        ctrl.item_data.push('../download_img/search_img/' + q + '_' + count + '.jpg');
                        count = count + 1
                    }
                    ctrl.isSearching = false;
                    SearchtensorflowRetrain();
                })
                console.log(ctrl.isSearching);
            };

            var SearchtensorflowRetrain = function(){
                ctrl.isCompleteSearchBottle = true;
                restService.capston.getSearchRetrain({

                }).$promise.then(function(response){
                    console.log(response);
                    ctrl.addAlert(200, '벡터 변환을 완료하였습니다.');
                    ctrl.isCompleteSearchBottle = false;
                })
            }
            
            var CanvastensorflowRetrain = function(){
                restService.capston.getCanvasRetrain({

                }).$promise.then(function(response){
                    console.log(response);
                    calculateNorm();
                })
            }

            var calculateNorm = function(){
                restService.capston.getNorm({
                    keyword : keyword_q
                }).$promise.then(function(response){
                    console.log(response);
                    reLineupImage(response);
                })
            }

            var reLineupImage = function(req){
                ctrl.reitem_data = [];
                ctrl.reitem_data_value = [];
                var res = [];
                for(var i = 0; i < 80; i++){
                    res.push({
                        'index' : i+1, 
                        'value' : req[i]*=1}
                    );
                }
                res.sort(function(a, b) { // 오름차순
                    return a["value"] - b["value"];
                });
                for(var i = 0; i < 80; i++){
                    ctrl.reitem_data.push('../download_img/search_img/' + keyword_q + '_' + res[i].index + '.jpg');
                    ctrl.reitem_data_value.push(res[i].value)
                }
                ctrl.isShowReitem = true;
                ctrl.isCompleteCanvasBottle = false;
                ctrl.addAlert(200, '이미지 재정렬 완료');
                deleteCanvas();
                deleteCanvasBottle();
            }
            
            var deleteAllImage = function(){
                restService.capston.deleteImage({
                }).$promise.then(function(response){
                    console.log('삭제완료');
                    ctrl.item_data = [];
                })
            }

            var deleteCanvas = function(){
                restService.capston.deleteCanvas({
                }).$promise.then(function(response){
                    console.log('캔버스 삭제완료');
                })
            }

            var deleteCanvasBottle = function(){
                restService.capston.deleteCanvasBottleneck({
                }).$promise.then(function(response){
                    console.log('Bottleneck 삭제 완료')
                })
            }

            var deleteBottle = function(){
                restService.capston.deleteBottleneck({
                }).$promise.then(function(response){
                    console.log('Bottleneck 삭제 완료')
                })
            }
            
            // Event
            ctrl.onClicksearch = function(q){
                ctrl.item_data = [];
                ctrl.isSearching = true;
                deleteAllImage();
                deleteBottle();
                parsingImage(q);
            }

            ctrl.onClickDelete = function(){
                deleteAllImage();
                ctrl.isShowCanvas = false;
            }

            ctrl.onClickCanvas = function(){
                ctrl.isShowCanvas = !ctrl.isShowCanvas;
            }

            ctrl.onClickSubmit = function(){
                ctrl.reitem_data = [];
                openCV();
            }

            ctrl.onClickTensorflowSubmit = function(){
                ctrl.isCompleteCanvasBottle = true;
                CanvastensorflowRetrain();
            }

            ctrl.onClickNrom = function(){
                calculateNorm();
            }

            

            /*Initialize*/
            ctrl.$onInit = function () {
                deleteAllImage();
                deleteBottle();
            };

        }]
});