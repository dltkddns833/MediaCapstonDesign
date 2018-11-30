angular.module('capstonCanvas',[
    'color.picker',
    'core'
]).
directive('canvasDirective', function(){
    return {
        restrict : 'E',
        scope : {
            activity : '@'
        },
        templateUrl : 'capston-canvas/capstonCanvas.template.html',
        controller : function($scope, restService){
            var ctrl = this;
            console.log('Directive Controller2');
            $scope.reset = false;

            $scope.onClickReset = function(event){
                $scope.event = event;
                $scope.reset = !$scope.reset;
            }
            $scope.onclickSavebutton = function(){
                var download = document.getElementById("download");
                var image = document.getElementById("canvas").toDataURL("image/jpeg");
                // download.setAttribute("href", image);
                restService.capston.insertImg({
                    img_data : image
                }).$promise.then(function(response){
                    alert('저장 완료');
                    console.log(response)
                })
            }
            

        },
        link : function($scope, element){
            var canvas = element.find('canvas');
            var ctx = canvas[0].getContext('2d');
      
            var drawing = false;
            
            var lastX;
            var lastY;

            var canvas_w = canvas[0].clientWidth;
            var canvas_h = canvas[0].clientHeight;

            $scope.canvas_lineWidth = 5;

            var initCanvas = function(){
                
                ctx.beginPath();
                ctx.rect(0, 0, canvas_w-6, canvas_h-6);
                ctx.fillStyle = "white";
                ctx.lineWidth = $scope.canvas_lineWidth;
                ctx.lineJoin = 'bevel';
                ctx.lineCap = 'round';
                ctx.fill();
            }

            initCanvas();

            canvas.bind('mousedown', function(event){
                
                lastX = event.offsetX;
                lastY = event.offsetY;
                
                ctx.beginPath();
                drawing = true;
            });
            canvas.bind('mousemove', function(event){
                if(drawing){
                    currentX = event.offsetX;
                    currentY = event.offsetY;
                    
                    draw(lastX, lastY, currentX, currentY);
                    
                    lastX = currentX;
                    lastY = currentY;
                }
                
            });
            canvas.bind('mouseup', function(event){
                drawing = false;
            });
            

            // Event
            $scope.onclickResetbutton = function(){
                canvas[0].width = canvas[0].width;
                initCanvas(); 
            }

            

            // $scope.onclickSavebutton = function(){
            //     var download = document.getElementById("download");
            //     var image = document.getElementById("canvas").toDataURL("image/jpg").replace("image/jpg", "image/octet-stream");
            //     // download.setAttribute("href", image);
            //     restService.capston.insertImg({
            //         img_data : image
            //     }).$promise.then(function(response){
            //         console.log(response)
            //     })
            // }
                
            // Color Picker
            $scope.myColor = 'rgb(0, 0, 0)';
 
            // options - if a list is given then choose one of the items. The first item in the list will be the default
            $scope.options = {
                // html attributes
                required: true,
                disabled: false,
                restrictToFormat: false,
                format: 'rgb',
                case: 'upper',
                hue: true,
                saturation: false,
                lightness: false, // Note: In the square mode this is HSV and in round mode this is HSL
                alpha: false,
                dynamicHue: false,
                dynamicSaturation: false,
                dynamicLightness: false,
                dynamicAlpha: false,
            };

            function draw(lX, lY, cX, cY){
                ctx.moveTo(lX,lY);
                ctx.lineTo(cX,cY);
                ctx.strokeStyle = $scope.myColor;
                ctx.lineWidth = $scope.canvas_lineWidth;
                ctx.stroke();
            }
        }
    }
})