"use strict"
var imgBtn;
var ani_step_lit;
var ani_step_all;
var rotate;
var ani_autoWalk = "ani_autoWalk";//动画自动漫游cookie中对应的key
var ani_speed = "ani_speed";//动画播放速度cookie中对应的值
var ani_loop = "ani_loop";//动画播放速度cookie中对应的值
var screenWidth = document.documentElement.clientWidth;
var screenHeight = document.documentElement.clientHeight;
var topModle;
var isConfirmTextNote;

// 获取资源路径
var currentJSPath = document.scripts[document.scripts.length - 1].src;
var currentJSArray = document.scripts[document.scripts.length - 1].src.split('/')
currentJSArray.pop();
currentJSArray.pop();
var jsFilePath = "";
for (var num = 0; num < currentJSArray.length; num++){
    jsFilePath = jsFilePath + currentJSArray[num] + "/";
}

// 移动端浏览器缩放适配
function stopScroll() { 
        document.getElementsByClassName("container-fluid")[0].addEventListener('touchstart', function (event) {
		  if(event.touches.length>1){ 
			event.preventDefault(); 
		  } 
		})
        document.getElementsByClassName("container-fluid")[0].addEventListener('touchmove', function (event) {
		    if (event.touches.length > 1) {
		        event.preventDefault();
			}
		}) 
		var lastTouchEnd=0; 
		document.getElementsByClassName("container-fluid")[0].addEventListener('touchend', function (event) {
		  var now=(new Date()).getTime(); 
		  if(now-lastTouchEnd<=300){ 
			event.preventDefault(); 
		  } 
		  lastTouchEnd=now; 
		},false) 
	 }

function SViewVersion() {
    return "V5.0.5ceshi";
}
var sviewBaseUrl = '';
var sviewframeLayoutCode = function () {/*

*/}
    var sview_anima_step_panel = null;//动画播放左侧面板
var sview_anima_step_panel_lite = null;//动画播放右侧面板
var sview_anima_step_toggle_btn = null;
Function.prototype.getMultiLine = function () {
    var lines = new String(this);
    lines = lines.substring(lines.indexOf("/*") + 3, lines.lastIndexOf("*/"));
    return lines;
}

var BACKCOLOR = ['bg-blue', 'bg-yellow'];

var sviewList = [];
var frameDivList = [];
var options = [];//用于存储状态参数
//var isOpenCrot = false;
//var isJoysticPressing = false;
//var strSpeed = 0, sidSpeed = 0;
var renderCanvas = null;
var sview = null;
var fileInput = null;
var sviewFrameDiv = null;


function initSView(htmlelement,outOption) {
    settingAbout();
    var option = {
        isOpenCrot: false,
        animationStatus: true,
        usem2: false, //为了限制右键菜单混乱而使用的标志符
        isOpenJoystick: false,
        walkingMode: false,
        usePMI: true,
        pmiServer: "http://localhost:8070/",
        decryptoFile: false,
        decryptoServer: ""
    };
    // 判断是否为空
    if (typeof outOption !== undefined && JSON.stringify(outOption) !== "{}") {
        for (var key in outOption) {
            option[key] = outOption[key];
        }
    }

    options.push(option);

    document.oncontextmenu = function () { return false; };
    //组织SView界面布局
	var layout;
	$.ajax({
	    url: jsFilePath + "res/layouts.html?version=5.0.3",
	    data: null,
	    type: "GET",
	    contentType: "text/html",
        async:false,
	    success: function (result) {
	        layout = result;
	    },
	    error: function (result) {
	        alert(result.statusText);
	    }

	});
    //var layout = sviewframeLayoutCode.getMultiLine();

    layout = layout.replace("SViewFrameName", htmlelement + "-SViewFrame");
    if (sviewBaseUrl != null) {
        layout = layout.replace(/'images\//g, "'" + sviewBaseUrl + "images/");
    }
    $("#" + htmlelement).html(layout);

    //替换语言
    var langFlag = M3D.CookieHelper.GetCookie('languageType');
    if (langFlag == undefined) {
        langFlag = "cn";
    }
    var language;
    $.ajax({
        beforeSend: function () { /*$.loading("show");*/ },
        type: "GET",
        url: jsFilePath + "lang/lang_" + langFlag + ".json?version=5.0.3",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        async: false,
        cache: false,
        success: function (json, textStatus) {
            //$.loading("hide");
            language = json;
            
            $("#" + htmlelement + " *").each(function (index, domNode) {
                var currLanguage = language;
                var langID = $(domNode).attr("langID");
                if (langID) {
                    var langIDSlipt = langID.split(".");
                    for (var i = 0; i < langIDSlipt.length; i++) {
                        currLanguage = currLanguage[langIDSlipt[i]];
                    }
                    $(domNode).html(currLanguage);
                }
                if (((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)) || (navigator.userAgent.indexOf('Edge') > -1)) {
                    if ($(domNode).hasClass('mui-switch')) {
                        $(domNode).width(26);
                        $(domNode).height(26);
                    }
                }
                
                var titleID = $(domNode).attr("TitleID");
                if (titleID) {
                    var langIDSlipt = titleID.split(".");
                    for (var i = 0; i < langIDSlipt.length; i++) {
                        currLanguage = currLanguage[langIDSlipt[i]];
                    }
                    $(domNode).attr("title", currLanguage);
                }
                var inputRange = $(domNode).attr("type");
                if (inputRange == "range" && !(navigator.userAgent.indexOf("Edge") > -1) && !(!!window.ActiveXObject || "ActiveXObject" in window) && !(navigator.userAgent.indexOf("Firefox") > -1)) {
                    $(domNode).css("background", "-webkit-linear-gradient(#059CFA, #059CFA) no-repeat");
                    $(domNode).css("background-size", "0% 100%");
                    $(domNode).css("margin", "2.5px 0px");
                } else {
                    if (inputRange == "range") {
                        if ((navigator.userAgent.indexOf("Edge") > -1)){
                            //Edge
                            $(domNode).css("height", "25px");
                            $(domNode).css("margin", "0px");
                        } else if (!!window.ActiveXObject || "ActiveXObject" in window) {
                            //IE
                            $(domNode).css("margin-top", "-12px");
                            console.log("IE");
                        } else {
                        //火狐
                        }
                    }
                }
                if ($(domNode).attr("id") == "rotateswitch_label" && (!!window.ActiveXObject || "ActiveXObject" in window)) {
                    $(domNode).css("right", "10px");
                }
                if ($(domNode).attr("id") == "mergefaceswitch_label" && (!!window.ActiveXObject || "ActiveXObject" in window)) {
                    $(domNode).css("right", "10px");
                }
                // Set textnote  default && edit textnote default
                var textNoteInput = $(domNode).attr("id");
                if (textNoteInput == "textNote_input") {
                    $(domNode).attr("value", getLocalizedString(language, "TextNote", "InputTextNoteContent"));
                } else if (textNoteInput == "editNote_input") {
                    $(domNode).attr("value", getLocalizedString(language, "TextNote", "InputContent"));
                }
            });
            stopScroll();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('ssss');
        }
    });


    htmlelement = htmlelement + "-SViewFrame";
    //
    var sviewId = htmlelement;
    var assemblyTreeId = sviewId + "assebmlyTree";

    //初始化工具栏控件
    function initToobarClick() {


        $(window).bind("resize", function (e) {
            orient(e);
        });

        function orient() {
            var canvas = document.getElementById('gesture_canvas');
            canvas.width = sviewFrameDiv.width();
            canvas.height = sviewFrameDiv.height();
            var offset_x = $(window).width() - $("#sview_anima_step_panel_lit").width();
            $("#sview_anima_step_panel_lit").css({ 'left': offset_x ,'top':0});
            paint.reset();
            if (paint.list_map) {
                for (var i = 0; i < paint.list_map.length; i++) {
                    var map = paint.list_map[i];
                    var x = map.x;
                    var y = map.y;
                    for (var j = 0; j < x.length; j++) {
                        paint.cxt.beginPath();
                        if (map['clickDrag'][j] && j) {
                            paint.cxt.moveTo(x[j - 1], y[j - 1]);
                        } else {
                            paint.cxt.moveTo(x[j] - 1, y[j]);
                        }
                        paint.cxt.lineTo(x[j], y[j]);
                        paint.cxt.closePath();
                        paint.cxt.stroke();
                    }
                }
            }
        }
            


        //复位
        sviewFrameDiv.find("#RestoreView").click(function () {
            RestoreView();
            //sview.fillModelMaterial(sview.GetSelector().GetAll()[0], "./images/material1.jpg");
        });

        //视图
        sviewFrameDiv.find("#front").click(function () {
            SetPerspective(0)
        });
        sviewFrameDiv.find("#back").click(function () {
            SetPerspective(1)
        });
        sviewFrameDiv.find("#left").click(function () {
            SetPerspective(3)
        });
        sviewFrameDiv.find("#right").click(function () {
            SetPerspective(2)
        });
        sviewFrameDiv.find("#top").click(function () {
            SetPerspective(5)
        });
        sviewFrameDiv.find("#bottom").click(function () {
            SetPerspective(4)
        });
        sviewFrameDiv.find("#isometric").click(function () {
            SetPerspective(6);
        });
        //透视试图切换
        sviewFrameDiv.find("#perspective").click(function () {
            sview.view.SetCameraProjectionType(sview.view.GetCameraProjectionType() == 0 ? 1 : 0);
            if (sview.view.GetCameraProjectionType() == 0)
            {
				sviewFrameDiv.find("#perspective").removeClass(BACKCOLOR[0]);
			} 
            else
            {
				sviewFrameDiv.find("#perspective").addClass(BACKCOLOR[0]);
            }
        });
        //渲染模式
        sviewFrameDiv.find("#showEdgeLine").click(function () {
            setRenderMode(5);
        });
        sviewFrameDiv.find("#notshowEdgeLine").click(function () {
            setRenderMode(0);
        });
        sviewFrameDiv.find("#onlyshowEdgeLine").click(function () {
            setRenderMode(3);
        });
        sviewFrameDiv.find("#IsShowTransparent").click(function () {
            sview.ShowTransparent();
        });
        sviewFrameDiv.find("#showTrilateralEdge").click(function (e) {
            sview.IsShowWireframe();
            e.stopPropagation();
        });
        sviewFrameDiv.find("#mulSelect").click(function (e) {
            sview.setIsMulSelect(this.checked);
            e.stopPropagation();
        });
        sviewFrameDiv.find("#showBox").click(function (e) {
            sview.setShowBox(this.checked);
            e.stopPropagation();
        });
        

        //装配树
        sviewFrameDiv.find("#assembly").click(function () {
            sviewFrameDiv.find(".leftbar").toggle();
        });
        sviewFrameDiv.find("#add").click(function () {
            addAsemble();
        });
        sviewFrameDiv.find("#delete").click(function () {
            delAsemble();
        });
        sviewFrameDiv.find("#copy").click(function () {
            copyAsemble();
        });
        sviewFrameDiv.find("#cut").click(function () {
            cutAsemble();
        });
        sviewFrameDiv.find("#paste").click(function () {
            pasteAsemble();
        });
        sviewFrameDiv.find("#rename").click(function () {
            renameAsemble();
        });
		
		// 进入剖切
        sviewFrameDiv.find('#lipq').click(function () {
            if (sviewFrameDiv.find('#section_bar').hasClass('hide')) {
                //sviewFrameDiv.find("#bottomMenu").hide();
                sviewFrameDiv.find('#bottomMenu').addClass('hide');
                sviewFrameDiv.find('#mainMenu').removeClass(BACKCOLOR[1]);
                sviewFrameDiv.find('#section_bar').removeClass('hide');
                SetClipValue(0);

                sviewFrameDiv.find("#section_percentage").val(0.5);
                SetClipValue(0.5);
                $("#section_percentage").css('background-size', '50% 100%');
            }
        });
		// 剖切方向选择
		sviewFrameDiv.find('#section_bar_main').click(function () {
			if (sviewFrameDiv.find('#section_bar_type').hasClass('show')){
				sviewFrameDiv.find("#section_bar_type").removeClass('show');
			}else{
				sviewFrameDiv.find("#section_bar_type").addClass('show')
			}
		});
		// 退出剖切
		sviewFrameDiv.find("#section_exit").click(function(){
			//if (sviewFrameDiv.find("#mainMenu").hasClass(BACKCOLOR[1])){
			//	sviewFrameDiv.find("#bottomMenu").show();
		    //}
		    //sviewFrameDiv.find("#bottomMenu").show();
		    sviewFrameDiv.find('#bottomMenu').removeClass('hide');
		    sviewFrameDiv.find('#mainMenu').addClass(BACKCOLOR[1]);
			sviewFrameDiv.find("#section_bar").addClass('hide');
			// 设置剖切值为0
			sviewFrameDiv.find("#section_percentage").val(0);
			sview.CloseClipPlane();
			if (sviewFrameDiv.find("#section_exit").hasClass(BACKCOLOR[0])){
				sviewFrameDiv.find("#section_exit").removeClass(BACKCOLOR[0]);
			}
			if (sviewFrameDiv.find('#section_bar_type').hasClass('show')){
				sviewFrameDiv.find("#section_bar_type").removeClass('show');
			}
		});
		// 进入爆炸
        sviewFrameDiv.find('#li_explosive').click(function () {
            if (sviewFrameDiv.find('#explose_bar').hasClass('hide')) {
                //sviewFrameDiv.find("#bottomMenu").hide();
                sviewFrameDiv.find('#bottomMenu').addClass('hide');
                sviewFrameDiv.find('#mainMenu').removeClass(BACKCOLOR[1]);
                //sviewFrameDiv.find('#_note').addClass(BACKCOLOR[1]);
                sviewFrameDiv.find('#explose_bar').removeClass('hide');
                $("#explosive_per").val(0);
                $("#explosive_per").css('background-size', '0% 100%');
            }
        }); 
		// 爆炸方向选择
		sviewFrameDiv.find('#explose_bar_third_main').click(function () {
			if (sviewFrameDiv.find('#explose_bar_third_type').hasClass('show')){
				sviewFrameDiv.find('#explose_bar_third_type').removeClass('show');
				//sviewFrameDiv.find('#explose_bar_third_main').removeClass(BACKCOLOR[0]);
			}else{
				sviewFrameDiv.find('#explose_bar_third_type').addClass('show')
				//sviewFrameDiv.find('#explose_bar_third_main').addClass(BACKCOLOR[0]);
			}
		});
		// 爆炸退出
		sviewFrameDiv.find('#explose_exit').click(function () {
			//if (sviewFrameDiv.find("#mainMenu").hasClass(BACKCOLOR[1])){
			//	sviewFrameDiv.find("#bottomMenu").show();
		    //}
		    //sviewFrameDiv.find("#bottomMenu").show();
		    sviewFrameDiv.find('#bottomMenu').removeClass('hide');
		    sviewFrameDiv.find('#mainMenu').addClass(BACKCOLOR[1]);
			sviewFrameDiv.find("#explose_bar").addClass('hide');
			// 设置剖切值为0
			sviewFrameDiv.find("#explosive_per").val(0);
			if (sviewFrameDiv.find('#explose_bar_third_type').hasClass('show')){
				sviewFrameDiv.find("#explose_bar_third_type").removeClass('show');
			}
			sview.ClearExplosive();
		});
		sviewFrameDiv.find("#RestoreView_li").mousedown(function (e) {
		    $(this).addClass(BACKCOLOR[1]);
		    e.stopPropagation();
		});
		document.getElementById("RestoreView_li").addEventListener('touchstart', function (e) {
		    $(this).addClass(BACKCOLOR[1]);
		    e.stopPropagation();
		}, false);
		document.getElementById("RestoreView_li").addEventListener('touchend', function (e) {
		    $(this).removeClass(BACKCOLOR[1]);
		    e.stopPropagation();
		}, false);
		sviewFrameDiv.find("#RestoreView_li").mouseup(function (e) {
		    $(this).removeClass(BACKCOLOR[1]);
		    e.stopPropagation();
		});
		// 右侧工具栏点击事件
        sviewFrameDiv.find('.rt-sus li').click(function () {
            if ($(this).attr('id') != "mainMenu") {
                if ($(this).hasClass(BACKCOLOR[1])) {
                    $(this).removeClass(BACKCOLOR[1]);
                    if ($(".leftbar").css('display') === 'block') {
                        $("#assembly").addClass(BACKCOLOR[1]);
                    }
                    $(this).children(".ul-dropmenu").removeClass('show');
                } else {
                    if ($(this).attr('id') !== "RestoreView_li") {
                        sviewFrameDiv.find('.rt-sus li').removeClass(BACKCOLOR[1]);
                        //if ($(this).attr('id') !== "mainMenu") {
                        //    if (!sviewFrameDiv.find("#bottomMenu").hasClass('hide')) {
                        //        $("#mainMenu").addClass(BACKCOLOR[1]);
                        //    }
                        //}
                        if ($(".leftbar").css('display') === 'block') {
                            $("#assembly").addClass(BACKCOLOR[1]);
                        }
                        $(this).addClass(BACKCOLOR[1]);
                        sviewFrameDiv.find('.rt-sus li').children(".ul-dropmenu").removeClass('show');
					    if ($(this).attr('id') == "walking"){
						    // 根据cookie设置显示以及底层设置
						    if (M3D.CookieHelper.GetCookie("walkThroughSpeed")){	
						        $(".walking_speed").val(M3D.CookieHelper.GetCookie("walkThroughSpeed"));
						    }
						    if (M3D.CookieHelper.GetCookie("walkThroughFov")){	
						        $(".walking_fov").val(M3D.CookieHelper.GetCookie("walkThroughFov"));
						    }
						    if (M3D.CookieHelper.GetCookie("walkThroughUpdirection")){
						        $(".walking_updirection ").val(M3D.CookieHelper.GetCookie("walkThroughUpdirection"));
						    }
					    }
					    if ($(this).attr('id') == "mainMenu"){
						    //sviewFrameDiv.find("#bottomMenu").show();
					    }else{
					        $(this).children(".ul-dropmenu").addClass('show');
					    }
                    }
                }
            }
        });
        const MAZEY_FULL_SCREEN = function () {

            let prefixArr = ['', 'webkit', 'moz', 'ms'],//浏览器前缀
                isRightRequest,//是否找到适配的方法
                isRightExit,
                requestMethod,//全屏方法
                exitMethod,//退出全屏方法
                lowerFirst = function (str) {
                    return str.slice(0, 1).toLowerCase() + str.slice(1);
                },
                requestSuffixArr = ['RequestFullscreen', 'RequestFullScreen'],//后缀
                exitSuffixArr = ['ExitFullscreen', 'CancelFullScreen'],
                searchRightMethod = function (prefix, suffixArr, documentParent) {
                    let methodArr = suffixArr.map((suffix) => {
                        return prefix + suffix;
                    }),
                    method,
                    isRight;
                    methodArr.forEach((wholePrefix) => {
                        if (isRight) return;
                        if (prefix.length === 0) {
                            wholePrefix = lowerFirst(wholePrefix)
                        }
                        if (wholePrefix in documentParent) {
                            method = wholePrefix;
                            isRight = true;
                            //console.log(method);
                        }
                    });
                    return method;
                };
            prefixArr.forEach((prefix) => {
                if (isRightRequest && isRightExit) return;
                //查找请求
                requestMethod = searchRightMethod(prefix, requestSuffixArr, document.documentElement);
                isRightRequest = Boolean(requestMethod);
                //查找退出
                exitMethod = searchRightMethod(prefix, exitSuffixArr, document);
                isRightExit = Boolean(exitMethod);
            });
            this.request = function (element) {
                let domEle = document.querySelector(element) || document.documentElement;
                domEle[requestMethod]();
            };
            this.exit = function () {
                document[exitMethod]();
            };
            this.isFullScreen = function () {
                /**return document.fullscreenEnabled || window.fullScreen ||
                    document.webkitIsFullScreen || document.msFullscreenEnabled ||
                    document.mozFullScreenEnabled;**/
                /**return document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen;**/
                return document.fullscreenElement || document.msFullscreenElement ||
                       document.mozFullScreenElement ||
                       document.webkitFullscreenElement || false;
            }
        };

        let fullscreen = new MAZEY_FULL_SCREEN();
        let sview0prewidth = '';
        let sview0preheight = '';
        //全屏显示
        sviewFrameDiv.find("#fullscreen").click(function () {
            sview0prewidth = $("#sview0").width();
            sview0preheight = $("#sview0").height();
            fullscreen.request();
        });
        //退出全屏
        sviewFrameDiv.find("#exitfullscreen").click(function () {
            fullscreen.exit();
        });
        //全屏时的样式
        function fullscreenstyle() {
            if (M3D.Parameters.Instance().isFullScreenExpand) {
                $("#sview0").css({ "width": "100%", "height": "100%" });
            }
            sviewFrameDiv.find("#fullscreen").addClass("hide");
            sviewFrameDiv.find("#exitfullscreen").removeClass("hide");
        }
        //非全屏时的样式
        function exitfullscreenstyle() {
            if (M3D.Parameters.Instance().isFullScreenExpand) {
                if (sview0prewidth != '' &&
                    sview0preheight != '') {
                    $("#sview0").css({ "width": sview0prewidth, "height": sview0preheight });
                }
            }
            sviewFrameDiv.find("#exitfullscreen").addClass("hide");
            sviewFrameDiv.find("#fullscreen").removeClass("hide");
        }
        //根据是否全屏更改样式
        function changestyle() {
            if (fullscreen.isFullScreen()) {
                //alert("全屏");
                fullscreenstyle();
            } else {
               // alert("非全屏");
                exitfullscreenstyle();
            }
        }
        //标准
        document.addEventListener("fullscreenchange", function () {
            changestyle();
        }, false);
        //谷歌
        document.addEventListener("webkitfullscreenchange", function () {
            changestyle();
        }, false);
        //火狐
        document.addEventListener("mozfullscreenchange", function () {
            changestyle();
        }, false);
        //IE
        document.addEventListener("MSFullscreenChange", function () {
            changestyle();
        }, false);

       $(document).keydown(function (e) {
            var e = e || window.event || arguments.callee.caller.arguments[0];
            if(e && e.keyCode == 122){//捕捉F11键盘动作
                //由于全屏后不能再监听F11，所以此处不判断else
                if (!fullscreen.isFullScreen()) {
                    sview0prewidth = $("#sview0").width();
                    sview0preheight = $("#sview0").height();
                    fullscreen.request();
                } 
                e.preventDefault();//阻止F11默认动作

            }
        })



        sviewFrameDiv.find("#section_yzsection").click(function () {
            SetClipDir(1);
            sviewFrameDiv.find("#section_bar_third_main_img").attr('src', sviewBaseUrl + 'images/button_yzsection.png');
            if ($("#section_reversal").hasClass(BACKCOLOR[0])) {
                $("#section_reversal").removeClass(BACKCOLOR[0]);
            }
        });
        sviewFrameDiv.find("#section_xysection").click(function () {
            SetClipDir(3);
            sviewFrameDiv.find("#section_bar_third_main_img").attr('src', sviewBaseUrl + 'images/button_xysection.png');
            if ($("#section_reversal").hasClass(BACKCOLOR[0])) {
                $("#section_reversal").removeClass(BACKCOLOR[0]);
            }
        });
        sviewFrameDiv.find("#section_xzsection").click(function () {
            SetClipDir(2);
            sviewFrameDiv.find("#section_bar_third_main_img").attr('src', sviewBaseUrl + 'images/button_zxsection.png');
            if ($("#section_reversal").hasClass(BACKCOLOR[0])) {
                $("#section_reversal").removeClass(BACKCOLOR[0]);
            }
        });

        sviewFrameDiv.find("#section_reversal").click(function (e) {
            if ($(this).hasClass(BACKCOLOR[0])) {
                $(this).removeClass(BACKCOLOR[0]);
            } else {
                $(this).addClass(BACKCOLOR[0]);
            }
            SetOppositeDir();
            e.stopPropagation();
        });
        sviewFrameDiv.find("#section_plane").click(function (e) {
            if ($(this).hasClass(BACKCOLOR[0])) {
                $(this).removeClass(BACKCOLOR[0]);
            } else {
                $(this).addClass(BACKCOLOR[0]);
            }
            IsShowClipHelppingPlane();
            e.stopPropagation();
        });

        sviewFrameDiv.find("#section_cappingPlane").click(function (e) {
            if ($(this).hasClass(BACKCOLOR[0])) {
                $(this).removeClass(BACKCOLOR[0]);
            } else {
                $(this).addClass(BACKCOLOR[0]);
            }
            IsShowCappingPlane();
            e.stopPropagation();
        });

        var sectionPercectProgress = sviewFrameDiv.find("#section_percentage");
        if (!!window.ActiveXObject || "ActiveXObject" in window) {//为IE就绑定change事件
            sectionPercectProgress.on("change",
           function () { setPlanePosition(); });
        } else {
            sectionPercectProgress.on("input",
           function () { setPlanePosition(); });
        }
       

        sviewFrameDiv.find(".section_xyz").click(function (e) {
            sviewFrameDiv.find(".section_xyz").removeClass(BACKCOLOR[0]);
            $(this).addClass(BACKCOLOR[0]);
            e.stopPropagation();
        });
        //爆炸
        sviewFrameDiv.find("#explosive_center").click(function () {
            SetExplosiveStyle(0);
            sviewFrameDiv.find("#explos_bar_third_main_img").attr('src', sviewBaseUrl + 'images/explosive_global.png');
        });
        sviewFrameDiv.find("#explosive_by_x").click(function () {
            SetExplosiveStyle(1);
            sviewFrameDiv.find("#explos_bar_third_main_img").attr('src', sviewBaseUrl + 'images/explosive_three_dimensional.png');
        });
        sviewFrameDiv.find("#explosive_by_y").click(function () {
            SetExplosiveStyle(2);
            sviewFrameDiv.find("#explos_bar_third_main_img").attr('src', sviewBaseUrl + 'images/explosive_plane.png');
        });
        sviewFrameDiv.find("#explosive_per").mouseup(function (e) {
            sview.view.GetSceneManager().GetSceneBox().Clear();
        });
        if (!!window.ActiveXObject || "ActiveXObject" in window) {//true 为ie
            
            sviewFrameDiv.find("#explosive_per").on("change",
          function () { SetExplosivePosition(); });
        } else {
            sviewFrameDiv.find("#explosive_per").on("input",
            function () { SetExplosivePosition(); });
           
        }

        sviewFrameDiv.find("#more").click(function () {
            sviewFrameDiv.find("#main_bottobar").toggle();
        });

        sviewFrameDiv.find(".viewAngle_main").click(function (e) {
            sviewFrameDiv.find(".viewAngle_main").removeClass(BACKCOLOR[0]);
            $(this).addClass(BACKCOLOR[0]);
            e.stopPropagation();
        });
        sviewFrameDiv.find(".viewAngle").click(function (e) {
            if ($(this).attr('id') == "IsShowTransparent") {
                if ($(this).hasClass(BACKCOLOR[0])){
                    $(this).removeClass(BACKCOLOR[0]);
                }else{
                    $(this).addClass(BACKCOLOR[0]);
                }
            }
            e.stopPropagation();
        });
		
        sviewFrameDiv.find(".viewAngle").mousedown(function (e) {
            if ($(this).attr('id') != "IsShowTransparent") {
                $(this).addClass(BACKCOLOR[0]);
            }
			e.stopPropagation();
		});
        sviewFrameDiv.find(".viewAngle").mouseup(function (e) {
            if ($(this).attr('id') != "IsShowTransparent") {
                $(this).removeClass(BACKCOLOR[0]);
            }
			e.stopPropagation();
		});
		
		


        sviewFrameDiv.find(".explosive").click(function (e) {
            sviewFrameDiv.find(".explosive").removeClass(BACKCOLOR[0]);
            $(this).addClass(BACKCOLOR[0]);
            e.stopPropagation();
        });

        sviewFrameDiv.find("#section_percentage").click(function (e) {
            e.stopPropagation();
        });

        sviewFrameDiv.find("#explosive_percentage").click(function (e) {
            e.stopPropagation();
        });

        //拖拽器
        sviewFrameDiv.find('#dragger-first').click(function (e) {
            var dropmenu = $(this).find('.ul-dropmenu ');
            if (dropmenu.hasClass('show')) {
                dropmenu.removeClass('show');
            }
            else {
                dropmenu.addClass('show');
            }
            e.stopPropagation();
        });
        sviewFrameDiv.find(".dragger-class").click(function (e) {
            sviewFrameDiv.find(".dragger-class").removeClass(BACKCOLOR[0]);
            $(this).addClass(BACKCOLOR[0]);
            sviewFrameDiv.find(".DGLI").removeClass(BACKCOLOR[0]);
            sviewFrameDiv.find(".dface").addClass(BACKCOLOR[0]);
            sview.SetDraggerAxis(3);
            // dropmenu.removeClass('show');   
            //e.stopPropagation();
        });
        sviewFrameDiv.find(".DGLI").click(function (e) {
            sviewFrameDiv.find(".DGLI").removeClass(BACKCOLOR[0]);
            $(this).addClass(BACKCOLOR[0]);
            e.stopPropagation();
        });
        sviewFrameDiv.find('#trans').click(function () {
            sviewFrameDiv.find('#dragger-main-img').attr('alt', $(this).children('#trans-img').attr('alt'));
            sviewFrameDiv.find('#dragger-main-img').attr('src', $(this).children('#trans-img').attr('src'));
            sviewFrameDiv.find('#dragger-main-img').attr('title', $(this).children('#trans-img').attr('title'));
            sviewFrameDiv.find('#dragger-translation').removeClass('show');
            sviewFrameDiv.find('#dragger-rotation').removeClass('show');
            sviewFrameDiv.find('#dragger-scaling').removeClass('show');
            sviewFrameDiv.find('#dragger-translation').addClass('show');
            sview.SetDraggerMode(0);
            sview.SetDraggerAxis(3);

        });
        sviewFrameDiv.find('#rot').click(function () {
            var ss0 = sviewFrameDiv.find('#rot-img');
            var ss = sviewFrameDiv.find('#rot-img').attr('alt');
            var ss1 = sviewFrameDiv.find('#rot-img').attr('src');
            var ss2 = sviewFrameDiv.find('#rot-img').attr('title');
            sviewFrameDiv.find('#dragger-main-img').attr('alt', sviewFrameDiv.find('#rot').children('#rot-img').attr('alt'));
            sviewFrameDiv.find('#dragger-main-img').attr('src', sviewFrameDiv.find('#rot').children('#rot-img').attr('src'));
            sviewFrameDiv.find('#dragger-main-img').attr('title', sviewFrameDiv.find('#rot').children('#rot-img').attr('title'));
            sviewFrameDiv.find('#dragger-translation').removeClass('show');
            sviewFrameDiv.find('#dragger-rotation').removeClass('show');
            sviewFrameDiv.find('#dragger-scaling').removeClass('show');
            sviewFrameDiv.find('#dragger-rotation').addClass('show');
            sview.SetDraggerMode(1);
            sview.SetDraggerAxis(3);
        });
        sviewFrameDiv.find('#sca').click(function () {
            sviewFrameDiv.find('#dragger-main-img').attr('alt', $(this).children('#sca-img').attr('alt'));
            sviewFrameDiv.find('#dragger-main-img').attr('src', $(this).children('#sca-img').attr('src'));
            sviewFrameDiv.find('#dragger-main-img').attr('title', $(this).children('#sca-img').attr('title'));
            sviewFrameDiv.find('#dragger-translation').removeClass('show');
            sviewFrameDiv.find('#dragger-rotation').removeClass('show');
            sviewFrameDiv.find('#dragger-scaling').removeClass('show');
            sviewFrameDiv.find('#dragger-scaling').addClass('show');
            sview.SetDraggerMode(2);
            sview.SetDraggerAxis(3);
        });

        sviewFrameDiv.find('.dragger-face').click(function () {
            sview.view.CloseSceneAnimation();//若开启持续旋转，则关闭
            sview.SetDraggerAxis(3);
        });
        sviewFrameDiv.find('.dragger-x').click(function () {
            sview.view.CloseSceneAnimation();
            sview.SetDraggerAxis(0);
        });
        sviewFrameDiv.find('.dragger-y').click(function () {
            sview.view.CloseSceneAnimation();
            sview.SetDraggerAxis(1);
        });
        sviewFrameDiv.find('.dragger-z').click(function () {
            sview.view.CloseSceneAnimation();
            sview.SetDraggerAxis(2);
        });

        sviewFrameDiv.find('.dragger-exit').click(function (e) {
            sview.SetUsingTouchHandlerType(1);
            sview.SetDraggerAxis(3);
            sviewFrameDiv.find(".DGLI").removeClass(BACKCOLOR[0]);
            sviewFrameDiv.find('#dagger_bar').hide();
            sviewFrameDiv.find(".pull-right").show();//左边菜单隐藏
            //if (!sviewFrameDiv.find('#bottomMenu').hasClass('hide')) {
            if (!sviewFrameDiv.find('#bottomMenu').is(':hidden')) {
                sviewFrameDiv.find('#bottomMenu').show();
            }
//            //sviewFrameDiv.find(".rotation").show();//展示菜单隐藏
            e.stopPropagation();
        });
        function Anima_Pause() {
            $(".ani-pause").html("<img src='" + sviewBaseUrl +"images/button_ani.png' alt='开始' title='开始'>");
            options[0].animationStatus = false;
            sview.Pause();
        }
        function Anima_Play() {
            $(".ani-pause").html("<img src='" + sviewBaseUrl + "images/button_pause.png' alt='暂停' title='暂停'>");
            options[0].animationStatus = true;
            sview.Play();
        }
        
        function SetAnimaPanel() {
            sview.GetAnimationTaskLinstener().UpdateWorkTask = function () {
                
                if (sview.animationPlayer.GetActiveTask() != null) {
                    AnimationPlayListener.selectStep(sview.animationPlayer.GetActiveTask().GetId(), sview.animationPlayer.GetActiveTask().GetProcessId());
                }
            }
            sview.GetAnimationTaskLinstener().UpdatePercent = function () {

                //$(function () {
                $("#ani_percentage").val(sview.animationPlayer.GetPercent() / 100);
                $("#ani_percentage").css('background-size', String(sview.animationPlayer.GetPercent()) + '% 100%');


            }
            sview.GetAnimationTaskLinstener().UpdateStopPlaying = function () {
                //如果没有设置循环播放 则将播放按钮图片改变
                if (!sview.animationPlayer.IsLoop() && (Math.floor(sview.animationPlayer.GetPercent()) === 100 || sview.animationPlayer.workTaskList.length === 0)) {
                    Anima_Pause();
                }
                //console.log("停止了动画");
            }

        }
        //动画播放
        //TODO 动画播放
        sviewFrameDiv.find('.ani-more').click(function (e) {
            if (sviewFrameDiv.find('#setSpeed').hasClass('show'))
                sviewFrameDiv.find('#setSpeed').removeClass('show');
            else
                sviewFrameDiv.find('#setSpeed').addClass('show');

            e.stopPropagation();
        });
        sviewFrameDiv.find('.ani-forward').click(function (e) {
            sviewFrameDiv.find('.ani-pause').html("<img src='images/button_pause.png' alt='暂停' title='暂停'>");//播放按钮还原
            option.animationStatus = true;//还原播放按钮对应状态
            // sview.AnimationPlayForward();
            sview.AnimationNext();
        });
        sviewFrameDiv.find('.ani-backward').click(function (e) {
            sviewFrameDiv.find('.ani-pause').html("<img src='images/button_pause.png' alt='暂停' title='暂停'>");//播放按钮还原
            option.animationStatus = true;//还原播放按钮对应状态
            //sview.AnimationPlayBackward();

            sview.AnimationPre();
        });

        sviewFrameDiv.find('.ani-exit').click(function (e) {
            //sview.AnimationStop();
            AnimationStop();
            //sview.AnimationStop();
            RestoreView();
            sviewFrameDiv.find("#animation").removeClass(BACKCOLOR[1]);
            sviewFrameDiv.find(".pull-right").show();//左边菜单显示
            sviewFrameDiv.find(".rotation").show();//展示菜单显示
            sviewFrameDiv.find('.ani-pause').html("<img src='" + sviewBaseUrl + "images/button_pause.png' alt='暂停' title='暂停'>");//播放按钮还原
            option.animationStatus = true;//还原播放按钮对应状态
            //var sss = sviewFrameDiv.find('#ani_percentage');
            //sviewFrameDiv.find('#ani_percentage').val(0);//这个是修改属性
            sviewFrameDiv.find('#animation_bar').addClass('hide');
            //sviewFrameDiv.find("#bottomMenu").show();
            sviewFrameDiv.find('#bottomMenu').removeClass('hide');
            sviewFrameDiv.find('#mainMenu').addClass(BACKCOLOR[1]);
            sview_anima_step_panel.hide();//隐藏分段动画面板
            sview_anima_step_panel_lite.hide();
            sview_anima_step_toggle_btn.hide();
            $(".rotation").hide();
            sviewFrameDiv.find('#setSpeed').removeClass('show');
            e.stopPropagation();
        });
        sviewFrameDiv.find('#animation').click(function (e) {
            if (!sviewFrameDiv.find('#animation_bar').hasClass('hide')) {
                sviewFrameDiv.find('#animation_bar').addClass('hide');
                sviewFrameDiv.find('#animation_bar').hide();
                //sviewFrameDiv.find(".pull-right").show();
                sviewFrameDiv.find('#bottomMenu').removeClass('hide');
                sviewFrameDiv.find('#mainMenu').addClass(BACKCOLOR[1]);
                sviewFrameDiv.find(".rotation").show();
                sview_anima_step_panel.hide();
                sview_anima_step_panel_lite.hide();
                sview_anima_step_toggle_btn.hide();
                AnimationStop();
                RestoreView();
            }
            else {//开始播放动画
                //RestoreView();
                sview.ClearExplosive();
                sview.AnimationOpenFile();
                sviewFrameDiv.find('#animation_bar').removeClass('hide');
                sviewFrameDiv.find('#animation_bar').show();
                sviewFrameDiv.find(".pull-right").hide();//左边菜单隐藏
                sviewFrameDiv.find(".rotation").hide();//展示菜单隐藏
                sviewFrameDiv.find(".leftbar").hide();
                $("#assembly").removeClass(BACKCOLOR[1]);
                //sviewFrameDiv.find("#bottomMenu").hide();
                sviewFrameDiv.find('#bottomMenu').addClass('hide');
                sviewFrameDiv.find('#mainMenu').removeClass(BACKCOLOR[1]);

                $("#hideBtnDiv").css('padding-top', $(document).height() / 3);
                $("#hideBtnDiv img").attr("src", sviewBaseUrl + 'images/sview_ani_anilist_close.png');
                // 设置速度
                var speedValue = Get_Animation_Option("#speedSelect");
                $("#speedSelect").val(speedValue);

                var taskList = sview.animationPlayer.GetTaskList();
                if (taskList != null && taskList.length > 1 && sview.animationPlayer) {
                    sview_anima_step_panel.show();
                    sview_anima_step_panel_lite.show();
                    sview_anima_step_toggle_btn.show();
                    var zNodesTemp = ' ';
                    var steps_id = 0;
                    for (var i = 0; i < taskList.length; i++) {
                        //console.log(taskList[i].GetName());


                        var zNodeTemp = ' ';
                        if (Object.prototype.toString.call(taskList[i] === '[object Array]')) {
                            var stepList = taskList[i].GetStepList();
                            for (var j = 0; j < stepList.length; j++) {

                                zNodeTemp != null ? (zNodeTemp += ('{ name:' + '"' + stepList[j].GetName() + '",id:"' + 'stepId_' + stepList[j].GetId() + '",steps_id:"' + steps_id + '",step_info:"' + stepList[j].GetStepInfo() + '" },')) : (zNodeTemp = ('{ name:' + '"' + stepList[j].GetName() + '",id:"' + 'step_' + stepList[j].GetId() + '",steps_id:"' + steps_id + '",step_info:"' + stepList[j].GetStepInfo() + '" },'));
                                //console.log('dasdasd' + stepList[j].GetName());
                                ++steps_id;
                            }

                        }
                        zNodesTemp != null ? (zNodesTemp += ('{name:"' + taskList[i].GetName() + '",id:"' + 'processId_' + taskList[i].GetId() + '",open:true,children:[' + zNodeTemp + ']},')) : (zNodesTemp = ('{name:"' + taskList[i].GetName() + '",id:"' + 'processId_' + taskList[i].GetId() + '",open:true,children:[' + zNodeTemp + ']},'));

                    }
                    //                 zNodes = [
                    //                { name: "过程1", open: true, children: [] },
                    //{ name: "过程2", open: true, children: [{ name: "DefaultName" }, ] },
                    //{ name: "过程3", open: true, children: [{ name: "DefaultName" }, { name: "步骤1" }, { name: "步骤2" }, ] },
                    //{ name: "过程4", open: true, children: [{ name: "DefaultName" }, { name: "步骤1" }, { name: "步骤2" }, { name: "步骤1" }, { name: "步骤2" }, ] },
                    //                ];




                    InitAnimaStepTree(zNodesTemp);//设置分段动画面板tree的值
                    SetAnimaPanel();
                } else if (taskList != null && taskList.length == 1) {
                    sview_anima_step_panel.show();
                    sview_anima_step_panel_lite.show();
                    sview_anima_step_toggle_btn.show();
                    var zNodesTemp = ' ';
                    var steps_id = 0;



                    var zNodeTemp = ' ';
                    if (Object.prototype.toString.call(taskList[0] === '[object Array]')) {
                        var stepList = taskList[0].GetStepList();
                        for (var j = 0; j < stepList.length; j++) {

                            zNodeTemp != null ? (zNodeTemp += ('{ name:' + '"' + stepList[j].GetName() + '",id:"' + 'stepId_' + stepList[j].GetId() + '",steps_id:"' + steps_id + '",step_info:"' + stepList[j].GetStepInfo() + '" },')) : (zNodeTemp = ('{ name:' + '"' + stepList[j].GetName() + '",id:"' + 'step_' + stepList[j].GetId() + '",steps_id:"' + steps_id + '",step_info:"' + stepList[j].GetStepInfo() + '" },'));
                            //console.log('dasdasd' + stepList[j].GetName());
                            ++steps_id;
                        }

                    }
                    zNodesTemp != null ? (zNodesTemp += ('{name:"' + taskList[0].GetName() + '",id:"' + 'processId_' + taskList[0].GetId() + '",open:true,children:[' + zNodeTemp + ']},')) : (zNodesTemp = ('{name:"' + taskList[0].GetName() + '",id:"' + 'processId_' + taskList[0].GetId() + '",open:true,children:[' + zNodeTemp + ']},'));




                    InitAnimaStepTree(zNodesTemp);//设置分段动画面板tree的值
                    SetAnimaPanel();
                }
                else  {//不存在动画文件
                    $(".rotation").show();
                    sviewFrameDiv.find('#animation_bar').addClass('hide');
                    sview.SetRotateSpeed(1);
                    sview.SetExplosiveStyleNoRestore(0);
                    sview.StartRotateAndExplosive();
                    $(".rotation").find("#RAndEimage").attr("src", sviewBaseUrl + 'images/rotation-1.png');
                    sviewFrameDiv.find(".pull-right").hide();
                    
                }


                sview.Play();//刚开始的时候调用
                sview.animationPlayer.SetAutoWalkCamera(Get_Animation_Option("#autoWalk"));

                sview.animationPlayer.SetSpeed(Get_Animation_Option("#speedSelect"));

                sview.animationPlayer.SetLoop(Get_Animation_Option("#aniLoop"));

            }

            e.stopPropagation();
        });
        function ShowPro()
        {
            console.log(sview);
        }
        //底部主菜单
        sviewFrameDiv.find('#mainMenu').click(function (e) {
            if (sviewFrameDiv.find('#bottomMenu').hasClass('hide')) {
                if (sviewFrameDiv.find('#note_bar').hasClass('hide') &&
                    sviewFrameDiv.find('#gesture_bar').hasClass('hide') &&
                    sviewFrameDiv.find('#animation_bar').hasClass('hide') &&
                    sviewFrameDiv.find('#measure_bar').hasClass('hide') &&
                    sviewFrameDiv.find('#section_bar').hasClass('hide') &&
                    sviewFrameDiv.find('#explose_bar').hasClass('hide')) {
                    sviewFrameDiv.find('#bottomMenu').removeClass('hide');
                    sviewFrameDiv.find('#mainMenu').addClass(BACKCOLOR[1]);
                }
                if (!$("#assembly").hasClass(BACKCOLOR[1])) {
                    sviewFrameDiv.find(".pull-left").hide();
                }
            } else {
                sviewFrameDiv.find('#mainMenu').removeClass(BACKCOLOR[1]);
                sviewFrameDiv.find('#bottomMenu').addClass('hide');
                //sviewFrameDiv.find('#bottomMenu').hide();
            }
        });
        //手势批注
        sviewFrameDiv.find('#_scaleL').click(function (e) {
            if (sviewFrameDiv.find('#gesture_bar').hasClass('hide')) {
                //sviewFrameDiv.find("#bottomMenu").hide();
                sviewFrameDiv.find('#bottomMenu').addClass('hide');
                sviewFrameDiv.find('#mainMenu').removeClass(BACKCOLOR[1]);
                sviewFrameDiv.find('#gesture_bar').removeClass('hide');
                var canvas = document.getElementById('gesture_canvas');
                canvas.width = sviewFrameDiv.width();
                canvas.height = sviewFrameDiv.height();
                paint.init();
                sviewFrameDiv.find('#gesture_canvas').show();
            }
        });
        //模式选择
        sviewFrameDiv.find('#gesture_bar_first').click(function (e) {
            var dropmenu = $(this).find('.ul-dropmenu ');
            if (dropmenu.hasClass('show')) {
                dropmenu.removeClass('show');
            }
            else {
                dropmenu.addClass('show');
            }
			if (sviewFrameDiv.find('#gesture_bar_third_type').hasClass('show')){
				sviewFrameDiv.find('#gesture_bar_third_type').removeClass('show')
			}
			if (sviewFrameDiv.find('#gesture_bar_second_type').hasClass('show')){
				sviewFrameDiv.find('#gesture_bar_second_type').removeClass('show')
			}
            e.stopPropagation();
        });
        //颜色选择
        sviewFrameDiv.find('#gesture_bar_second').click(function (e) {
            var dropmenu = $(this).find('.ul-dropmenu ');
            if (dropmenu.hasClass('show')) {
                dropmenu.removeClass('show');
            }
            else {
                dropmenu.addClass('show');
            }
			if (sviewFrameDiv.find('#gesture_bar_third_type').hasClass('show')){
				sviewFrameDiv.find('#gesture_bar_third_type').removeClass('show')
			}
			if (sviewFrameDiv.find('#gesture_bar_type').hasClass('show')){
				sviewFrameDiv.find('#gesture_bar_type').removeClass('show')
			}
            e.stopPropagation();
        });
        //粗细选择
        sviewFrameDiv.find('#gesture_bar_third').click(function (e) {
            var dropmenu = $(this).find('.ul-dropmenu ');
            if (dropmenu.hasClass('show')) {
                dropmenu.removeClass('show');
            }
            else {
                dropmenu.addClass('show');
            }
			if (sviewFrameDiv.find('#gesture_bar_second_type').hasClass('show')){
				sviewFrameDiv.find('#gesture_bar_second_type').removeClass('show')
			}
			if (sviewFrameDiv.find('#gesture_bar_type').hasClass('show')){
				sviewFrameDiv.find('#gesture_bar_type').removeClass('show')
			}
            e.stopPropagation();
        });
        sviewFrameDiv.find(".gesture-class").click(function (e) {
            sviewFrameDiv.find(".gesture-class").removeClass(BACKCOLOR[0]);
            $(this).addClass(BACKCOLOR[0]);
            sviewFrameDiv.find('#gesture_bar_main_img').attr('alt', $(this).children('img').attr('alt'));
            sviewFrameDiv.find('#gesture_bar_main_img').attr('src', $(this).children('img').attr('src'));
            sviewFrameDiv.find('#gesture_bar_main_img').attr('title', $(this).children('img').attr('title'));
            //e.stopPropagation();
        });

        sviewFrameDiv.find(".gesture-second-class").click(function (e) {
            sviewFrameDiv.find(".gesture-second-class").removeClass(BACKCOLOR[0]);
            $(this).addClass(BACKCOLOR[0]);
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('alt', $(this).children('img').attr('alt'));
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('src', $(this).children('img').attr('src'));
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('title', $(this).children('img').attr('title'));
            //e.stopPropagation();
        });
        sviewFrameDiv.find(".gesture_third_class").click(function (e) {
            sviewFrameDiv.find(".gesture_third_class").removeClass(BACKCOLOR[0]);
            $(this).addClass(BACKCOLOR[0]);
            sviewFrameDiv.find('#gesture_bar_third_main_img').attr('alt', $(this).children('img').attr('alt'));
            sviewFrameDiv.find('#gesture_bar_third_main_img').attr('src', $(this).children('img').attr('src'));
            sviewFrameDiv.find('#gesture_bar_third_main_img').attr('title', $(this).children('img').attr('title'));
            //e.stopPropagation();
        });
        
		sviewFrameDiv.find(".GESTL").mousedown(function(e){
			$(this).addClass(BACKCOLOR[0]);
			e.stopPropagation();
		});
		sviewFrameDiv.find(".GESTL").mouseup(function(e){
			$(this).removeClass(BACKCOLOR[0]);
			e.stopPropagation();
		});
        //模式选择直线
        sviewFrameDiv.find('#freedom').click(function () {
            sviewFrameDiv.find('#gesture_bar_main_img').attr('alt', $(this).children('#freedoimg').attr('alt'));
            sviewFrameDiv.find('#gesture_bar_main_img').attr('src', $(this).children('#freedoimg').attr('src'));
            sviewFrameDiv.find('#gesture_bar_main_img').attr('title', $(this).children('#freedoimg').attr('title'));
            if (linetType != 0) {
                paint.cxt.clearRect(0, 0, screenWidth, screenHeight);
                paint.list_map.length = 0;
            }
            linetType = 0;
        });
        //模式选择圆
        sviewFrameDiv.find('#circle').click(function () {
            sviewFrameDiv.find('#gesture_bar_main_img').attr('alt', $(this).children('#circle_img').attr('alt'));
            sviewFrameDiv.find('#gesture_bar_main_img').attr('src', $(this).children('#circle_img').attr('src'));
            sviewFrameDiv.find('#gesture_bar_main_img').attr('title', $(this).children('#circle_img').attr('title'));
            if (linetType != 1){
                paint.cxt.clearRect(0, 0, screenWidth, screenHeight);
                paint.list_map.length = 0;
            }
            linetType = 1;
        });
        //模式选择矩形
        sviewFrameDiv.find('#rect').click(function () {
            sviewFrameDiv.find('#gesture_bar_main_img').attr('alt', $(this).children('#rect_img').attr('alt'));
            sviewFrameDiv.find('#gesture_bar_main_img').attr('src', $(this).children('#rect_img').attr('src'));
            sviewFrameDiv.find('#gesture_bar_main_img').attr('title', $(this).children('#rect_img').attr('title'));
            if (linetType != 2) {
                paint.cxt.clearRect(0, 0, screenWidth, screenHeight);
                paint.list_map.length = 0;
            }
            linetType = 2;
        });
        //模式选择三角形
        sviewFrameDiv.find('#triangle').click(function () {
            sviewFrameDiv.find('#gesture_bar_main_img').attr('alt', $(this).children('#triangle_img').attr('alt'));
            sviewFrameDiv.find('#gesture_bar_main_img').attr('src', $(this).children('#triangle_img').attr('src'));
            sviewFrameDiv.find('#gesture_bar_main_img').attr('title', $(this).children('#triangle_img').attr('title'));
            if (linetType != 3) {
                paint.cxt.clearRect(0, 0, screenWidth, screenHeight);
                paint.list_map.length = 0;
            }
            linetType = 3;
        });
        //黑色
        sviewFrameDiv.find('#gesture_black').click(function () {
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('alt', $(this).children('#gesture_black_img').attr('alt'));
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('src', $(this).children('#gesture_black_img').attr('src'));
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('title', $(this).children('#gesture_black_img').attr('title'));
            lineColor = 0;
        });
        //红色
        sviewFrameDiv.find('#gesture_red').click(function () {
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('alt', $(this).children('#gesture_red_img').attr('alt'));
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('src', $(this).children('#gesture_red_img').attr('src'));
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('title', $(this).children('#gesture_red_img').attr('title'));
            lineColor = 1;
        });
        //蓝色
        sviewFrameDiv.find('#gesture_blue').click(function () {
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('alt', $(this).children('#gesture_blue_img').attr('alt'));
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('src', $(this).children('#gesture_blue_img').attr('src'));
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('title', $(this).children('#gesture_blue_img').attr('title'));
            lineColor = 2;
        });
        //绿色 
        sviewFrameDiv.find('#gesture_green').click(function () {
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('alt', $(this).children('#gesture_green_img').attr('alt'));
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('src', $(this).children('#gesture_green_img').attr('src'));
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('title', $(this).children('#gesture_green_img').attr('title'));
            lineColor = 3;
        });
        //黄色
        sviewFrameDiv.find('#gesture_yellow').click(function () {
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('alt', $(this).children('#gesture_yellow_img').attr('alt'));
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('src', $(this).children('#gesture_yellow_img').attr('src'));
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('title', $(this).children('#gesture_yellow_img').attr('title'));
            lineColor = 4;
        });
        //橙色
        sviewFrameDiv.find('#gesture_orange').click(function () {
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('alt', $(this).children('#gesture_orange_img').attr('alt'));
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('src', $(this).children('#gesture_orange_img').attr('src'));
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('title', $(this).children('#gesture_orange_img').attr('title'));
            lineColor = 5;
        });
        //灰色
        sviewFrameDiv.find('#gesture_gray').click(function () {
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('alt', $(this).children('#gesture_gray_img').attr('alt'));
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('src', $(this).children('#gesture_gray_img').attr('src'));
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('title', $(this).children('#gesture_gray_img').attr('title'));
            lineColor = 6;
        });
        //紫色
        sviewFrameDiv.find('#gesture_purple').click(function () {
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('alt', $(this).children('#gesture_purple_img').attr('alt'));
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('src', $(this).children('#gesture_purple_img').attr('src'));
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('title', $(this).children('#gesture_purple_img').attr('title'));
            lineColor = 7;
        });
        //棕色
        sviewFrameDiv.find('#gesture_brown').click(function () {
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('alt', $(this).children('#gesture_brown_img').attr('alt'));
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('src', $(this).children('#gesture_brown_img').attr('src'));
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('title', $(this).children('#gesture_brown_img').attr('title'));
            lineColor = 8;
        });
        //粉色
        sviewFrameDiv.find('#gesture_pink').click(function () {
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('alt', $(this).children('#gesture_pink_img').attr('alt'));
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('src', $(this).children('#gesture_pink_img').attr('src'));
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('title', $(this).children('#gesture_pink_img').attr('title'));
            lineColor = 9;
        });
        //白色
        sviewFrameDiv.find('#gesture_white').click(function () {
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('alt', $(this).children('#gesture_white_img').attr('alt'));
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('src', $(this).children('#gesture_white_img').attr('src'));
            sviewFrameDiv.find('#gesture_bar_second_main_img').attr('title', $(this).children('#gesture_white_img').attr('title'));
            lineColor = 10;
        });
        //粗
        sviewFrameDiv.find('#gesture_strong_line').click(function () {
            sviewFrameDiv.find('#gesture_bar_third_main_img').attr('alt', $(this).children('#gesture_strong_line_img').attr('alt'));
            sviewFrameDiv.find('#gesture_bar_third_main_img').attr('src', $(this).children('#gesture_strong_line_img').attr('src'));
            sviewFrameDiv.find('#gesture_bar_third_main_img').attr('title', $(this).children('#gesture_strong_line_img').attr('title'));
            lineFont = 2;
        });
        //中
        sviewFrameDiv.find('#gesture_middle_line').click(function () {
            sviewFrameDiv.find('#gesture_bar_third_main_img').attr('alt', $(this).children('#gesture_middle_line_img').attr('alt'));
            sviewFrameDiv.find('#gesture_bar_third_main_img').attr('src', $(this).children('#gesture_middle_line_img').attr('src'));
            sviewFrameDiv.find('#gesture_bar_third_main_img').attr('title', $(this).children('#gesture_middle_line_img').attr('title'));
            lineFont = 1;
        });
        //细
        sviewFrameDiv.find('#gesture_thin_line').click(function () {
            sviewFrameDiv.find('#gesture_bar_third_main_img').attr('alt', $(this).children('#gesture_thin_line_img').attr('alt'));
            sviewFrameDiv.find('#gesture_bar_third_main_img').attr('src', $(this).children('#gesture_thin_line_img').attr('src'));
            sviewFrameDiv.find('#gesture_bar_third_main_img').attr('title', $(this).children('#gesture_thin_line_img').attr('title'));
            lineFont = 0;
        });
        //撤销
        sviewFrameDiv.find('#gesture_undo').click(function () {

        });
        //确定
        sviewFrameDiv.find('#gesture_confirm').click(function () {
            $(document).ready( function(){  
                html2canvas(document.body, {
                    allowTaint: true,
                    taintTest: false,
                    onrendered: function (canvas) {
                        var type ='png';
                        var imgdata = canvas.toDataURL("image/png");
                        //cavas 保存图片到本地  js 实现
                        //------------------------------------------------------------------------
                        //1.确定图片的类型  获取到的图片格式 data:image/Png;base64,...... 
                        ////你想要什么图片格式 就选什么吧
                        //2.0 将mime-type改为image/octet-stream,强制让浏览器下载
                        var fixtype=function(type){
                            type=type.toLocaleLowerCase().replace(/jpg/i,'jpeg');
                            var r=type.match(/png|jpeg|bmp|gif/)[0];
                            return 'image/'+r;
                        };
                        imgdata=imgdata.replace(fixtype(type),'image/octet-stream');
                        //3.0 将图片保存到本地
                        var savaFile=function(data,filename)
                        {
                            var save_link=document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
                            save_link.href=data;
                            save_link.download=filename;
                            var event=document.createEvent('MouseEvents');
                            event.initMouseEvent('click',true,false,window,0,0,0,0,0,false,false,false,false,0,null);
                            save_link.dispatchEvent(event);
                        };
                        var filename=''+new Date().getSeconds()+'.'+type;  
                        //我想用当前秒是可以解决重名的问题了 不行你就换成毫秒
                        savaFile(imgdata,filename);		
                    }
                }); 
            });
        });
        //退出
        sviewFrameDiv.find('#gesture_exit').click(function () {
            if (!sviewFrameDiv.find('#gesture_bar').hasClass('hide')) {
                sviewFrameDiv.find('#gesture_bar').addClass('hide');
                sviewFrameDiv.find('#_scaleL').removeClass(BACKCOLOR[1]);
                //sviewFrameDiv.find("#bottomMenu").show();
                sviewFrameDiv.find('#bottomMenu').removeClass('hide');
                sviewFrameDiv.find('#mainMenu').addClass(BACKCOLOR[1]);
                paint.cxt.clearRect(0, 0, screenWidth, screenHeight);
                sviewFrameDiv.find('#gesture_canvas').hide();
                

                if (sviewFrameDiv.find('#gesture_bar_second_type').hasClass('show')) {
				sviewFrameDiv.find('#gesture_bar_second_type').removeClass('show')
				}
				if (sviewFrameDiv.find('#gesture_bar_third_type').hasClass('show')){
					sviewFrameDiv.find('#gesture_bar_third_type').removeClass('show')
				}
				if (sviewFrameDiv.find('#gesture_bar_type').hasClass('show')){
					sviewFrameDiv.find('#gesture_bar_type').removeClass('show')
				}
            }
        });	

        var linetType = 0;
        var lineColor = 0;
        var lineFont = 1;

        var paint={
            init:function(){
                this.load();
            },
            load:function(){
                this.x=[];//记录鼠标移动时的X坐标
                this.y=[];//记录鼠标移动时的Y坐标
                this.clickDrag=[];
                this.list_map = new Array();
                this.lock=false;//鼠标移动前，判断鼠标是否按下
                this.fontType=[1,2,3,4];//画笔的样式 直线、圆、矩形、三角形
                this.color=["#000000","#D81E06","#1296DB","#2CB936","#F4EA2A","#E98F36","#8A8A8A","#A92DC8","#811204","#ffc0cb","#FFFFFF"];
                this.fontWeight=[2,5,8];		
                this.storageFontType = this.fontType[linetType]; //默认画笔样式为直线;
                this.storageColor = this.color[lineColor];//默认画笔颜色
                this.storageFont = this.fontWeight[lineFont];//默认画笔粗细
                this.$=function(id){return typeof id=="string"?document.getElementById(id):id;};
                this.canvas=this.$("gesture_canvas");
                if (this.canvas.getContext) {
                } else {
                    alert(getLocalizedString(language, "warning", "browserNotSupportCanvas"));
                    return;
                }
                window.addEventListener('touchmove', function (e) {
                    e.preventDefault();
                }, { passive: false });
                this.reset();
                this.revocation=this.$("gesture_undo");//撤销按钮
                this.w = this.canvas.width;//取画布的宽
                this.h = this.canvas.height;//取画布的高
                this.touch =("createTouch" in document);//判定是否为手持设备
                this.StartEvent = this.touch ? "touchstart" : "mousedown";//支持触摸式使用相应的事件替代
                this.MoveEvent = this.touch ? "touchmove" : "mousemove";
                this.EndEvent = this.touch ? "touchend" : "mouseup";
                this.bind();
            },
            reset: function () {
                if (this.canvas) {
                    this.cxt = this.canvas.getContext('2d');
                    this.cxt.lineJoin = "round";//context.lineJoin - 指定两条线段的连接方式
                    this.cxt.lineWidth = this.storageFont;//线条的宽度
                    this.cxt.strokeStyle = this.storageColor;//画笔颜色
                }
            },
            bind:function(){
                var t = this;
                /*鼠标按下事件，记录鼠标位置，并绘制，解锁lock，打开mousemove事件*/
                this.canvas['on' + t.StartEvent] = function (e) {
                    t.width = sviewFrameDiv.width();
                    t.height = sviewFrameDiv.height();
                    t.w = sviewFrameDiv.width();
                    t.h = sviewFrameDiv.height();
                    e.preventDefault()
                    var touch = t.touch ? e.touches[0] : e;
                    var _x = touch.clientX != undefined ? touch.clientX : e.layerX;//鼠标在画布上的x坐标，以画布左上角为起点
                    var _y = touch.clientY != undefined ? touch.clientY : e.layerY;//鼠标在画布上的y坐标，以画布左上角为起点
                    t.movePoint(_x, _y);//记录鼠标位置
                    if (t.storageFontType == 1) {
                        t.drawPoint();//绘制路线
                    }
                    t.lock = true;
                };
                /*鼠标移动事件*/
                this.canvas['on' + t.MoveEvent] = function (e) {
                    t.width = sviewFrameDiv.width();
                    t.height = sviewFrameDiv.height();
                    t.w = sviewFrameDiv.width();
                    t.h = sviewFrameDiv.height();

                    e.preventDefault()
                    var touch = t.touch ? e.touches[0] : e;
                    if (t.lock) {     //t.lock为true则执行
                        var _x = touch.clientX != undefined ? touch.clientX : e.layerX;//鼠标在画布上的x坐标，以画布左上角为起点
                        var _y = touch.clientY != undefined ? touch.clientY : e.layerY;//鼠标在画布上的y坐标，以画布左上角为起点
                        t.movePoint(_x, _y, true);//记录鼠标位置
                        t.drawPoint();//绘制路线
                    }
                };
                this.canvas['on' + t.EndEvent] = function (e) {
                    t.width = sviewFrameDiv.width();
                    t.height = sviewFrameDiv.height();
                    t.w = sviewFrameDiv.width();
                    t.h = sviewFrameDiv.height();

                    /*重置数据*/	
                    var newmap = {};
                    newmap['x'] = t.x;
                    newmap['y'] = t.y;
                    newmap['clickDrag'] = t.clickDrag;
                    newmap['color'] = t.cxt.strokeStyle;
                    newmap['font'] = t.cxt.lineWidth;
                    t.list_map.push(newmap);
                    t.lock=false;
                    t.x=[];
                    t.y=[];
                    t.clickDrag=[];
                };
                this.revocation.onclick=function(){  //撤销
                    t.redraw();
                };
                this.changeColor();
            },
            movePoint:function(x,y,dragging){
                /*将鼠标坐标添加到各自对应的数组里*/
                this.x.push(x);
                this.y.push(y);
                this.clickDrag.push(y);
            },
            drawPoint:function(x,y,radius){
			
                for(var i=0; i < this.x.length; i++){  //循环数组
                    if(this.storageFontType == 1){
                        //画线
					
                        this.cxt.beginPath(); //context.beginPath() , 准备绘制一条路径
                        if(this.clickDrag[i] && i){  //当是拖动而且i!=0时，从上一个点开始画线。
                            this.cxt.moveTo(this.x[i-1], this.y[i-1]);//context.moveTo(x, y) , 新开一个路径，并指定路径的起点
                        }else{
                            this.cxt.moveTo(this.x[i]-1, this.y[i]);
                        }
                        this.cxt.lineTo(this.x[i], this.y[i]);//context.lineTo(x, y) , 将当前点与指定的点用一条笔直的路径连接起来
                        this.cxt.closePath();//context.closePath() , 如果当前路径是打开的则关闭它
                        this.cxt.stroke();//context.stroke() , 绘制当前路径
                    }
                    if(this.storageFontType == 2){
                        //圆形
                        this.cxt.clearRect(0, 0, screenWidth, screenHeight);
                        this.cxt.beginPath();//开始一个新的绘制路径
                        this.cxt.arc(this.x[0], this.y[0], Math.pow(((this.x[i] - this.x[0]) * (this.x[i] - this.x[0]) + (this.y[i] - this.y[0]) * (this.y[i] - this.y[0])), 0.5), 0, 2 * Math.PI, true);
                        this.cxt.stroke();
                    }
                    if(this.storageFontType == 3){
                        //矩形
                        this.cxt.clearRect(0, 0, screenWidth, screenHeight);
                        this.cxt.strokeRect(this.x[0],this.y[0], this.x[i]-this.x[0], this.y[i]-this.y[0]);
                    }
                    if(this.storageFontType == 4){
                        //三角形
                        this.cxt.clearRect(0, 0, screenWidth, screenHeight);
                        this.cxt.beginPath();//开始一个新的绘制路径
                        /*
                        //直角三角形
                        this.cxt.moveTo(this.x[0], this.y[0]);
                        this.cxt.lineTo(this.x[0], this.y[i]);//context.lineTo(x, y) , 将当前点与指定的点用一条笔直的路径连接起来
                        this.cxt.lineTo(this.x[i], this.y[i]);
                        this.cxt.closePath();//context.closePath() , 如果当前路径是打开的则关闭它
                        this.cxt.stroke();//context.stroke() , 绘制当前路径*/
                        //等腰三角形
                        this.cxt.moveTo(this.x[0]+(this.x[i]-this.x[0])/2, this.y[0]);
                        this.cxt.lineTo(this.x[0], this.y[i]);
                        this.cxt.lineTo(this.x[i], this.y[i]);
                        this.cxt.closePath();
                        this.cxt.stroke();
                    }
                }
            },
            redraw: function () {
                /*撤销*/
                var t = this;
                t.cxt.restore();
                t.cxt.clearRect(0, 0, screenWidth, screenHeight);
                if (t.storageFontType == 1) {
                    t.list_map.pop();
                    for (var j = 0; j < t.list_map.length; j++) {
                        var map = t.list_map[j];
                        t.cxt.strokeStyle = map['color'];
                        t.cxt.lineWidth = map['font'];
                        for (var i = 0; i < map['x'].length; i++) {
                            t.cxt.beginPath(); //context.beginPath() , 准备绘制一条路径
                            if (map['clickDrag'][i] && i) {  //当是拖动而且i!=0时，从上一个点开始画线。
                                t.cxt.moveTo(map['x'][i - 1], map['y'][i - 1]);//context.moveTo(x, y) , 新开一个路径，并指定路径的起点
                            } else {
                                t.cxt.moveTo(map['x'][i] - 1, map['y'][i]);
                            }
                            t.cxt.lineTo(map['x'][i], map['y'][i]);//context.lineTo(x, y) , 将当前点与指定的点用一条笔直的路径连接起来
                            t.cxt.closePath();//context.closePath() , 如果当前路径是打开的则关闭它
                            t.cxt.stroke();//context.stroke() , 绘制当前路径		
                        }
                    }
                }
                t.cxt.lineWidth = t.storageFont;
                t.cxt.strokeStyle = t.storageColor;
            },
            preventDefault: function (e) {   //暂时不知道哪里调用
                /*阻止默认*/
                var touch = this.touch ? e.touches[0] : e;
                if (this.touch) touch.preventDefault();
                else window.event.returnValue = false;
            },
            changeColor: function () {
                /*为按钮添加事件*/
                var t = this;
                var typeNum = this.$("gesture_bar_type").getElementsByTagName("a");
                var colNum = this.$("gesture_bar_second_type").getElementsByTagName("a");
                var fontNum = this.$("gesture_bar_third_type").getElementsByTagName("a");
                //画笔样式
                for (var i = 0, l = typeNum.length; i < l; i++) {
                    t.cxt.save();
                    typeNum[i].index = i;
                    typeNum[i].onclick = function () {
                        t.storageFontType = t.fontType[this.index];
                    }
                }
                //颜色
                for (var i = 0, l = colNum.length; i < l; i++) {
                    colNum[i].index = i;
                    colNum[i].onclick = function () {
                        t.cxt.save();
                        t.cxt.strokeStyle = t.color[this.index];
                        t.storageColor = t.color[this.index];
                        t.cxt.strokeStyle = t.storageColor;
                    }
                }
                //粗细
                for (var i = 0, l = fontNum.length; i < l; i++) {
                    t.cxt.save();
                    fontNum[i].index = i;
                    fontNum[i].onclick = function () {
                        t.cxt.lineWidth = t.fontWeight[this.index];
                        t.storageFont = t.fontWeight[this.index];
                        t.cxt.strokeStyle = t.storageColor;
                    }
                }
            }
        };
        
        
        
        //点击文本批注显示批注菜单
        sviewFrameDiv.find('#_note').click(function (e) {
            if (sviewFrameDiv.find('#note_bar').hasClass('hide')) {
                //sviewFrameDiv.find("#bottomMenu").hide();
                sviewFrameDiv.find('#bottomMenu').addClass('hide');
                sviewFrameDiv.find('#mainMenu').removeClass(BACKCOLOR[1]);
                sviewFrameDiv.find(".pull-right").hide();//右边菜单隐藏
                sviewFrameDiv.find('#note_bar').removeClass('hide');
                sview.onMeasureBase();
                sview.GetSelector().Clear();
                $("#context-menu").addClass('disabled');
            }
        });
        //点击批注菜单的退出退出批注菜单
        sviewFrameDiv.find('#node_exit').click(function (e) {
            if (!sviewFrameDiv.find('#note_bar').hasClass('hide')) {
                sviewFrameDiv.find('#note_bar').addClass('hide');
                sviewFrameDiv.find('#node_text').removeClass(BACKCOLOR[1]);
                //sviewFrameDiv.find("#bottomMenu").show();
                sviewFrameDiv.find('#bottomMenu').removeClass('hide');
                sviewFrameDiv.find('#mainMenu').addClass(BACKCOLOR[1]);
                sviewFrameDiv.find(".pull-right").show();//右边菜单隐藏
                sviewFrameDiv.find('#node_text').removeClass(BACKCOLOR[1]);
                sviewFrameDiv.find('#node_sequence').removeClass(BACKCOLOR[1]);
                sviewFrameDiv.find('#node_voice').removeClass(BACKCOLOR[1]);
                sview.onMeasureExit();
            }
        });
        //文本批注
        sviewFrameDiv.find('#node_text').click(function (e) {
            if (sviewFrameDiv.find('#node_text').hasClass(BACKCOLOR[1])) {
		        sviewFrameDiv.find('#node_text').removeClass(BACKCOLOR[1])
            } else {
                sviewFrameDiv.find('#node_voice').removeClass(BACKCOLOR[1]);
                sviewFrameDiv.find('#node_sequence').removeClass(BACKCOLOR[1]);
                sviewFrameDiv.find('#node_text').addClass(BACKCOLOR[1]);
            }
			sview.onTextNote();
		});
        sviewFrameDiv.find('#node_del').click(function (e) {
            sview.onNoteDelete();
        });
        sviewFrameDiv.find('#node_voice').click(function (e) {
            if (sviewFrameDiv.find('#node_voice').hasClass(BACKCOLOR[1])) {
                sviewFrameDiv.find('#node_voice').removeClass(BACKCOLOR[1])
            } else {
                sviewFrameDiv.find('#node_text').removeClass(BACKCOLOR[1]);
                sviewFrameDiv.find('#node_sequence').removeClass(BACKCOLOR[1]);
                sviewFrameDiv.find('#node_voice').addClass(BACKCOLOR[1]);
            }

            
        });
        sviewFrameDiv.find('#node_sequence').click(function (e) {
            if (sviewFrameDiv.find('#node_sequence').hasClass(BACKCOLOR[1])) {
                sviewFrameDiv.find('#node_sequence').removeClass(BACKCOLOR[1])
            } else {
                sviewFrameDiv.find('#node_text').removeClass(BACKCOLOR[1]);
                sviewFrameDiv.find('#node_sequence').addClass(BACKCOLOR[1]);
                sviewFrameDiv.find('#node_voice').removeClass(BACKCOLOR[1]);
            }

            sview.onSequenceNote();
        });
        sviewFrameDiv.find('#node_edit').click(function (e) {
            if (sview.GetSelector().GetAll().length > 1) {
                CreateInfoWindow(e, getLocalizedString(language, "Alert", "Alert_Prompt"), getLocalizedString(language, "Edit", "TextNoteMulEdit"));
                sview.GetSelector().Clear();
                return;
            }
            if (sview.GetSelector().GetAll().length > 0 && sview.CanEditNote()) {
                // 弹窗
                $("#editNote").modal('show');
                sviewFrameDiv.find("#confirmEditNote").click(function () {
                    isConfirmTextNote = true;
                    var shapeId = sview.GetSelector().GetAll()[0];
                    var str = $("#editNote_input").val();
                    if (isNaN(str, 10) && sview.editSequenceNote()) {
                        alert(getLocalizedString(language, "TextNote", "InputNumber"));
                    } else {
                        sview.UpdateNote(shapeId.GetID(), $("#editNote_input").val());
                    }
                    sviewFrameDiv.find("#confirmEditNote").unbind('click');
                    $("#editNote_input").val(getLocalizedString(language, "TextNote", "InputContent"));
                    var obj = document.getElementById("editNote_input");
                    obj.style.color = "gray";
                });

                sviewFrameDiv.find("#cancleEditNote").click(function () {
                    sviewFrameDiv.find("#cancleEditNote").unbind('click');
                });
                $("#editNote").on('hide.bs.modal', function () {
                    if (isConfirmTextNote != true) {
                    }
                });
            }
        });
        /***********************************************************测量开始****************************************************************/
        
        //点击测量显示测量菜单
        sviewFrameDiv.find('#measure').click(function (e) {
            if (sviewFrameDiv.find('#measure_bar').hasClass('hide')) {
                //sviewFrameDiv.find("#bottomMenu").hide();
                sviewFrameDiv.find('#bottomMenu').addClass('hide');
                //sviewFrameDiv.find('#bottomMenu').removeClass('hide');
                sviewFrameDiv.find('#mainMenu').removeClass(BACKCOLOR[1]);
                sviewFrameDiv.find(".pull-right").hide();//右边菜单隐藏
                sviewFrameDiv.find('#measure_bar').removeClass('hide');
                $("#measureDistance").show();
                $("#measureProperty").hide();
                $("#measureAngle").hide();
                sview.onMeasureBase();
                sview.GetSelector().Clear();
                $("#context-menu").addClass('disabled');
                changeMeasureType(0);
                sview.loadMeasure();
            }
        });
        var currentMeasure = 0;
        // 去除测量背景
        function hideMeasureBacrground(lastMueasure) {
            switch(currentMeasure){
                case 1: {
                    sviewFrameDiv.find('#measure_PntToPnt').removeClass(BACKCOLOR[1]);
                }
                    break;
                case 2: {
                    sviewFrameDiv.find('#measure_PntToLine').removeClass(BACKCOLOR[1]);
                }
                    break;
                case 3: {
                    sviewFrameDiv.find('#measure_PntToFace').removeClass(BACKCOLOR[1]);
                }
                    break;
                case 4: {
                    sviewFrameDiv.find('#measure_LineToLine').removeClass(BACKCOLOR[1]);
                }
                    break;
                case 5: {
                    sviewFrameDiv.find('#measure_LineToFace').removeClass(BACKCOLOR[1]);
                }
                    break;
                case 6: {
                    sviewFrameDiv.find('#measure_FaceToFace').removeClass(BACKCOLOR[1]);
                }
                    break;
                case 11: {
                    sviewFrameDiv.find('#measure_LineWithLine').removeClass(BACKCOLOR[1]);
                }
                    break;
                case 12: {
                    sviewFrameDiv.find('#measure_LineWithFace').removeClass(BACKCOLOR[1]);
                }
                    break;
                case 13: {
                    sviewFrameDiv.find('#measure_FaceWithFace').removeClass(BACKCOLOR[1]);
                }
                    break;
                case 21: {
                    sviewFrameDiv.find('#measure_Point').removeClass(BACKCOLOR[1]);
                }
                    break;
                case 22: {
                    sviewFrameDiv.find('#measure_Line').removeClass(BACKCOLOR[1]);
                }
                    break;
                case 23: {
                    sviewFrameDiv.find('#measure_Face').removeClass(BACKCOLOR[1]);
                }
                    break;
                case 24: {
                    sviewFrameDiv.find('#measure_Model').removeClass(BACKCOLOR[1]);
                }
                    break;
            }
            $("#measurePorpertyList").hide();
        }
        // 测量类型
        sviewFrameDiv.find('#measure_CurrentType').click(function (e) {
            //if (M3D.Parameters.Instance().isMergeFace) {
            //    CreateInfoWindow(e, getLocalizedString(language, "Alert", "Alert_Prompt"), getLocalizedString(language, "Alert", "Alert_MergeFace"));
            //    return;
            //}
            if (sviewFrameDiv.find('#measure_bar_third_type').hasClass('show')) {
                sviewFrameDiv.find('#measure_bar_third_type').removeClass('show');
            } else {
                sviewFrameDiv.find('#measure_bar_third_type').addClass('show')
            }
        });
        function changeMeasureType(type) {
            hideMeasureBacrground(currentMeasure);
            currentMeasure = 0;
            sview.GetSelector().Clear();
            sview.onMeasureBase();
            if (screenWidth > 767) {
                sviewFrameDiv.find('#measureBar').width(type === 0 ? "405px" : type === 1 ? "270px" : "315px");
            } else if (375<= screenWidth <= 767) {
                sviewFrameDiv.find('#measureBar').width(type === 0 ? "320px" : type === 1 ? "220px" : "265px");
            } else if (screenWidth <= 375) {
                sviewFrameDiv.find('#measureBar').width(type === 0 ? "300px" : type === 1 ? "195px" : "240px");
            }
            sviewFrameDiv.find('#measure_bar_third_type').removeClass('show');
        }
        sviewFrameDiv.find(".measure").click(function (e) {
            sviewFrameDiv.find(".measure").removeClass(BACKCOLOR[0]);
            $(this).addClass(BACKCOLOR[0]);
            e.stopPropagation();
        });
        let currentType = 0;
        //测量
        sviewFrameDiv.find("#measure_Type_Distance").click(function () {
            changeMeasureType(0);
            sviewFrameDiv.find("#measure_CurrentType_Image").attr('src', sviewBaseUrl + 'images/sview_measure_distance.png');
            $("#measureDistance").show();
            $("#measureProperty").hide();
            $("#measureAngle").hide();
            if ($("#measure_del").hasClass("hide")) {
                $("#measure_del").removeClass("hide");
            }
            currentType = 0;
        });
        sviewFrameDiv.find("#measure_Type_Angle").click(function (e) {
            if (M3D.Parameters.Instance().isMergeFace) {
                CreateInfoWindow(e, getLocalizedString(language, "Alert", "Alert_Prompt"), getLocalizedString(language, "Alert", "Alert_MergeFace"));
                switch (currentType) {
                    case 0: {
                        sviewFrameDiv.find(".measure").removeClass(BACKCOLOR[0]);
                        sviewFrameDiv.find("#measure_Type_Distance").addClass(BACKCOLOR[0]);
                    }
                        break;
                    case 2: {
                        sviewFrameDiv.find(".measure").removeClass(BACKCOLOR[0]);
                        sviewFrameDiv.find('#measure_Type_Property').addClass(BACKCOLOR[0]);
                    }
                        break;
                }
                return;
            }
            changeMeasureType(1);
            sviewFrameDiv.find("#measure_CurrentType_Image").attr('src', sviewBaseUrl + 'images/sview_measure_angle.png');
            $("#measureDistance").hide();
            $("#measureProperty").hide();
            $("#measureAngle").show();
            if ($("#measure_del").hasClass("hide")) {
                $("#measure_del").removeClass("hide");
            }
            currentType = 1;
        });
        sviewFrameDiv.find("#measure_Type_Property").click(function (e) {
            
            changeMeasureType(2);
            sviewFrameDiv.find("#measure_CurrentType_Image").attr('src', sviewBaseUrl + 'images/sview_measure_attributes.png');
            
            $("#measureDistance").hide();
            $("#measureProperty").show();
            $("#measureAngle").hide();
            if (!$("#measure_del").hasClass("hide")) {
                $("#measure_del").addClass("hide");
            }
            currentType = 2;
        });
        sviewFrameDiv.find('.measureBackground').click(function (e) {
            hideMeasureBacrground(currentMeasure);
        });
        sviewFrameDiv.find('#measure_PntToPnt').click(function (e) {
            if (currentMeasure !== 1) {
                currentMeasure = 1;
                sviewFrameDiv.find('#measure_PntToPnt').addClass(BACKCOLOR[1]);
            } else {
                currentMeasure = 0;
            }
            sview.onMeasureDistancePntToPnt();
        });
        sviewFrameDiv.find('#measure_PntToLine').click(function (e) {
            if (M3D.Parameters.Instance().isMergeFace) {
                CreateInfoWindow(e, getLocalizedString(language, "Alert", "Alert_Prompt"), getLocalizedString(language, "Alert", "Alert_MergeFace"));
                switch (currentMeasure) {
                    case 1: {
                        sviewFrameDiv.find('#measure_PntToPnt').addClass(BACKCOLOR[1]);
                    }
                        break;
                    case 21: {
                        sviewFrameDiv.find('#measure_Point').addClass(BACKCOLOR[1]);
                    }
                        break;
                    case 24: {
                        sviewFrameDiv.find('#measure_Model').addClass(BACKCOLOR[1]);
                    }
                        break;
                }
                return;
            }
            if (currentMeasure !== 2) {
                currentMeasure = 2;
                sviewFrameDiv.find('#measure_PntToLine').addClass(BACKCOLOR[1]);
            } else {
                currentMeasure = 0;
            }
            sview.onMeasureDistancePntToLine();
        });
        sviewFrameDiv.find('#measure_PntToFace').click(function (e) {
            if (M3D.Parameters.Instance().isMergeFace) {
                CreateInfoWindow(e, getLocalizedString(language, "Alert", "Alert_Prompt"), getLocalizedString(language, "Alert", "Alert_MergeFace"));
                switch (currentMeasure) {
                    case 1: {
                        sviewFrameDiv.find('#measure_PntToPnt').addClass(BACKCOLOR[1]);
                    }
                        break;
                    case 21: {
                        sviewFrameDiv.find('#measure_Point').addClass(BACKCOLOR[1]);
                    }
                        break;
                    case 24: {
                        sviewFrameDiv.find('#measure_Model').addClass(BACKCOLOR[1]);
                    }
                        break;
                }
                return;
            }
            if (currentMeasure !== 3) {
                currentMeasure = 3;
                sviewFrameDiv.find('#measure_PntToFace').addClass(BACKCOLOR[1]);
            } else {
                currentMeasure = 0;
            }
            sview.onMeasureDistancePntToFace();
        });
        
        sviewFrameDiv.find('#measure_LineToLine').click(function (e) {
            if (M3D.Parameters.Instance().isMergeFace) {
                CreateInfoWindow(e, getLocalizedString(language, "Alert", "Alert_Prompt"), getLocalizedString(language, "Alert", "Alert_MergeFace"));
                switch (currentMeasure) {
                    case 1: {
                        sviewFrameDiv.find('#measure_PntToPnt').addClass(BACKCOLOR[1]);
                    }
                        break;
                    case 21: {
                        sviewFrameDiv.find('#measure_Point').addClass(BACKCOLOR[1]);
                    }
                        break;
                    case 24: {
                        sviewFrameDiv.find('#measure_Model').addClass(BACKCOLOR[1]);
                    }
                        break;
                }
                return;
            }
            if (currentMeasure !== 4) {
                currentMeasure = 4;
                sviewFrameDiv.find('#measure_LineToLine').addClass(BACKCOLOR[1]);
            } else {
                currentMeasure = 0;
            }
            sview.onMeasureDistanceLineToLine();
        });
        sviewFrameDiv.find('#measure_LineToFace').click(function (e) {
            if (M3D.Parameters.Instance().isMergeFace) {
                CreateInfoWindow(e, getLocalizedString(language, "Alert", "Alert_Prompt"), getLocalizedString(language, "Alert", "Alert_MergeFace"));
                switch (currentMeasure) {
                    case 1: {
                        sviewFrameDiv.find('#measure_PntToPnt').addClass(BACKCOLOR[1]);
                    }
                        break;
                    case 21: {
                        sviewFrameDiv.find('#measure_Point').addClass(BACKCOLOR[1]);
                    }
                        break;
                    case 24: {
                        sviewFrameDiv.find('#measure_Model').addClass(BACKCOLOR[1]);
                    }
                        break;
                }
                return;
            }
            if (currentMeasure !== 5) {
                currentMeasure = 5;
                sviewFrameDiv.find('#measure_LineToFace').addClass(BACKCOLOR[1]);
            } else {
                currentMeasure = 0;
            }
            sview.onMeasureDistanceLineToFace();
        });
        sviewFrameDiv.find('#measure_FaceToFace').click(function (e) {
            if (M3D.Parameters.Instance().isMergeFace) {
                CreateInfoWindow(e, getLocalizedString(language, "Alert", "Alert_Prompt"), getLocalizedString(language, "Alert", "Alert_MergeFace"));
                switch (currentMeasure) {
                    case 1: {
                        sviewFrameDiv.find('#measure_PntToPnt').addClass(BACKCOLOR[1]);
                    }
                        break;
                    case 21: {
                        sviewFrameDiv.find('#measure_Point').addClass(BACKCOLOR[1]);
                    }
                        break;
                    case 24: {
                        sviewFrameDiv.find('#measure_Model').addClass(BACKCOLOR[1]);
                    }
                        break;
                }
                return;
            }
            if (currentMeasure !== 6) {
                currentMeasure = 6;
                sviewFrameDiv.find('#measure_FaceToFace').addClass(BACKCOLOR[1]);
            } else {
                currentMeasure = 0;
            }
            sview.onMeasureDistanceFaceToFace();
        });
        //sviewFrameDiv.find('#measure_LineWithLine').click(function (e) {
        //    if (currentMeasure !== 11) {
        //        currentMeasure = 11;
        //        sviewFrameDiv.find('#measure_LineWithLine').addClass(BACKCOLOR[1]);
        //    } else {
        //        currentMeasure = 0;
        //    }
        //    sview.onMeasureAngleLineToLine();
        //});
        sviewFrameDiv.find('#measure_LineWithLine').click(function (e) {
            if (M3D.Parameters.Instance().isMergeFace) {
                CreateInfoWindow(e, getLocalizedString(language, "Alert", "Alert_Prompt"), getLocalizedString(language, "Alert", "Alert_MergeFace"));
                switch (currentMeasure) {
                    case 1: {
                        sviewFrameDiv.find('#measure_PntToPnt').addClass(BACKCOLOR[1]);
                    }
                        break;
                    case 21: {
                        sviewFrameDiv.find('#measure_Point').addClass(BACKCOLOR[1]);
                    }
                        break;
                    case 24: {
                        sviewFrameDiv.find('#measure_Model').addClass(BACKCOLOR[1]);
                    }
                        break;
                }
                return;
            }
            if (currentMeasure !== 11) {
                currentMeasure = 11;
                sviewFrameDiv.find('#measure_LineWithLine').addClass(BACKCOLOR[1]);
            } else {
                currentMeasure = 0;
            }
            sview.onMeasureAngleCurveToCurve();
        });
        sviewFrameDiv.find('#measure_LineWithFace').click(function (e) {
            if (M3D.Parameters.Instance().isMergeFace) {
                CreateInfoWindow(e, getLocalizedString(language, "Alert", "Alert_Prompt"), getLocalizedString(language, "Alert", "Alert_MergeFace"));
                switch (currentMeasure) {
                    case 1: {
                        sviewFrameDiv.find('#measure_PntToPnt').addClass(BACKCOLOR[1]);
                    }
                        break;
                    case 21: {
                        sviewFrameDiv.find('#measure_Point').addClass(BACKCOLOR[1]);
                    }
                        break;
                    case 24: {
                        sviewFrameDiv.find('#measure_Model').addClass(BACKCOLOR[1]);
                    }
                        break;
                }
                return;
            }
            if (currentMeasure !== 12) {
                currentMeasure = 12;
                sviewFrameDiv.find('#measure_LineWithFace').addClass(BACKCOLOR[1]);
            } else {
                currentMeasure = 0;
            }
            sview.onMeasureAngleLineToFace();
        });
        sviewFrameDiv.find('#measure_FaceWithFace').click(function (e) {
            if (M3D.Parameters.Instance().isMergeFace) {
                CreateInfoWindow(e, getLocalizedString(language, "Alert", "Alert_Prompt"), getLocalizedString(language, "Alert", "Alert_MergeFace"));
                switch (currentMeasure) {
                    case 1: {
                        sviewFrameDiv.find('#measure_PntToPnt').addClass(BACKCOLOR[1]);
                    }
                        break;
                    case 21: {
                        sviewFrameDiv.find('#measure_Point').addClass(BACKCOLOR[1]);
                    }
                        break;
                    case 24: {
                        sviewFrameDiv.find('#measure_Model').addClass(BACKCOLOR[1]);
                    }
                        break;
                }
                return;
            }
            if (currentMeasure !== 13) {
                currentMeasure = 13;
                sviewFrameDiv.find('#measure_FaceWithFace').addClass(BACKCOLOR[1]);
            } else {
                currentMeasure = 0;
            }
            sview.onMeasureAngleFaceToFace();
        });
        sviewFrameDiv.find('#measure_Point').click(function (e) {
            
            if (currentMeasure !== 21) {
                currentMeasure = 21;
                sviewFrameDiv.find('#measure_Point').addClass(BACKCOLOR[1]);
            } else {
                currentMeasure = 0;
            }
            sview.onMeasurePropertyPoint();
        });
        sviewFrameDiv.find('#measure_Line').click(function (e) {
            if (M3D.Parameters.Instance().isMergeFace) {
                CreateInfoWindow(e, getLocalizedString(language, "Alert", "Alert_Prompt"), getLocalizedString(language, "Alert", "Alert_MergeFace"));
                switch (currentMeasure) {
                    case 1: {
                        sviewFrameDiv.find('#measure_PntToPnt').addClass(BACKCOLOR[1]);
                    }
                        break;
                    case 21: {
                        sviewFrameDiv.find('#measure_Point').addClass(BACKCOLOR[1]);
                        $("#measurePorpertyList").show();
                    }
                        break;
                    case 24: {
                        sviewFrameDiv.find('#measure_Model').addClass(BACKCOLOR[1]);
                        $("#measurePorpertyList").show();
                    }
                        break;
                }
                return;
            }
            if (currentMeasure !== 22) {
                currentMeasure = 22;
                sviewFrameDiv.find('#measure_Line').addClass(BACKCOLOR[1]);
            } else {
                currentMeasure = 0;
            }
            sview.onMeasurePropertyLine();
        });
        sviewFrameDiv.find('#measure_Face').click(function (e) {
            if (M3D.Parameters.Instance().isMergeFace) {
                CreateInfoWindow(e, getLocalizedString(language, "Alert", "Alert_Prompt"), getLocalizedString(language, "Alert", "Alert_MergeFace"));
                switch (currentMeasure) {
                    case 1: {
                        sviewFrameDiv.find('#measure_PntToPnt').addClass(BACKCOLOR[1]);
                    }
                        break;
                    case 21: {
                        sviewFrameDiv.find('#measure_Point').addClass(BACKCOLOR[1]);
                        $("#measurePorpertyList").show();
                    }
                        break;
                    case 24: {
                        sviewFrameDiv.find('#measure_Model').addClass(BACKCOLOR[1]);
                        $("#measurePorpertyList").show();
                    }
                        break;
                }
                return;
            }
            if (currentMeasure !== 23) {
                currentMeasure = 23;
                sviewFrameDiv.find('#measure_Face').addClass(BACKCOLOR[1]);
            } else {
                currentMeasure = 0;
            }
            sview.onMeasurePropertyFace();
        });
        sviewFrameDiv.find('#measure_Model').click(function (e) {
           
            if (currentMeasure !== 24) {
                currentMeasure = 24;
                sviewFrameDiv.find('#measure_Model').addClass(BACKCOLOR[1]);
            } else {
                currentMeasure = 0;
            }
            sview.onMeasurePropertyModel();
        });
        sviewFrameDiv.find('#measure_del').click(function (e) {
            sview.onNoteDelete();
        });

        sviewFrameDiv.find('#measure_exit').click(function (e) {
            if (!sviewFrameDiv.find('#measure_bar').hasClass('hide')) {
                sviewFrameDiv.find('#measure_bar').addClass('hide');
                //sviewFrameDiv.find("#bottomMenu").show();
                sviewFrameDiv.find('#bottomMenu').removeClass('hide');
                sviewFrameDiv.find('#mainMenu').addClass(BACKCOLOR[1]);
                sviewFrameDiv.find(".pull-right").show();//右边菜单隐藏
                sviewFrameDiv.find('#measure_PntToPnt').removeClass(BACKCOLOR[1]);
                // 隐藏选择测量类型弹出框
                sviewFrameDiv.find('#measure_bar_third_type').removeClass('show');
                sview.onMeasureExit();
                hideMeasureBacrground(currentMeasure);
                if (currentType !== 0){
                    sviewFrameDiv.find(currentType === 2? '#measure_Type_Property' : '#measure_Type_Angle').removeClass(BACKCOLOR[0]);
                    sviewFrameDiv.find('#measure_Type_Distance').addClass(BACKCOLOR[0]);
                }
                sviewFrameDiv.find("#measure_CurrentType_Image").attr('src', sviewBaseUrl + 'images/sview_measure_distance.png');
                $("#measurePorpertyList").hide();
                sview.removeMeasure();
            }
        });
        /***********************************************************测量结束****************************************************************/
		var system = {};
		var p = navigator.platform;
		system.win = p.indexOf("Win") == 0;
		system.mac = p.indexOf("Mac") == 0;
		system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
		if (system.win || system.mac || system.xll) {//如果是电脑
		    $("#ani_percentage").mousedown(function (e) {
		        if (option.animationStatus) { sview.Pause(); }
		        e.stopPropagation();
		    }).mouseup(function (e) {
		        sview.animationPlayer.SetPercent($("#ani_percentage").val() * 100);
		        if (option.animationStatus) {

		            sview.Play();
		        }
		    });
		} else {  //如果是手机
		    document.getElementById("ani_percentage").addEventListener('touchstart', function (e) {
		        if (option.animationStatus) { sview.Pause(); }
		        e.stopPropagation();
		    }, false);
		    document.getElementById("ani_percentage").addEventListener('touchstart', function (e) { sview.animationPlayer.SetPercent($("#ani_percentage").val() * 100); }, false);
		    document.getElementById("ani_percentage").addEventListener('touchend', function (e) {
		        sview.animationPlayer.SetPercent($("#ani_percentage").val() * 100);
		        if (option.animationStatus) {

		            sview.Play();
		        }
		    }, false);
		   
		    
		}
        sviewFrameDiv.find('#autoWalk').click(function (e) {
			sview.animationPlayer.SetAutoWalkCamera($('#autoWalk').is(":checked"));
			M3D.CookieHelper.AddCookie("sview_autoWalk", $('#autoWalk').is(":checked"), 30);
            e.stopPropagation();

        });

        sviewFrameDiv.find('#speedSelect').on('change', function (e)
        {
            e.stopPropagation();
            sview.animationPlayer.SetSpeed($("#speedSelect option:selected").val());
            M3D.CookieHelper.AddCookie("sview_speedSelect", $("#speedSelect option:selected").val(), 30);
            //e.stopPropagation();

        });


        sviewFrameDiv.find('#aniLoop').click(function (e) {
			sview.animationPlayer.SetLoop($("#aniLoop").is(":checked"));
			M3D.CookieHelper.AddCookie("sview_aniLoop", $("#aniLoop").is(":checked"), 30);
        })

        sviewFrameDiv.find('.ani-pause').click(function (e) {
            //AnimationStart();

            if (option.animationStatus) {
                Anima_Pause();
            }
            else {
                Anima_Play();
            }
            //TODO 进度条播放到底的时候 更改图标状态并且点击播放按钮时  从头开始播放
            //if (Math.round(sview.animationPlayer.GetPercent()) == 100) {

            //    $(".ani-pause").html("<img src='images/button_ani.png' alt='开始' title='开始'>")
            //    AnimationStart();
            //    ;


            //    console.log(option.animationStatus);
            //}
            e.stopPropagation();
        });

        //漫游模式
        sviewFrameDiv.find('#walking_touch_handler').click(function (e) {
            var status = this.checked;
            if ($("#infoModal").css("display") == "block"){
                $("#infoModal").modal('hide');
            }
            if (status) {
				sview.SetUsingTouchHandlerType(0);
				CreateJoystick();
				option.isOpenJoystick = true;
				var walkThroughSpeed = M3D.CookieHelper.GetCookie("walkThroughSpeed"); // 漫游速度
				var walkThroughFov = M3D.CookieHelper.GetCookie("walkThroughFov"); // 视野角度
				var walkThroughUpdirection = M3D.CookieHelper.GetCookie("walkThroughUpdirection"); // 向上方向
				if (walkThroughSpeed) {
				    $(".walking_speed").val(walkThroughSpeed);
				    switch (walkThroughSpeed) {
				        case '0.25x':
				            sview.SetWalkingSpeed(0.25);
				            break;
				        case '0.5x':
				            sview.SetWalkingSpeed(0.5);
				            break;
				        case '0.75x':
				            sview.SetWalkingSpeed(0.75);
				            break;
				        case '1x':
				            sview.SetWalkingSpeed(1.0);
				            break;
				        case '2x':
				            sview.SetWalkingSpeed(2.0);
				            break;
				        case '4x':
				            sview.SetWalkingSpeed(4.0);
				            break;
				        case '6x':
				            sview.SetWalkingSpeed(6.0);
				            break;
				    }
				}
				if (walkThroughFov) {
				    $(".walking_fov").val(walkThroughFov);
				    sview.SetCameraFov(Number(walkThroughFov.replace('°', '')));
				}
				if (walkThroughUpdirection) {
				    $(".walking_updirection ").val(walkThroughUpdirection);
				    sview.SetUpdirection(Number(walkThroughUpdirection));
				}
				RestoreView();
				var isCameraPro = sviewFrameDiv.find("#perspective").hasClass(BACKCOLOR[0]);
				if (!isCameraPro){
				    sviewFrameDiv.find("#perspective").addClass(BACKCOLOR[0])
				}
            }
            else {
                DestoryJoystick();
                option.isOpenJoystick = false;
                sview.SetUsingTouchHandlerType(1);
                var isCameraPro = sviewFrameDiv.find("#perspective").hasClass(BACKCOLOR[0]);
                if (isCameraPro) {
                    sviewFrameDiv.find("#perspective").removeClass(BACKCOLOR[0])
                }
            }
            e.stopPropagation();
        });
        sviewFrameDiv.find('#walking_joystick').click(function (e) {
            var curHandler = sview.view.GetTouchHandler() instanceof M3D.WalkthroughHandler; 
            if (!curHandler) {
                CreateInfoWindow(e, getLocalizedString(language, "Prompt", "Prompt"), getLocalizedString(language, "Alert", "Alert_Context"));
                this.checked = false;
                e.stopPropagation();
                return true;
            }
            var status = this.checked;
            if (status) {
                if (joystick == null){
                    CreateJoystick();
                }
                
                option.isOpenJoystick = true;
            }
            else {
                DestoryJoystick();
                option.isOpenJoystick = false;
            }

            e.stopPropagation();
        });
        $('.walking_speed').mousedown(function (e) {
            var curHandler = sview.view.GetTouchHandler() instanceof M3D.WalkthroughHandler;
            if (!curHandler) {
                CreateInfoWindow(e, getLocalizedString(language, "Prompt", "Prompt"), getLocalizedString(language, "Alert", "Alert_Context"));
                this.checked = false;
                return false;
            } else {
                return true;
            }
        });
        sviewFrameDiv.find('.walking_speed').click(function (e) {
            e.stopPropagation();
        });
        sviewFrameDiv.find('.walking_speed').change(function (e) {
            var speedValue = $(this).val();
            switch (speedValue) {
                case '0.25x':
                    sview.SetWalkingSpeed(0.25);
                    break;
                case '0.5x':
                    sview.SetWalkingSpeed(0.5);
                    break;
                case '0.75x':
                    sview.SetWalkingSpeed(0.75);
                    break;
                case '1x':
                    sview.SetWalkingSpeed(1.0);
                    break;
                case '2x':
                    sview.SetWalkingSpeed(2.0);
                    break;
                case '4x':
                    sview.SetWalkingSpeed(4.0);
                    break;
                case '6x':
                    sview.SetWalkingSpeed(6.0);
                    break;

            }
			M3D.CookieHelper.AddCookie("walkThroughSpeed", speedValue, "30");
            e.stopPropagation();
        });
        $('.walking_updirection').mousedown(function (e) {
            var curHandler = sview.view.GetTouchHandler() instanceof M3D.WalkthroughHandler;
            if (!curHandler) {
                CreateInfoWindow(e, getLocalizedString(language, "Prompt", "Prompt"), getLocalizedString(language, "Alert", "Alert_Context"));
                this.checked = false;
                return false;
            } else {
                return true;
            }
        });
        sviewFrameDiv.find('.walking_updirection').click(function (e) {
            e.stopPropagation();
        });
        sviewFrameDiv.find('.walking_updirection').change(function (e)
        {
            var updirection = $(this).val();
            switch (updirection)
            {
                case '0':
                    sview.SetUpdirection(0);
                    break;
                case '1':
                    sview.SetUpdirection(1);
                    break;
                case '2':
                    sview.SetUpdirection(2);
                    break;
                case '3':
                    sview.SetUpdirection(3);
                    break;
                case '4':
                    sview.SetUpdirection(4);
                    break;
                case '5':
                    sview.SetUpdirection(5);
                    break;
               

            }
			M3D.CookieHelper.AddCookie("walkThroughUpdirection", updirection, "30");
            e.stopPropagation();
        });
        $('.walking_fov').mousedown(function (e){
            var curHandler = sview.view.GetTouchHandler() instanceof M3D.WalkthroughHandler;
            if (!curHandler) {
                CreateInfoWindow(e, getLocalizedString(language, "Prompt", "Prompt"), getLocalizedString(language, "Alert", "Alert_Context"));
                this.checked = false;
                return false;
            } else {
                return true;
            }
        });
        sviewFrameDiv.find('.walking_fov').click(function (e)
        {
            e.stopPropagation();
        });
        sviewFrameDiv.find('.walking_fov').change(function (e)
        {            
            var walking_fov = $(this).val();
            switch (walking_fov)
            {
                case '50°':
                    sview.SetCameraFov(50);
                    break;
                case '60°':
                    sview.SetCameraFov(60);
                    break;
                case '70°':
                    sview.SetCameraFov(70);
                    break;
                case '80°':
                    sview.SetCameraFov(80);
                    break;
                case '90°':
                    sview.SetCameraFov(90);
                    break;
                case '100°':
                    sview.SetCameraFov(100);
                    break;
                case '110°':
                    sview.SetCameraFov(110);
                    break;
                case '120°':
                    sview.SetCameraFov(120);
                    break;
                case '130°':
                    sview.SetCameraFov(130);
                    break;
                case '140°':
                    sview.SetCameraFov(140);
                    break;
                case '150°':
                    sview.SetCameraFov(150);
                    break;

            }
			M3D.CookieHelper.AddCookie("walkThroughFov", walking_fov, "30");
            e.stopPropagation();
        });
        //快捷菜单 给动态添加的元素绑定事件的方法第一个参数是触发事件，第二个为过滤元素，第三个为要执行的事件
        $("#contextmenudiv").on("click", 'a', function (e) {
            sviewFrameDiv.find(".contextMenu").removeClass(BACKCOLOR[0]);
            $(this).addClass(BACKCOLOR[0]);
            e.stopPropagation();
        });
        $("#contextmenudiv").on("click", '[id="contextMenu0"]', function (e) {

            if (sview.IsUseModelContextMenu()) {
                selectionOperator.HideCurrent();
            }
            else if (option.usem2) {
                selectionOperator.ExchangeHidden();
            }
        });
        $("#contextmenudiv").on("click", '[id="contextMenu1"]', function (e) {
            if (sview.IsUseModelContextMenu()) {
                $(e.target).click(function () {
                    selectionOperator.OnlyDisplayCurrent();
                }());
            }
            else if (option.usem2) {
                selectionOperator.DisplayAll();
            }
        });
        $("#contextmenudiv").on("click", '[id="contextMenu2"]', function (e) {
            if (sview.IsUseModelContextMenu()) {
                selectionOperator.DisplayInCenter();
            }
            else if (option.usem2) {
                sview.SetUsingTouchHandlerType(3);
                sviewFrameDiv.find('#dagger_bar').show();
                sviewFrameDiv.find(".dface").addClass(BACKCOLOR[0]);
            }
        });
        $("#contextmenudiv").on("click", '[id="contextMenu3"]', function (e) {
            if (sview.IsUseModelContextMenu()) {
                selectionOperator.ContinuousRotation();
            }
            else if (option.usem2) {
                selectionOperator.DisplayInCenter();
            }
        });
        $("#contextmenudiv").on("click", '[id="contextMenu4"]', function (e) {
            if (sview.IsUseModelContextMenu()) {
                $(e.target).click(function () {
                    $("#aboutModal").modal('toggle');
                }());
            }
            else if (option.usem2) {
                selectionOperator.ContinuousRotation();
            }
        });
        $("#contextmenudiv").on("click", '[id="contextMenu5"]', function (e) {
            if (sview.IsUseModelContextMenu()) {

            }
            else if (option.usem2) {
                $(e.target).click(function () {
                    $("#aboutModal").modal('toggle');
                }());
            }
        });

        //点击加速计数，初始时0--1倍速，点击一次计数1--2倍速，再次点击计数2--4倍速，再次点击回到0--1倍速。
        var accelerate_count = 1;
        sviewFrameDiv.find(".rotation").click(function () {
            $("#context-menu").addClass('disabled');
            //if (accelerate_count == 0) {
            //    sview.SetRotateSpeed(1);
            //    sview.SetExplosiveStyleNoRestore(0);
            //    sview.StartRotateAndExplosive();
            //    $(this).find("#RAndEimage").attr("src", sviewBaseUrl + 'images/rotation-1.png');
            //    sviewFrameDiv.find(".pull-right").hide();
            //    accelerate_count++;
            //} else 
            if (accelerate_count == 1)
            {
                sview.SetRotateSpeed(2);
                sviewFrameDiv.find("#RAndEimage").attr("src", sviewBaseUrl + 'images/rotation-2.png');
                accelerate_count++;
            } else if (accelerate_count == 2) {
                sview.SetRotateSpeed(4);
                sviewFrameDiv.find("#RAndEimage").attr("src", sviewBaseUrl + 'images/rotation-4.png');
                accelerate_count++;
            } else if (accelerate_count == 3) {
                sview.EndRotateAndExplosive();
                //$(this).find("#RAndEimage").attr("src", sviewBaseUrl + 'images/beforerot.png');
                $(this).hide();
                sviewFrameDiv.find('#animation').removeClass('bg-yellow');
                sviewFrameDiv.find(".pull-right").show();
                //sviewFrameDiv.find("#bottomMenu").show();
                sviewFrameDiv.find('#bottomMenu').removeClass('hide');
                sviewFrameDiv.find('#mainMenu').addClass(BACKCOLOR[1]);
                accelerate_count = 1;
                RestoreView();
                
            }
        });
        //设置颜色
        sviewFrameDiv.find(".backcolor").click(function () {
            var name = $(this).find('img').attr('id');
            var colorb, colort;
            switch (name) {
                case 'white':
                    colort = new M3D.Color(1, 1, 1);
                    colorb = new M3D.Color(1, 1, 1);
                    break;
                case 'black':
                    colort = new M3D.Color(0, 0, 0);
                    colorb = new M3D.Color(0, 0, 0);
                    break;
                case '179.179.192':
                    colort = new M3D.Color(179 / 255.0, 179 / 255.0, 192 / 255.0);
                    colorb = new M3D.Color(179 / 255.0, 179 / 255.0, 192 / 255.0);
                    break;
                case '234.234.234':
                    colort = new M3D.Color(234 / 255.0, 234 / 255.0, 234 / 255.0);
                    colorb = new M3D.Color(234 / 255.0, 234 / 255.0, 234 / 255.0);
                    break;
                case '236-248-255':
                    colort = new M3D.Color(236 / 255.0, 248 / 255.0, 1);
                    colorb = new M3D.Color(236 / 255.0, 248 / 255.0, 1);
                    break;
                case '148.202.239-255.255.255':
                    colort = new M3D.Color(148 / 255.0, 202 / 255.0, 239 / 255.0);
                    colorb = new M3D.Color(1, 1, 1);
                    break;
                case '128.128.128-240.240.240':
                    colort = new M3D.Color(128 / 255.0, 128 / 255.0, 128 / 255.0);
                    colorb = new M3D.Color(240 / 255.0, 240 / 255.0, 240 / 255.0);
                    break;
                case '230.230.230-170.170.170':
                    colort = new M3D.Color(230 / 255.0, 230 / 255.0, 230 / 255.0);
                    colorb = new M3D.Color(170 / 255.0, 170 / 255.0, 170 / 255.0);
                    break;
                case 'defaultcolor':
                    colort = new M3D.Color(0.25, 0.63, 1.0);
                    colorb = new M3D.Color(0.88, 0.96, 1.0);
                    break;
            }
            sview.view.SetBackgroundColor(colort, colorb);
            M3D.CookieHelper.AddCookie(M3D.TOP_COLOR_KEY, colort.Tostring(), 30);
            M3D.CookieHelper.AddCookie(M3D.BOTTOCOLOR_KEY, colorb.Tostring(), 30);
        });
        //装配树相关
        sviewFrameDiv.find("#top_assembly").click(function () {
            
            $("#assebmlyTreeDiv").toggle();
            $("#top_viewDiv").hide();
        })
        //视图显示  
        //TODO  视图相关
        sviewFrameDiv.find("#top_view").click(function () {
            var viewTreeObj;
		    $("#assebmlyTreeDiv").hide();
		    $("#top_viewDiv").toggle();
		    //if ($("#top_view").hasClass(".bg-yellow")) {
		        $("#top_viewDiv").html('');
		        console.log(sview.view.GetModelViewsList());
		        var modleViewList = sview.view.GetModelViewsList();
		        var modle = sview.view.GetModel();
		        modle.SetModleViewList(modleViewList);
		        console.log(sview.view.GetModel());
		        var zTreeObj;
		        // zTree 的参数配置
		        var setting = {
		            view: {
		                showLine: false,
		                showIcon: false,
		                selectedMulti: false,
		                dblClickExpand: false,

		            },
		            data: {
		                simpleData: {
		                    enable: true
		                }
		            },
		            callback: {
		                onClick: view_tree_click,
                        
		            }
		        };
		    // zTree 的数据属性
		        $("#top_viewDiv").append('<div id="sview_view_panel"><div><button type="button"id="addModleView"></button><button type="button"id="removeModelView"></button></div><ul id="sview_view_tree" class="view_tree"></ul></div>')
		        SetViewTree(modleViewList);

		        function SetViewTree(modleViewList)
		        {
		            var tempNode = '';

		            var name;
		           
		            for (var i = 0; i < modleViewList.length; i++)
		            {
		                //$("#top_viewDiv").append('<li class="sview_view_li">' + modleViewList[i].GetName() + '</li>')
		                tempNode = tempNode + ('{name:"' + modleViewList[i].GetName() + '",view_id:' + modleViewList[i].GetID() + '},');
		            }
		            
		            var zNodes = eval('[' + tempNode + ']');
		            viewTreeObj = $.fn.zTree.init($("#sview_view_tree"), setting, zNodes);
		            
		        }
		        //$("#top_viewDiv").append('</ul></div>')
		        
		        function view_tree_click(event, treeId, treeNode)
		        {
		            sview.view.CloseSceneAnimation();
		            var modelView = sview.view.GetModel().GetModleView(treeNode.view_id);
		            //console.log(treeNode.view_id);
		            sview.view.SetCurrentModelView(modelView);
		            sview.view.ShowModelView(treeNode.view_id, true, true);
		            console.log($(this))
		        }
		        
		        $(function ()
		        {
		            //添加新的视图
		            $("#addModleView").click(function ()
		            {
		                sview.view.AddModelView();
		                //var viewlist = sview0.view.GetModelViewsList();
		                //var xmlstr = '<View ID="1009" Name="2017-04-14T03:58:22.950Z" Type="2"> <Camera Position="72.25002277974409 -451.2855894545355 -2404.4109991218506"  Rotation="0.13218648059498742 0.631926417765187 0.5384900752425895 -0.5415017781537695" ZoomFactor="1.4791979"  Orthographic="false"  NearClip="3.8443076150266617"  FarClip="40365.22995777995" FOV="90"/> <BackgroundColor/><Notes><GestureNote ID= "0" Created= "" UserID= "1" Layer= "0" > <ProjectMatrix/> <Polylines /> </GestureNote> </Notes>  <PMIs/>  <SectionPlanes/><Instances></Instances></View>';
		                //viewlist.push(sview0.CreatModleViewByXMlStr(xmlstr));
		                SetViewTree(sview.view.GetModelViewsList());
		                viewTreeObj.refresh();
		                console.log(viewTreeObj.getNodes())
		            });
                    //移除视图
		            $("#removeModelView").click(function () {
		                var treeObj = $.fn.zTree.getZTreeObj("sview_view_tree");
                        var selnodes = treeObj.getSelectedNodes();
                        if (selnodes.length<1) {
                            return;
                        }
		                var viewid = selnodes[0].view_id;
		                sview.view.RemoveModelView(viewid);
		               
		                SetViewTree(sview.view.GetModelViewsList());
		                viewTreeObj.refresh();
		                console.log(viewTreeObj.getNodes())
		            });
		            //获取视图列表
		            $("#updateView").click(function ()
		            {
		                //console.log(JSON.stringify(sview.view.GetModelViewsList()));
		                
		                console.log(sview.CreatModleViewByXMlStr(sview.GetXMLStrByMV(sview.view.GetModelViewsList()[3])))
		                //console.log(JSON.stringify( sview.view.GetModelViewsList()[0].GetInstanceAttributeMap()))
		            });
		            
		        })
		    //}
			
		});

    };

	function Get_Animation_Option(htmlElement){
		var value=M3D.CookieHelper.GetCookie('sview_'+htmlElement.substring(1));
		var tempobj=$(htmlElement);
		if(value!=undefined&&value!=''){

			if($(htmlElement)[0].childElementCount!=0){
				$(htmlElement).val(value);
			}else {
				$(htmlElement).attr("checked",value);
			}

		}else {
		    if ($(htmlElement)[0].childElementCount != 0) {
		        var tempStr =  htmlElement + ' option:selected';
				value=$(tempStr).val();
			}else {
				value=$(htmlElement).is(":checked");
			}
		    var temp = $(htmlelement).find("option:selected");
		    M3D.CookieHelper.AddCookie('sview_' + htmlElement.substring(1), value, 30);
		}
		if (value == 'true') {
		    value = true;
		}
		if (value == 'false') {
		    value = false;
		}
		return value;

	}

    //动态创建提示窗口
    function CreateInfoWindow(e, title, info) {
	    $("#infoModal").remove();
        var str = [
            ' <div class="modal fade" id="infoModal" role="dialog" aria-hidden="true">',
            '<div class="modal-dialog">',
            '<div class="modal-content">',
            '<div class="modal-header modal-header-about">',
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">',
            '&times;',
            '</button>',
            '<h4 class="modal-title" id="myModalLabel" align="center">',
            title,
            '</h4>',
            '</div>',
            "<div class='modal-body' align='center' style='background-color: #f9f9f9;'>",
            info,
            '</div>',
            '<div class="modal-footer modal-footer-about">',
            "<div class='center-block'>",
            " <button id='closeInfoModal' type='button' class='btn btn-default' data-dismiss='modal'>" + getLocalizedString(language, "common", "close") + "</button>",
            '</div>',
            '</div>',
            '</div>',
            '</div>',
            '</div>'].join("\n");
        sviewFrameDiv.append(str);

        $("#infoModal").modal("show");
        

        $("#closeInfoModal").click(function () {
            document.getElementById('settingModal').style.overflowY = 'auto';
        }());

    }
    $("#languageSet").on('change', function (e) {
        languageSet(e);
    });
    function languageSet(e) {
        var selectedNum = document.getElementById('languageSet').selectedIndex;
        if (selectedNum == 0) {
            //无
            M3D.CookieHelper.DeleteCookie('languageType');
            M3D.CookieHelper.AddCookie('languageType', 'cn', '30');
        } else if (selectedNum == 1) {
            //毫米
            M3D.CookieHelper.DeleteCookie('languageType');
            M3D.CookieHelper.AddCookie('languageType', 'en', '30');
        }
        CreateInfoWindow(e, getLocalizedString(language, "Alert", "Alert_Prompt"), getLocalizedString(language, "Alert", "Alert_Reload"));
    };
    //合并面开关
    $("#mergefaceswitch").on('click', function (e) {
        clickMergeSwitchClick(e);
    });

    function clickMergeSwitchClick(e) {
        var opens = true;
        if ($("#mergefaceswitch").is(':checked')) {
            M3D.CookieHelper.DeleteCookie('mergeface');
            M3D.CookieHelper.AddCookie('mergeface', '1', '30');
            opens = true;
        } else {
            M3D.CookieHelper.DeleteCookie('mergeface');
            M3D.CookieHelper.AddCookie('mergeface', '0', '30');
            opens = false;
        }
        //sview.view.SetMergeFace(opens);
        CreateInfoWindow(e, getLocalizedString(language, "Alert", "Alert_Prompt"), opens ? getLocalizedString(language, "Alert", "Alert_OpenMergeFace") : getLocalizedString(language, "Alert", "Alert_CloseMergeFace"));
    };
    function showFPS() {
        //fps.value = "FPS:" + sview.GetFPS();
    }
    //装配树
    var expand = false;
    function expandAll() {
        var treeObj = $.fn.zTree.getZTreeObj(assemblyTreeId);
        expand = treeObj.expandAll(!expand);
    }
    var setting = {
        checked: true,
        check: {
            enable: true,
            chkboxType: { "Y": "s", "N": "s" }
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: onClick,
            onCheck: onCheck,
            onRightClick: onRightClick,
            beforeRename: beforeRename,
            onRename: onRename,
            beforeRemove: beforeRemove,
            onRemove: onRemove
        }
    };
    //选中复选框事件
    function onCheck(event, treeId, treeNode, clickFlag) {
        var shape = sview.GetShpae(treeNode.id);
        if (shape != null) {
            shape.SetVisible(treeNode.checked);
        }
    }
    //点击节点事件
    function onClick(event, treeId, treeNode, clickFlag) {
        sview.view.GetSelector().Clear();
        var shape = sview.GetShpae(treeNode.id);
        if (shape != null) {
            sview.view.GetSelector().Add(shape);
        }
    }
    //zTree右键点击事件
    function onRightClick(event, treeId, treeNode) {
        var treeObj = $.fn.zTree.getZTreeObj(assemblyTreeId);
        treeObj.cancelSelectedNode();//取消之前选中
        treeObj.selectNode(treeNode);//选中当前
        sview.view.GetSelector().Clear();
        var shape = sview.GetShpae(treeNode.id);
        if (shape != null) {
            sview.view.GetSelector().Add(shape);
        }
        showRMenu(event.clientX, event.clientY);
    }
    //重命名之前的操作，用于验证新名字是否符合规则
    function beforeRename(treeId, treeNode, newName) {
        //alert(newName);
        var flag = false;
        if (newName.length > 0) {
            flag = true;
        }
        return flag;
    }
    //重命名操作
    function onRename(event, treeId, treeNode, isCancel) {
        var shape = sview.GetShpae(treeNode.id);
        sview.AssemblyRename(shape, treeNode.name);
    }
    //删除之前的操作
    function beforeRemove(treeId, treeNode) {
        var flag = false;
        var shape = sview.GetShpae(treeNode.id);
        var topModel = sview.view.GetSceneManager().GetModel();
        var con = confirm(getLocalizedString(language, "Assembly", "ConfirmDelete") + "\"" + treeNode.name + "\"?");
        if (con) {
            if (shape.GetID() != topModel.GetID()) {
                flag = true;
            } else {
                //alert(getLocalizedString(language, "Assembly", "TopNote_CannotDel"));
                CreateInfoWindow(null, getLocalizedString(language, "Alert", "Alert_Prompt"), getLocalizedString(language, "Assembly", "TopNote_CannotDel"));
            }
        }
        return flag;
    }
    //删除操作
    function onRemove(event, treeId, treeNode) {
        var shape = sview.GetShpae(treeNode.id);
        if (shape !== null){
            sview.AssemblyDelete(shape);
        }
    }
    //禁止右键弹出网页默认菜单
    $(document).bind("contextmenu", function (e) {
        return false;
    });
    //显示右键菜单 
    function showRMenu(x, y) {
        var asswidth = $('#assebmlyTreeDiv').width()
        x = Number(x) + Number(7);
        if (x + 42 >asswidth){
            x = asswidth - 42;
        }
        $("#rMenu ul").show();
        $("#rMenu").css({ "top": y + "px", "left": x + "px", "display": "block" });
    }
    //隐藏右键菜单  
    function hideRMenu() {
        $("#rMenu").hide();
    }
    //鼠标点击事件不在节点上时隐藏右键菜单
    $("body").bind(
		"mousedown",
		function (event) {
		    if (!(event.target.id == "rMenu" || $(event.target)
					.parents("#rMenu").length > 0)) {
		        $("#rMenu").hide();
		    }
		});
    //添加装配
    var isOver = true;
    var asmFileInput = null;
    asmFileInput = document.createElement("input");
    asmFileInput.type = 'file';
    asmFileInput.id = "addAssemblyFile";
    asmFileInput.accept = '.zip, .svp, .svlx, .zsvl';
    asmFileInput.multiple = false;
    asmFileInput.addEventListener('change', function () {
        if (asmFileInput.files.length < 1) {
            return;
        }
        var type = asmFileInput.files[0].name.split(".").pop().toLowerCase();
        if (type == "zsvl" || type == "svlx" || type == "svp" || type == "zip") {
            event.preventDefault();
            event.stopPropagation();
            isAssemlyOpen = true;
            isOver = false;
            var readState = sview.AssemblyAdd(asmFileInput.files);
            if (readState !== "OK") {
                //alert(getLocalizedString(language, "OpenErorr", "SelectBin"));
                CreateInfoWindow(null, getLocalizedString(language, "Alert", "Alert_Prompt"), getLocalizedString(language, "OpenErorr", "SelectBin"));
                asmFileInput.value = '';
            }
        } else {
            //alert(getLocalizedString(language, "Assembly", "Assembly_add_file_error"));
            CreateInfoWindow(null, getLocalizedString(language, "Alert", "Alert_Prompt"), getLocalizedString(language, "Assembly", "Assembly_add_file_error"));
            asmFileInput.value = '';
        }
    });
    function addAsemble() {
        $("#rMenu").hide();
        if (!isOver) {
            //alert(getLocalizedString(language, "Assembly", "Assembly_Wait"));
            CreateInfoWindow(null, getLocalizedString(language, "Alert", "Alert_Prompt"),
                getLocalizedString(language, "Assembly", "Assembly_Wait"));
            return;
        }
        var treeObj = $.fn.zTree.getZTreeObj(assemblyTreeId);
        var selectedNoedes = treeObj.getSelectedNodes();
        var shape = sview.GetShpae(selectedNoedes[0].id);
        if (shape.GetSubModelCount() == 0) {
            //alert(getLocalizedString(language, "Assembly", "SelectAssembly"));
            CreateInfoWindow(null, getLocalizedString(language, "Alert", "Alert_Prompt"),
               getLocalizedString(language, "Assembly", "SelectAssembly"));
            return;
        }
        asmFileInput.click();
    }
    var isAssemlyOpen;
    //添加装配，供底层执行完添加装配函数后调用此函数来更新装配树
    function updateAssemblyTree(srcModel) {
        var treeObj = $.fn.zTree.getZTreeObj(assemblyTreeId);
        var selectedNoedes = treeObj.getSelectedNodes();
        var modeljson = new SView.JSONAssembly(srcModel);
        treeObj.addNodes(selectedNoedes[0], modeljson);
        asmFileInput.value = '';
       
    }
    function addAssemblyOver() {
        isOver = true;
    }
    function MeasureError() {
        alert("测量对象无效");
    }
    function PorpertyMeasureCallBack(propertyString) {
        $("#measurePorpertyList").show();
        if (!(propertyString.length > 0)) {
            return;
        }
        let propertyArray = propertyString.split(';;');
        let array = [];
        let temp = '';
        let titleStr = "";
        for (let i = 0; i < propertyArray.length; i++) {
            let propertyStr = propertyArray[i];
            let propertyStrArr = propertyStr.split('::');
            if (propertyStrArr[0].toLowerCase() === "id") {
                titleStr = ("<li><p>" + propertyStrArr[0] + "：" + propertyStrArr[1] + "</p></li>");
            } else {
                temp += ("<li><p>" + propertyStrArr[0] + "：" + propertyStrArr[1] + "</p></li>");
            }
        }
        titleStr = "<ul>" + titleStr + temp + "</ul>";
        $("#measurePorpertyList").html(titleStr);
        $('#measurePorpertyList').css({ position: "absolute", 'top': 10, 'left': 10, 'height': 300,'width': 250,'z-index': 2 });
    }
    function openModelsEnd(topModel) {
        InitTree(topModel);
        RestoreView();
    }

    function showRightMenuInIos(event) {
        sviewFrameDiv.children("#renderCanvas").showContextMenu(event);
        //alert("asdasd");
    } 
    function CloseRightMenuInIos(event) {
        sviewFrameDiv.children("#renderCanvas").CloseContextMenu();
        //alert("asdasd");
    }
    function DoubleTouchListener(shape) {

    }
    //热点描述显示隐藏监听
    function SHotSpotDescribeListener(describeStr) {
        if (describeStr != null && describeStr != undefined && describeStr != "") {
            setStepInfo(describeStr,"","");
            sview_anima_step_panel_lite.show();
        } else {
            if ( !sview_anima_step_toggle_btn.is(':visible')) {
                sview_anima_step_panel_lite.hide();
            }
        }
    }
    function getFocus() {
        $("#textNote_input").focus();
    }
    function inputTextNote(func) {
        var isConfirmTextNote = false;
        var isCreate = false;
        $("#inputTextNote").modal('show');
        setTimeout(getFocus, 200);
        sviewFrameDiv.find("#confirmTextNote").on('click', function (event) {
		    isConfirmTextNote = true;
		    if (isCreate == false){
		        func($("#textNote_input").val(), true);
		        isCreate = true;
		    }
		    $("#textNote_input").val(getLocalizedString(language, "TextNote", "InputTextNoteContent"));
            var obj = document.getElementById("textNote_input");
            obj.style.color = "gray";
		});
		
        sviewFrameDiv.find("#cancleTextNote").on('click', function (event) {
		    func($("#textNote_input").val(), false);
		});
        $("#inputTextNote").one('show.bs.modal', function () {
            if (isConfirmTextNote != true) {
                func($("#textNote_input").val(), false);
            }
            sviewFrameDiv.find("#confirmTextNote").unbind('click');
            sviewFrameDiv.find("#cancleTextNote").unbind('click');
        });
        
		$("#inputTextNote").one('hide.bs.modal', function () {
		    if (isConfirmTextNote != true) {
		        func($("#textNote_input").val(), false);
		    }
		});
    }
    //删除装配
    function delAsemble() {
        $("#rMenu").hide();
        var treeObj = $.fn.zTree.getZTreeObj(assemblyTreeId);
        var selectedNoedes = treeObj.getSelectedNodes();
        treeObj.removeNode(selectedNoedes[0], true);
    }
    var ztreeConfig = {
        isCopy: false,
        isCut: false,
        node: ""
    }
    //复制
    function copyAsemble() {
        $("#rMenu").hide();
        var treeObj = $.fn.zTree.getZTreeObj(assemblyTreeId);
        var selectedNoedes = treeObj.getSelectedNodes();
        var shape = sview.GetShpae(selectedNoedes[0].id);
        var topModel = sview.view.GetSceneManager().GetModel();
        if (shape.GetID() == topModel.GetID()) {
            CreateInfoWindow(null, getLocalizedString(language, "Alert", "Alert_Prompt"),
              getLocalizedString(language, "Assembly", "TopAssemblyCannotCopy"));
            //alert(getLocalizedString(language, "Assembly", "TopAssemblyCannotCopy"));
            return;
        }
        ztreeConfig.isCopy = true;
        ztreeConfig.isCut = false;
        ztreeConfig.node = selectedNoedes[0];
    }
    //剪切
    function cutAsemble() {
        $("#rMenu").hide();
        var treeObj = $.fn.zTree.getZTreeObj(assemblyTreeId);
        var selectedNoedes = treeObj.getSelectedNodes();
        var shape = sview.GetShpae(selectedNoedes[0].id);
        var topModel = sview.view.GetSceneManager().GetModel();
        if (shape.GetID() == topModel.GetID()) {
            CreateInfoWindow(null, getLocalizedString(language, "Alert", "Alert_Prompt"),
                getLocalizedString(language, "Assembly", "TopAssemblyCannotCut"));
            //alert(getLocalizedString(language, "Assembly", "TopAssemblyCannotCut"));
            return;
        }
        ztreeConfig.isCopy = false;
        ztreeConfig.isCut = true;
        ztreeConfig.node = selectedNoedes[0];
    }
    //粘贴
    function pasteAsemble() {
        $("#rMenu").hide();
        //如果没有复制/剪切，则返回
        if (!ztreeConfig.isCopy && !ztreeConfig.isCut) {
            CreateInfoWindow(null, getLocalizedString(language, "Alert", "Alert_Prompt"),
              getLocalizedString(language, "Assembly", "CopyCutFirst"));
            //alert(getLocalizedString(language, "Assembly", "CopyCutFirst"));
            return;
        }
        var treeObj = $.fn.zTree.getZTreeObj(assemblyTreeId);
        var selectedNoedes = treeObj.getSelectedNodes();
        //原模型
        var shape = sview.GetShpae(ztreeConfig.node.id);
        //目标模型
        var targetShape = sview.GetShpae(selectedNoedes[0].id);
        //如果目标模型不是装配，则返回
        if (targetShape.GetSubModelCount() == 0) {
            CreateInfoWindow(null, getLocalizedString(language, "Alert", "Alert_Prompt"),
             getLocalizedString(language, "Assembly", "SelectAssembly"));
            //alert(getLocalizedString(language, "Assembly", "SelectAssembly"));
            return;
        }
        //如果选择的是同一个模型则返回
        if (shape.GetID() == targetShape.GetID()) {
            CreateInfoWindow(null, getLocalizedString(language, "Alert", "Alert_Prompt"),
             getLocalizedString(language, "Assembly", "CelectOtherAssembly"));
            //alert(getLocalizedString(language, "Assembly", "CelectOtherAssembly"));
            return;
        }
        //如果原模型包含目标模型则返回
        if (isChildModel(shape, targetShape, isChild)) {
            CreateInfoWindow(null, getLocalizedString(language, "Alert", "Alert_Prompt"),
             getLocalizedString(language, "Assembly", "CelectOtherAssembly"));
            //alert(getLocalizedString(language, "Assembly", "CelectOtherAssembly"));
            return;
        }
        //复制
        if (ztreeConfig.isCopy) {
            var outShape = null;
            sview.AssemblyCopyTo(shape, targetShape, outShape);
            //ztreeConfig.isCopy = false;
            //ztreeConfig.node = "";
        }
        //剪切
        if (ztreeConfig.isCut) {
            sview.AssemblyMoveTo(shape, targetShape);
            var modeljson = new SView.JSONAssembly(shape);
            treeObj.addNodes(selectedNoedes[0], modeljson);
            treeObj.removeNode(ztreeConfig.node, false);
            ztreeConfig.isCut = false;
            ztreeConfig.node = "";
        }

    }
    //重命名
    function renameAsemble() {
        $("#rMenu").hide();
        var treeObj = $.fn.zTree.getZTreeObj(assemblyTreeId);
        var selectedNoedes = treeObj.getSelectedNodes();
        treeObj.editName(selectedNoedes[0]);
    }
    //粘贴时判断目标模型是否是原始模型的子模型
    var isChild = false;
    function isChildModel(shape, targetShape, isChild) {
        for (var index = 0; index < shape.GetSubModels().length; index++) {
            if (targetShape.GetID() == shape.GetSubModels()[index].GetID()) {
                isChild = true;
            } else {
                if (shape.GetSubModels()[index].GetSubModelCount() == 0) {
                    if (targetShape.GetID() == shape.GetSubModels()[index].GetID()) {
                        isChild = true;
                    }
                } else {
                    isChildModel(shape.GetSubModels()[index], targetShape, isChild);
                }
            }
        }
        return isChild;
    }
    function AnimationStart() {

        sview.AnimationOpenFile();
        sview.AnimationPlay();
        //    sview.AnimationStart();
    }
    function AnimationStop() {
        sview.exitAnimation();
    }

    function SetAnimationStatus() {

        if (option.animationStatus) {
            $(".ani-pause").html("<img src='" + sviewBaseUrl + "images/button_ani.png' alt='开始' title='" + getLocalizedString(language, "AnimationMenuTitle", "start") + "'>");
            option.animationStatus = false;
        }
        else {
            $(".ani-pause").html("<img src='" + sviewBaseUrl + "images/button_pause.png' alt='暂停' title='" + getLocalizedString(language, "AnimationMenuTitle", "pause") + "'>");
            option.animationStatus = true;
        }

    }
    function InitTree(topModel) {
        //这里给顶级装配设置一个名称，原来的是undefined 
        if (topModel.GetName() === undefined) {
            topModel.SetName(sview.GetCurFileName());
        }
        var modeljson = new SView.JSONAssembly(topModel);
        //console.log(modeljson);
        var jsonstring = JSON.stringify(modeljson);

        var zNodes = eval('(' + jsonstring + ')');
        //动态插入一个tree 防止id重复的问题
        sviewFrameDiv.find("#assebmlyTreeDiv").html("<ul id=" + "'" + assemblyTreeId + "'" + "class='ztree' style='margin:0px;padding:0px'></ul>");

        $.fn.zTree.init($("#" + assemblyTreeId), setting, zNodes);

        var selectorListener = new SView.SViewSelctorListener();
        
        selectorListener.onSelected = function (selector, model) {
            var treeObj = $.fn.zTree.getZTreeObj(assemblyTreeId);
            //以下注释代码 可实现 装配树中选中模型 自动居中
            //var models = [];
            //models.push(model);
            //sview.FoucusViewByModel(models, true);
            var node = treeObj.getNodeByParam("id", model.GetID());
            treeObj.selectNode(node, false);
            //if (window.hasOwnProperty("PointerEvent"))
            //{
            //    document.onpointerup = showaxi;
            //} else
            //{
               // document.onmouseup = showaxi;
            //}

            
                console.log(model.Name);
            /**
            *点击显示人物属性
            */
            function showaxi(e)
            {
                //$("#testPro").css("display","none");
                //e = e || window.event;
                //console.log(e.x+"y:"+e.y);
                //switch (model.Name)
                //{
                //    case "TWIN-redmatress_Double":
                //        $("#testPro").show();
                //        $("#testPro").css({"z-index":"200","left":e.x+"px","top":e.y+"px","position":"absolute"});
                //        $("#info_detail").html("<table  class='table table-striped'><tr><td>姓名:</td><td>李林</td></tr><tr><td>资质:</td><td>中级</td></tr><tr><td>年限:</td><td>3年</td></tr><tr><td>成绩:</td><td>80</td></tr><tr><td>上岗时间:</td><td>8:32</td></tr></table>");
                //        //console.log(model.GetSceneNode().GetParent().GetWorldBoundingBox().max.Tostring())
                //        console.log(M3D.ModelTransformHelper.GetModelNode(model).GetWorldBoundingBox().max.Tostring())
                //        console.log('x是'+sview0.view.GetSceneManager().GetCamera().WorldToScreenPoint(M3D.ModelTransformHelper.GetModelNode(model).GetWorldBoundingBox().max).x)
                //        var x = sview0.view.GetSceneManager().GetCamera().WorldToScreenPoint(M3D.ModelTransformHelper.GetModelNode(model).GetWorldBoundingBox().max).x;

                //        console.log((x + 1) * document.body.clientWidth / 2)
                //        console.log(document.body.clientWidth)
                //        console.log(window.screenWidth);
                //        console.log(document.body.scrollWidth);
                //        break;
                //    case "Blue-pillows":
                //        $("#testPro").show();
                //        $("#testPro").css({ "z-index": "200", "left": e.x + "px", "top": e.y + "px", "position": "absolute" });
                //        $("#info_detail").html("<table  class='table table-striped'><tr><td>姓名:</td><td>赵四</td></tr><tr><td>资质:</td><td>初级</td></tr><tr><td>年限:</td><td>5年</td></tr><tr><td>成绩:</td><td>90</td></tr><tr><td>上岗时间:</td><td>18:32</td></tr></table>");
                //        //console.log(model.GetSceneNode().GetParent().GetWorldBoundingBox().max.Tostring())
                //        //console.log(model.GetSceneNode().GetParent().GetWorldBoundingBox().min.Tostring())
                //        console.log(M3D.ModelTransformHelper.GetModelNode(model).GetWorldBoundingBox().max.Tostring())
                //        var y = sview0.view.GetSceneManager().GetCamera().WorldToScreenPoint(M3D.ModelTransformHelper.GetModelNode(model).GetWorldBoundingBox().max).y;
                //        var x = sview0.view.GetSceneManager().GetCamera().WorldToScreenPoint(M3D.ModelTransformHelper.GetModelNode(model).GetWorldBoundingBox().max).x;
                //        console.log("xxxx" + x + "yyyy" + y+"clienty"+e.y);
                //        console.log("x是" + (x) * document.body.clientWidth + "y" + (y+1) * document.body.scrollHeight / 2);
                //        console.log("document.body.clientHeight" + document.body.scrollHeight)
                //        break;
                //    default:
                //        $("#testPro").css("display", "none");
                //}
            }

            
            
        };
        selectorListener.onClearSelected = function (selector)
        {
            $("#testPro").css("display", "none");
            var treeObj = $.fn.zTree.getZTreeObj(assemblyTreeId);
            var selectedNoedes = treeObj.getSelectedNodes();
            for (var ndIndex = 0; ndIndex < selectedNoedes.length; ndIndex++) {
                if (!isAssemlyOpen){
                    treeObj.cancelSelectedNode(selectedNoedes[ndIndex]);
                }
            }
        };
        selectorListener.onUnSelected = function (selector, model)
        {
            $("#testPro").css("display", "none");
            var treeObj = $.fn.zTree.getZTreeObj(assemblyTreeId);
            treeObj.selectNode(null, false);
           
        };

        sview.AddSelectListener(selectorListener);
    }

    function InitAnimaStepTree(stepTreeNodes) {
        var zTreeObj;
        var onClick = onClick1;
        // zTree 的参数配置
        var setting = {
            view: {
                showLine: false,
                showIcon: false,
                selectedMulti: false,
                dblClickExpand: true,

            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                beforeClick:anzTreeBeforeClick,
                onClick: onClick1
            }
        };
        //console.log(stepTreeNodes);
        var zNodes = eval('[' + stepTreeNodes + ']');
        zTreeObj = $.fn.zTree.init($("#stepPanelTree"), setting, zNodes);

        var nodes = zTreeObj.getNodes();
        if (nodes.length > 0) {
            zTreeObj.selectNode(nodes[0].children[0]);
            //console.log(nodes[0].children[0]);
            setStepInfo(nodes[0].name, nodes[0].children[0].name, nodes[0].children[0].step_info);
            //zTreeObj.setChkDisabled(nodes[0], true);
            //for (let i = 0; i < nodes.length; i++) {
            //    zTreeObj.setChkDisabled(nodes[i],true);
            //}
        }
        var old_stepId, old_processId;
        AnimationPlayListener.selectStep = function (stepId, processId) {
            if (old_stepId == stepId && old_processId == processId) {
                return;
            }
            old_processId = processId;
            old_stepId = stepId;
            var treeObj = $.fn.zTree.getZTreeObj("stepPanelTree");

            var node = treeObj.getNodeByParam("id", "stepId_" + stepId, treeObj.getNodeByParam("id", "processId_" + processId));
            treeObj.selectNode(node);
            setStepInfo(node.getParentNode().name, node.name, node.step_info);
        }
    }
    function anzTreeBeforeClick(treeId,treeNode,clickFlag) {
        if (treeNode.getParentNode() != null) {
            return true;
        } else {
            return false;
        }
    }
    function onClick1(event, treeId, treeNode) {
        //if (treeNode.getParentNode() != null) {
        //    setStepInfo(treeNode.getParentNode().name, treeNode.name);
        //    $(".ani-pause").html("<img src='" + sviewBaseUrl + "images/button_pause.png' alt='暂停' title='" + getLocalizedString(language, "AnimationMenuTitle", "pause") + "'>");
        //    option.animationStatus = true;
        //    PlayStepAnim(treeNode.steps_id);
        //} else {//如果选中的是过程节点
        //    setStepInfo(treeNode.name, "请选择该过程下的具体步骤进行动画浏览","");
        //}
        $(".ani-pause").html("<img src='" + sviewBaseUrl + "images/button_pause.png' alt='暂停' title='" + getLocalizedString(language, "AnimationMenuTitle", "pause") + "'>");
        option.animationStatus = true;
        PlayStepAnim(treeNode.steps_id);

    }
    function PlayStepAnim(index) {
        sview.animationPlayer.Play(index);
    }


    var AnimationPlayListener = function () {
        this.selectStep = function () {

        }
    }


    function SetReadListener() {
        var loadingCount = 0;//下载的进度，默认占百分比为0
        var pfun = null;

        var windowobj = $(window);
        var canvars;
        var sviewFrameDiv = $('#' + htmlelement);
        //初始化viewer
        canvars = sviewFrameDiv.children("#renderCanvas")[0];
        var myProgress = sviewFrameDiv.children("#myProgress");
        var myBar = sviewFrameDiv.find("#myBar");
        var lable = sviewFrameDiv.find("#label");
        var sdivdom = $('#' + htmlelement)[0];
        var browserWidth = sviewFrameDiv.width() - canvars.offsetLeft; //浏览器的宽
        var browserHieght = sviewFrameDiv.height() - canvars.offsetTop; //浏览器的高
        var barWidth = browserWidth / 4;
        var barHeight = browserHieght / 20;
        var barLeft = canvars.offsetLeft + (browserWidth - barWidth) / 2;
        var barTop = canvars.offsetTop + (browserHieght - barHeight) / 2;
        myProgress.css("position", "absolute").css("left", barLeft + "px").css("top", barTop + "px").css("width", barWidth + "px").css("height", barHeight + "px");
        myBar.css("position", "absolute").css("width", barWidth + "px").css("height", barHeight + "px");
        lable.css("position", "absolute").css("line-height", barHeight + "px").css("width", barWidth + "px").css("height", barHeight + "px");

        var aboutDlgW = browserWidth / 4;
        var aboutDlgH = browserHieght / 8;
        var aboutLeft = canvars.offsetLeft + (browserWidth - aboutDlgW) / 2;
        var aboutTop = canvars.offsetTop + (browserHieght - aboutDlgH) / 2;
        //        $('.modal-dialog').css("position", "absolute").css("left", aboutLeft + "px").css("top", aboutTop + "px").css("width", aboutDlgW + "px").css("height", aboutDlgH + "px");
        myProgress.hide();
        var linstener = new SView.SViewReadListener();
        linstener.onReadBegin = function (reader) {

            myProgress.show();

            if (reader instanceof M3D.LoadingEvent) {
                myBar.css("width", "0%");
                loadingCount = 0;
            }
            else {
                myBar.css("width", "0%");
            }
        };
        linstener.onReading = function (reader) {
            myProgress.show();
            onReading(reader);
        };
        linstener.onReadEnd = function (reader) {
            myBar.css("width", "100%");
            myProgress.hide();
            topModle = reader.GetModel();
            
            if (topModle.GetName() == undefined || topModle.GetName() == "undefined") {
                topModle.SetName(reader.fileName == undefined ? reader.currentFilesName : reader.fileName);
            }
            
            if (!isAssemlyOpen) {
                InitTree(reader.GetModel());
            } else {
                fileInput.value = '';
            }
            //var node = treeObj.getNodeByParam("id", model.GetID());
           //var y = sview0.view.GetSceneManager().GetCamera().WorldToScreenPoint(M3D.ModelTransformHelper.GetModelNode(model).GetWorldBoundingBox().max).y;
           // var x = sview0.view.GetSceneManager().GetCamera().WorldToScreenPoint(M3D.ModelTransformHelper.GetModelNode(model).GetWorldBoundingBox().max).x;
           // console.log("xxxx" + x + "yyyy" + y );
            RestoreView();
            isAssemlyOpen = false;
            ////获取相符合的列表名称
            //var names = ["HexBoltAssembly-1", "TWIN-redmatress_Double", "HexBoltAssembly-1", "FrontGardRail-1"];
            //var fitArra = [];
            //for (var name in names)
            //{
            //    for (var submodel in topModle.GetSubModels())
            //    {
            //        if (topModle.GetSubModels()[submodel].GetName() == names[name])
            //        {
            //            fitArra.push(topModle.GetSubModels()[submodel]);
            //        }
            //    }
                
            //}
            //console.log(fitArra);
            //for (var i in fitArra)
            //{
            //    var model = fitArra[i];
            //    var y = sview0.view.GetSceneManager().GetCamera().WorldToScreenPoint(M3D.ModelTransformHelper.GetModelNode(model).GetWorldBoundingBox().max).y;
            //    var x = sview0.view.GetSceneManager().GetCamera().WorldToScreenPoint(M3D.ModelTransformHelper.GetModelNode(model).GetWorldBoundingBox().max).x;
            //    console.log("xxxx" + x + "yyyy" + y);
            //    $("#testPro").show();
            //    $("#testPro").css({ "z-index": "200", "left": x + "px", "top": y + "px", "position": "absolute" });
            //    $("#info_detail").html("<table  class='table table-striped'><tr><td>姓名:</td><td>赵四</td></tr><tr><td>资质:</td><td>初级</td></tr><tr><td>年限:</td><td>5年</td></tr><tr><td>成绩:</td><td>90</td></tr><tr><td>上岗时间:</td><td>18:32</td></tr></table>");
            //}
           
        };


        function onReading(reader) {
            if (reader instanceof M3D.LoadingEvent) {
                //下载默认给予了50%的进度条
                var loadingpercent = reader.percent;
                loadingCount = loadingpercent * 50;
                var str = Math.floor(loadingCount) + "%";
                myBar.css("width", str);
                str = getLocalizedString(language, "Prompt", "Downloading") + reader.fileName + str;
                lable.text(str);
            }
            else {
                var str;
                var percentage = reader.GetReadPercent();
                str = Math.floor(loadingCount + percentage * (100 - loadingCount)) + "%";
                myBar.css("width", str);//设置进度
                str = getLocalizedString(language, "Prompt", "isOpening")+ "   " + reader.currentFilesName + str;//设置显示文本
                lable.text(str);
            }
        };

        sview.AddReadListener(linstener);
    };
    ////为了支持ios safari中长按触发
    //longPress = function () {
    //    timeOutEvent = 0;
    //    ContextMenu();
    //    alert('sas');
    //}
    //右键菜单

    function ContextMenu() {
        var sviewFrameDiv = $('#' + htmlelement);
        sviewFrameDiv.children("#renderCanvas").contextmenu({
            target: '#context-menu',
            before: function (e) {
                if (!sview.singleClickFlag) {
                    return false;
                }
                //如果右侧菜单没有的话 就说明在开启旋转命令，那么就禁止右键菜单
                if ($(".rightbar").css('display') === 'none' || !$("#measure_bar").hasClass('hide') || !$("#note_bar").hasClass('hide')) {
                    e.preventDefault();
                    return false;
                } else {
                    sview.isShowRightMenu(true);
                    var temp = this.getMenu();
                    var tempDrop = $(temp).find(".dropdown-menu");
                    tempDrop.html("");
                    if (sview.IsUseModelContextMenu()) {
                        tempDrop.append("<li><a tabindex='0' style='font-weight:bold' langID='RightMenu.RightMenu_Hide'><span>&nbsp&nbsp</span>" + getLocalizedString(language, "RightMenu", "RightMenu_Hide") + "</a></li>");
                        tempDrop.append("<li><a tabindex='1' style='font-weight:bold' langID='RightMenu.RightMenu_Single_display'><span>&nbsp&nbsp</span>" + getLocalizedString(language, "RightMenu", "RightMenu_Single_display") + "</a></li>");
                        tempDrop.append("<li><a tabindex='7' style='font-weight:bold' langID='RightMenu.RightMenu_SetColor'><span>&nbsp&nbsp</span>" + getLocalizedString(language, "RightMenu", "RightMenu_SetColor") + "</a></li>");
                        tempDrop.append("<li><a tabindex='8' style='font-weight:bold' langID='RightMenu.RightMenu_ResetSelect'><span>&nbsp&nbsp</span>" + getLocalizedString(language, "RightMenu", "RightMenu_ResetSelect") + "</a></li>");
                        tempDrop.append(" <li role='separator' class='divider'></li>");
                        tempDrop.append("<li><a tabindex='2' style='font-weight:bold' langID='RightMenu.RightMenu_Centered_display'><span>&nbsp&nbsp</span>" + getLocalizedString(language, "RightMenu", "RightMenu_Centered_display") + "</a></li>");
                        tempDrop.append(" <li role='separator' class='divider'></li>");
                        tempDrop.append("<li><a tabindex='4' style='font-weight:bold' langID='RightMenu.RightMenu_About'><span>&nbsp&nbsp</span>" + getLocalizedString(language, "RightMenu", "RightMenu_About") + "</a></li>");
                    }
                    else {
                        tempDrop.append("<li><a tabindex='0' style='font-weight:bold' langID='RightMenu.RightMenu_Explicit_exchange'><span>&nbsp&nbsp</span>" + getLocalizedString(language, "RightMenu", "RightMenu_Explicit_exchange") + "</a></li>");
                        tempDrop.append("<li><a tabindex='1' style='font-weight:bold' langID='RightMenu.RightMenu_Show_all'><span>&nbsp&nbsp</span>" + getLocalizedString(language, "RightMenu", "RightMenu_Show_all") + "</a></li>");
                        tempDrop.append(" <li role='separator' class='divider'></li>");
                        if (sviewFrameDiv.find('#note_bar').hasClass('hide') && sviewFrameDiv.find('#measure_bar').hasClass('hide') && sviewFrameDiv.find('#section_bar').hasClass('hide') && sviewFrameDiv.find('#explose_bar').hasClass('hide')) {
                            tempDrop.append("<li><a tabindex='2' style='font-weight:bold' langID='RightMenu.RightMenu_Move'><span>&nbsp&nbsp</span>" + getLocalizedString(language, "RightMenu", "RightMenu_Move") + "</a></li>");
                            tempDrop.append(" <li role='separator' class='divider'></li>");
                        }
                        tempDrop.append("<li><a tabindex='3' style='font-weight:bold' langID='RightMenu.RightMenu_Centered_display'><span>&nbsp&nbsp</span>" + getLocalizedString(language, "RightMenu", "RightMenu_Centered_display") + "</a></li>");
                        tempDrop.append(" <li role='separator' class='divider'></li>");
                        tempDrop.append("<li><a tabindex='8' style='font-weight:bold' langID='RightMenu.RightMenu_Setting'><span>&nbsp&nbsp</span>" + getLocalizedString(language, "RightMenu", "RightMenu_Setting") + "</a></li>");
                        tempDrop.append(" <li role='separator' class='divider'></li>");
                        tempDrop.append("<li><a tabindex='5' style='font-weight:bold' langID='RightMenu.RightMenu_About'><span>&nbsp&nbsp</span>" + getLocalizedString(language, "RightMenu", "RightMenu_About") + "</a></li>");
                    }
                    return true;
                }
            },
            onItem: function (context, e) {
                var vv = $(e.target).attr("tabindex");
                if (sview.IsUseModelContextMenu()) {
                    if (vv === "0") {
                        var shapeList = selectionOperator.view.GetSelector().GetAll();
                        for (var i = 0; i < shapeList.length; i++) {
                            var shape = shapeList[i]
                            var id = shape.GetID();
                            var zTree = $.fn.zTree.getZTreeObj(assemblyTreeId);
                            var node = zTree.getNodeByParam("id", id);
                            node.checked = false;
                            zTree.updateNode(node, true);
                            zTree.refresh();
                        }
                        selectionOperator.HideCurrent();
                    }
                    else if (vv === "1") {
                        $(e.target).click(function () {
                            //初始化装配树的勾选状态
                            var treeObj = $.fn.zTree.getZTreeObj(assemblyTreeId);
                            var node = treeObj.getNodes();
                            var nodes = treeObj.transformToArray(node);// getChangeCheckedNodes();
                            if (nodes.length > 0) {
                                for (var i = 0; i < nodes.length; i++) {
                                    nodes[i].checked = false;
                                    treeObj.updateNode(nodes[i],true);
                                }
                                treeObj.refresh();
                            }
                            var shapeList = selectionOperator.view.GetSelector().GetAll();
                            for (var i = 0; i < shapeList.length; i++){
                                var shape = shapeList[i]
                                var id = shape.GetID();
                                var zTree = $.fn.zTree.getZTreeObj(assemblyTreeId);
                                var node = zTree.getNodeByParam("id", id);
                                node.checked = true;
                                zTree.updateNode(node, true);
                            }
                            selectionOperator.OnlyDisplayCurrent();
                        }());
                    }
                    else if (vv === "2") {
                        selectionOperator.DisplayInCenter();
                    }
                    else if (vv === "3") {
                        selectionOperator.ContinuousRotation();
                        if (option.isOpenCrot) {
                            option.isOpenCrot = false;
                        } else {
                            option.isOpenCrot = true;
                        }
                    }
                    else if (vv === "4") {
                        $(e.target).click(function () {
                            $("#aboutModal").modal('toggle');
                        }());
                    }
                    else if (vv === "5") {
                        $(e.target).click(function () {
                            $("#setColorModal").modal('toggle');
                        }());
                    }
                    else if (vv === "6") {
                        var curHandler = sview.view.GetTouchHandler() instanceof M3D.WalkthroughHandler;
                        if (!curHandler) {
                            CreateInfoWindow(e, getLocalizedString(language, "Alert", "Alert_Prompt"), getLocalizedString(language, "Alert", "Alert_Context"));
                            return true;
                        }
                        if (option.isOpenJoystick) {
                            DestoryJoystick();
                            $("#walking_joystick").prop('checked', false); //保持和界面checkbox同步
                            option.isOpenJoystick = false;
                        } else {
                            CreateJoystick();
                            $("#walking_joystick").prop('checked', true);
                            option.isOpenJoystick = true;
                        }
                    } else if (vv === "7") {
                        $("#selectColor").modal('toggle');
                        $('#pickone').colpick({
                            flat: true,
                            layout: 'hex',
                            submit: 1,
                            onSubmit: function (hsb, hex, rgb, el) {
                                SetModelColor(rgb.r, rgb.g, rgb.b);
                            }
                        });
                    } else if (vv === "8") {
                        RestoreSelectedModel();
                    }
                }
                else {
                    if (vv === "0") {
                        selectionOperator.ExchangeHidden();
                        //初始化装配树的勾选状态
                        var treeObj = $.fn.zTree.getZTreeObj(assemblyTreeId);
                        var node = treeObj.getNodes();
                        var nodes = treeObj.transformToArray(node);// getChangeCheckedNodes();
                        if (nodes.length > 0) {
                            for (var i = 0; i < nodes.length; i++) {
                                nodes[i].checked = !nodes[i].checked;
                                treeObj.updateNode(nodes[i]);
                            }
                            treeObj.refresh();
                        }
                    }
                    else if (vv === "1") {
                        selectionOperator.DisplayAll();
                        //初始化装配树的勾选状态
                        var treeObj = $.fn.zTree.getZTreeObj(assemblyTreeId);
                        var node = treeObj.getNodes();
                        var nodes = treeObj.transformToArray(node);
                        if (nodes.length > 0) {
                            for (var i = 0; i < nodes.length; i++) {
                                nodes[i].checked = true;
                                treeObj.updateNode(nodes[i], true);
                            }
                            treeObj.refresh();
                        }
                    }
                    else if (vv === "2") {
                        // 如果是漫游模式下，取消漫游
                        if (sview.view.GetUsingTouchHandlerType() == 0) {
                            $("#walking_touch_handler").prop('checked', false);
                            // 隐藏两个check和虚拟按键
                            $("#walking_joystick").prop('checked', false);
                            DestoryJoystick();
                        }
                        sview.SetUsingTouchHandlerType(3);
                        sviewFrameDiv.find('#dagger_bar').show();
                        sviewFrameDiv.find(".dface").addClass(BACKCOLOR[0]);
                        //sviewFrameDiv.find('#bottomMenu').hide();
                        sviewFrameDiv.find('#bottomMenu').addClass('hide');
						sviewFrameDiv.find(".pull-right").hide();//左边菜单隐藏
						sviewFrameDiv.find(".rotation").hide();//展示菜单隐藏
                    }
                    else if (vv === "3") {
                        selectionOperator.DisplayInCenter();
                    }
                    else if (vv === "4") {
                        selectionOperator.ContinuousRotation();
                        if (option.isOpenCrot) {
                            option.isOpenCrot = false;
                        } else {
                            option.isOpenCrot = true;
                        }
                    }
                    else if (vv === "5") {
                        $(e.target).click(function () {
                            $("#aboutModal").modal('toggle');
                        }());
                    }
                    else if (vv === "6") {
                        $(e.target).click(function () {
                            $("#setColorModal").modal('toggle');
                        }());
                    }
                    else if (vv === "7") {
                        var curHandler = sview.view.GetTouchHandler() instanceof M3D.WalkthroughHandler;
                        if (!curHandler) {
                            CreateInfoWindow(e, "<b langID='Alert.Alert_Prompt'>" + getLocalizedString(language, "Alert", "Alert_Prompt") + "</b>", "<b langID='Alert.Alert_Context'>" + getLocalizedString(language, "Alert", "Alert_Context") + "</b>");
                            return true;
                        }
                        if (option.isOpenJoystick) {
                            DestoryJoystick();
                            $("#walking_joystick").prop('checked', false);
                            option.isOpenJoystick = false;
                        } else {
                            CreateJoystick();
                            $("#walking_joystick").prop('checked', true);
                            option.isOpenJoystick = true;
                        }
                    }
                    else if (vv === "8") {
                        //设置
                        $(e.target).click(function () {
                            $("#settingModal").modal('toggle');
                        }());
                    }
                }
            }
        });
    }
	//设置动画播放进度条
	function setAniPercentage() {
	    var per = sviewFrameDiv.find("#ani_percentage")[0].value;
	    $("#ani_percentage").css('background-size', '0% 100%');
		if (per >= 0 && per <= 1) {
			sview.animationPlayer.SetPercent(per * 100);
			
		}
	}
    //设置剖切面位置
    function setPlanePosition() {
        var delta = sviewFrameDiv.find("#section_percentage")[0].value;
        if (delta >= 0 && delta <= 1) {
            SetClipValue(delta);
        }
    }

    function openfile() {
        fileInput.click();
    }

    function closefile() {
        sview.CloseFile();
    }
    //复位
    function RestoreView() {
        //持续旋转模型停止旋转
        sview.view.CloseSceneAnimation();
        // 推出爆炸工具栏和剖切工具栏
        if (sviewFrameDiv.find('#mainMenu').hasClass(BACKCOLOR[1])) {
            if ($("#note_bar").is(":hidden") &&
                $("#gesture_bar").is(":hidden") &&
                $("#measure_bar").is(":hidden")) {
                //sviewFrameDiv.find("#bottomMenu").show();
                sviewFrameDiv.find('#bottomMenu').removeClass('hide');
            }
        }
        if (sviewFrameDiv.find('#section_bar_type').hasClass('show')) {
            sviewFrameDiv.find("#section_bar_type").removeClass('show');
        }
        sviewFrameDiv.find("#explose_bar").addClass('hide');
        // 设置剖切值为0
        sview.ClearExplosive();
        sviewFrameDiv.find("#explosive_per").val(0);
        sview.view.GetSceneManager().GetSceneBox().Clear();
        SetExplosivePersentage(0);
        if (sviewFrameDiv.find('#explose_bar_third_type').hasClass('show')) {
            sviewFrameDiv.find("#explose_bar_third_type").removeClass('show');
        }
        sviewFrameDiv.find("#section_bar").addClass('hide');
        if ($(IsShowTransparent).hasClass(BACKCOLOR[0])) {
            $(IsShowTransparent).removeClass(BACKCOLOR[0]);
            sview.ShowTransparent();
        }
        //初始化装配树的勾选状态
        var treeObj = $.fn.zTree.getZTreeObj(assemblyTreeId);
        var selectObj = treeObj.getSelectedNodes();
        var node = treeObj.getNodes();
        var nodes = treeObj.transformToArray(node);
        if (nodes.length > 0) {
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].checked = true;
                treeObj.updateNode(nodes[i]);
            }
            treeObj.refresh();
        }
        if (isAssemlyOpen) {
            treeObj.selectNode(selectObj[0], true);
        }
        sview.RestoreView();
       // SetPerspective(6);
    }
    //设置视图角度
    function SetPerspective(type) {
        //持续旋转模型停止旋转
        sview.view.CloseSceneAnimation();
        sview.SetPerspective(type);
    }
    //线框图形模式
    function isShowWireFrame() {
        sview.IsShowWireframe();
    }
    //线框模式
    function isOnlyShowWireFrame() {
        sview.IsOnlyShowWireframe();
    }
    
    function setRenderMode(mode) {
        sview.setRenderMode(mode)
    }


    function SetClipValue(flag) {
        sview.SetClipValue(flag);
    }
    //设置显示方向xy/zy/zx
    function SetClipDir(direction) {
        sview.SetClipDirection(direction);
    }
    //剖切反向
    function SetOppositeDir() {
        sview.SetOppositeDir();
    }
    //剖切面显隐
    function IsShowClipHelppingPlane() {
        sview.IsShowClipHelppingPlane();
    }
    //盖面显隐
    function IsShowCappingPlane() {
        sview.IsShowCappingPlane();
    }
    //设置爆炸方式
    function SetExplosiveStyle(style) {
        sview.SetExplosiveStyle(style);
    }

    function SetExplosivePersentage(explosive_percentage) {
        sview.SetExplosivePersentage(explosive_percentage);
    }
    //设置爆炸位置
    function SetExplosivePosition() {
        var explosive_percentage = sviewFrameDiv.find("#explosive_per")[0].value;
        if (explosive_percentage >= 0 && explosive_percentage < 1) {
            SetExplosivePersentage(explosive_percentage);
        }
    }

    //1.0.8 虚拟摇杆
    var joystick = null;
    //创建虚拟摇杆
    function CreateJoystick() {
        joystick = nipplejs.create({
            zone: sviewFrameDiv.find('.joystick')[0],
            position: {                 // absolute position of the center in pixels
                top: '50%',
                left: '50%'
            },
            mode: "static",   // 'dynamic', 'static' or 'semi'
            color: ""
        });
        joystick.on('move dir start', function (evt, data) {
            if (data.angle && data.distance) {
                sview.joyStickOption.isJoysticPressing = true;
                var theta = data.angle.radian;
                sview.joyStickOption.strightSpd = data.distance * Math.sin(theta) / 80.0;
                sview.joyStickOption.sideSpd = data.distance * Math.cos(theta) / -80.0;
            }

        }).on('end', function (evt, data) {
            sview.joyStickOption.isJoysticPressing = false;
        });
        sviewFrameDiv.find('.back').css('opacity', '1.0').css('filter', 'alpha(opacity = 100)').css('-ms-filter', 'alpha(opacity=100)');
        sviewFrameDiv.find('.back').append("<img src = '" + sviewBaseUrl + "images/back.png' style='width:100%;height:100%; position:absolute;'/>");
        sviewFrameDiv.find('.front').append("<img src = '" + sviewBaseUrl + "images/front.png' style='width:100%;height:100%; position:absolute;'/>");
        $("#walking_joystick").prop('checked', true); //保持和界面checkbox同步
        sview.StartJoystick();
    }
    function RestoreSelectedModel() {
        sview.RestoreSelectedModel();
    }
    function SetModelColor(r,g,b) {
        sview.SetSelectModelColor(r/255.0, g/255.0, b/255.0);
        $("#selectColor").modal('hide');
    }
    //销毁虚拟摇杆
    function DestoryJoystick() {
        sview.EndJoystick();
        if (joystick) {
            joystick.destroy();
            joystick = null;
        }
        $("#walking_joystick").prop('checked', false);//保持和界面checkbox同步
    }

    function blobToFile(theBlob, fileName) {
        //A Blob() is almost a File() - it's just missing the two properties below which we will add
        theBlob.lastModifiedDate = new Date();
        theBlob.name = fileName;
        return theBlob;
    }

    sviewFrameDiv = $('#' + htmlelement);
    //初始化viewer
    renderCanvas = sviewFrameDiv.children("#renderCanvas")[0];
    sview = SView.CreateViewer(renderCanvas);
    var selectionOperator = new M3D.SelectionOperator(sview.view);
    SetReadListener();//进度条
    sview.updateAssemblyTree = updateAssemblyTree;
    sview.addAssemblyOver = addAssemblyOver;
    sview.MeasureError = MeasureError;
    sview.openModelsEnd = openModelsEnd;
    sview.inputTextNote = inputTextNote;
    sview.showRightMenuInIos = showRightMenuInIos;
    sview.CloseRightMenuInIos = CloseRightMenuInIos;
    sview.PorpertyMeasureCallBack = PorpertyMeasureCallBack;
    sview.DoubleTouchListener = DoubleTouchListener;
    sview.SHotSpotDescribeListener = SHotSpotDescribeListener;

    //set sview options
    sview.pmiOptions.usePMI = option.usePMI;
    sview.pmiOptions.pmiServer = option.pmiServer;


    ContextMenu();
    initToobarClick();
    fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    // 设置默认开启剖切面和剖切盖面
    sviewFrameDiv.find('#section_plane').addClass(BACKCOLOR[0]);
    sviewFrameDiv.find('#section_cappingPlane').addClass(BACKCOLOR[0]);

    sviewFrameDiv.find('#showEdgeLine').addClass(BACKCOLOR[0]);
    IsShowClipHelppingPlane();
    IsShowCappingPlane();
    var flagTestBlob = false;
    fileInput.addEventListener('change', function (event) {
        if (flagTestBlob) {
            //test
            var srcFile = fileInput.files[0];
            //var reader = new FileReader;
            //reader.readAsArrayBuffer(file);
            //var blob = new Blob([file.], { type: 'application/octet-binary' });
            var blobUrl = URL.createObjectURL(srcFile);

            var xhr = new XMLHttpRequest;
            xhr.responseType = 'blob';

            xhr.onload = function () {
                if (this.status == 200) {
                    var recoveredBlob = xhr.response;
                    var blobfile = blobToFile(recoveredBlob, srcFile.name)
                    var fileList = [blobfile];
                    sview0.OpenFile(fileList);
                }
            };

            xhr.open('GET', blobUrl);
            xhr.send();
        } else {
            var readState = sview.OpenFile(fileInput.files);
            //SetReadListener();
            if (readState !== "OK") {
                alert(getLocalizedString(language, "OpenErorr", "SelectBin"));
            }
        }
    });

    //打开本地文件按钮
    //暂时屏蔽掉打开按钮显示，测试时放开： //sviewFrameDiv.append(fileInput);
    //sviewFrameDiv.append(fileInput);
    showFPS();
    if (sviewList.indexOf(sview) == -1) {
        sviewList.push(sview);
        frameDivList.push(sviewFrameDiv);
    }

    initAnimatioTools();
    animate();

    return sview;
}
function AnimationStateUpdate(sview, sviewFrameDiv, option) {

    //  var sectionPercectProgress = sviewFrameDiv.find("#ani_percentage");
    // sectionPercectProgress.val(sview.AnimationGetSliderValue());
    // if (option.animationStatus != sview.GetIsPlaying()) {
    //     option.animationStatus = !option.animationStatus;
    //     var pauseBtn = sviewFrameDiv.find(".ani-pause");
    //     if (option.animationStatus == 0) {
    //         pauseBtn.html("<img src='./images/button_ani.png' alt='开始' title='开始'>");
    //     }
    //     else {
    //         pauseBtn.html("<img src='./images/button_pause.png' alt='暂停' title='暂停'>");
    //     }
    // }
}
function initAnimatioTools() {

    
    sview_anima_step_panel = $('#sview_anima_step_panel');
    sview_anima_step_panel_lite = $("#sview_anima_step_panel_lit");
    sview_anima_step_toggle_btn = $("#hideBtnDiv");
    // var sview0 = initSView("sview0");
    //         try {
    //             //参数1使用转换后的jsvl和bin文件的压缩包网址。
    //             //参数2说明是否为zip包
    //             //参数3为压缩包内的文件名称，可能与压缩包名不一致
    //             //参数4是文件格式
    //             //中文时需增加服务端utf-8路径配置。
    //             sview0.OpenRemote("zfile/reducer_ani.zip", true, "", "jsvl");
    //         } catch (e) {
    //             alert("无法正常打开，请检查原始模型是否正确或联系客服人员！");
    //             $("#jdzw").css("width", "100%");
    //             $("#jdz").html("<span style='color:red;'>无法正常打开，请检查原始模型是否正确或联系客服人员！</span>");
    //         }



    //开始设置动画面板

    var imgBtn2 = $("#hideBtn");

    ani_step_lit = $("#sview_anima_step_panel_lit");
    ani_step_all = $("#sview_anima_step_panel_all");
    var ani_step_panel = $("#stepZtreePanel");
    DragDiv("#sview_anima_step_panel_lit_title")

		var el="#sview_anima_step_panel_lit";
		var abs_x;
		var abs_y;
		var isMove;
		var system = {};
		var p = navigator.platform;
		system.win = p.indexOf("Win") == 0;
		system.mac = p.indexOf("Mac") == 0;
		system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
		if (system.win || system.mac || system.xll) {
		    $(el).mousedown(function (event) {
		        isMove = true;
		        abs_x = event.pageX - $(el).offset().left;
		        abs_y = event.pageY - $(el).offset().top;
		    });
		    $(el).mousemove(function (event) {
		        if (!isMove) {
		            return;
		        }
		        var offset_l = event.clientX - abs_x;
		        var offset_t = event.clientY - abs_y;


		        if (offset_l >= $(window).width() - $(el).width()) {
		            offset_l = $(window).width() - $(el).width();
		        }
		        if (offset_t >= $(window).height() - $(el).height()) {
		            offset_t = $(window).height() - $(el).height();
		        }
		        if ($(sview_anima_step_panel).css('display') != "none") {
		            var obj1top = parseInt($(sview_anima_step_panel).css("top"));
		            var obj1left = parseInt($(sview_anima_step_panel).css("left"));
		            var obj1width = parseInt($(sview_anima_step_panel).width());
		            var obj1height = parseInt($(sview_anima_step_panel).height());
		            var obj2top = parseInt($(el).css("top"));
		            var obj2left = parseInt($(el).css("left"));
		            var obj2width = parseInt($(el).width());
		            var obj2height = parseInt($(el).height());
		        }
		        if (offset_l < 0) {
		            offset_l = 0;
		        }
		        if (offset_t < 0) {
		            offset_t = 0;
		        }
		        if (isMove) {
		            var obj = $(el);
		            obj.css({ 'left': offset_l, 'top': offset_t })
		        }
		    });
		    $(el).mouseup(function (event) {
		        isMove = false;
		    });
		} else {
		    $(el).resize(function (event) {
		        var offset_l = $(window).width() - $(el).width();
		        var offset_t = 0;
		        var obj = $(el);
		        obj.css({ 'left': offset_l, 'top': offset_t })
		    });
		    document.getElementById("sview_anima_step_panel_lit").addEventListener('touchstart', function (event) {
		        event.preventDefault();
		        isMove = true;
		        abs_x = event.touches[0].clientX - $(el).offset().left;
		        abs_y = event.touches[0].clientY - $(el).offset().top;
		    }, false);
		    document.getElementById("sview_anima_step_panel_lit").addEventListener('touchmove', function (event) {
		        event.preventDefault();
		        if (!isMove) {
		            return;
		        }
		        var offset_l = event.touches[0].clientX - abs_x;
		        var offset_t = event.touches[0].clientY - abs_y;


		        if (offset_l >= $(window).width() - $(el).width()) {
		            offset_l = $(window).width() - $(el).width();
		        }
		        if (offset_t >= $(window).height() - $(el).height()) {
		            offset_t = $(window).height() - $(el).height();
		        }
		        if ($(sview_anima_step_panel).css('display') != "none") {
		            var obj1top = parseInt($(sview_anima_step_panel).css("top"));
		            var obj1left = parseInt($(sview_anima_step_panel).css("left"));
		            var obj1width = parseInt($(sview_anima_step_panel).width());
		            var obj1height = parseInt($(sview_anima_step_panel).height());
		            var obj2top = parseInt($(el).css("top"));
		            var obj2left = parseInt($(el).css("left"));
		            var obj2width = parseInt($(el).width());
		            var obj2height = parseInt($(el).height());
		        }
		        if (offset_l < 0) {
		            offset_l = 0;
		        }
		        if (offset_t < 0) {
		            offset_t = 0;
		        }
		        if (isMove) {
		            var obj = $(el);
                    obj.css({ 'left': offset_l, 'top': offset_t })
		        }
		    }, false);
		    document.getElementById("sview_anima_step_panel_lit").addEventListener('touchend', function (event) {
		        event.preventDefault();
		        isMove = false;
		    }, false);
		}

    //})
    //TODO 设置展开缩放按钮显示

    imgBtn2.click(function (e) {
        /* Act on the event */
        sview_anima_step_panel.toggle();
        if (sview_anima_step_panel.css('display') == "none") {
            $("#hideBtnDiv img").attr("src", sviewBaseUrl + 'images/sview_ani_anilist_open.png');
        } else {
            $("#hideBtnDiv img").attr("src", sviewBaseUrl + 'images/sview_ani_anilist_close.png');
        }
        e.stopPropagation();
    });
    
    //console.log(sview.view.GetSceneManager().GetModel())
};


var fps = 40;
var now;
var then = Date.now();
var interval = 1000 / fps;
var delta;
function animate() {

    requestAnimationFrame(animate);
    now = Date.now();
    delta = now - then;
    if (delta > interval) {
        // 这里不能简单then=now，否则还会出现上边简单做法的细微时间差问题。例如fps=10，每帧100ms，而现在每16ms（60fps）执行一次draw。16*7=112>100，需要7次才实际绘制一次。这个情况下，实际10帧需要112*10=1120ms>1000ms才绘制完成。
        then = now - (delta % interval);
        //这里还需要增加可见性判断，如果不可见，可以不用调用刷新
        for (var sviewIndex = 0; sviewIndex < sviewList.length; sviewIndex++) {
            sviewList[sviewIndex].Draw();
            AnimationStateUpdate(sviewList[sviewIndex], frameDivList[sviewIndex], options[sviewIndex]);
        }
    }
}



/**
 * 设置分段动画缩略部分步骤和过程名称
 * @param {[文本]} title  过程名称
 * @param {文本} detail 步骤名称
 */
function setStepInfo(title, detail, info) {
    $(function () {
        var sview_ani_lit_title = $("#sview_anima_step_panel_lit_title");
        var sview_ani_lit_stepName = $("#sview_anima_step_panel_lit_stepName");

        sview_ani_lit_title.text(title);

        sview_ani_lit_stepName.html('<p>' + detail + '</p><p>' + info + '</p>');


    })
}
 function ClearSubmit(e) {
            if (e.keyCode == 13) {
                return false;
            }
   }
function DragDiv(el) {
    $(el).on(function (e) {
        var oEvent = e || window.event;
        var disx = oEvent.clientX - $(el).offset().left;
        var disy = oEvent.clientY - $(el).offset().right;
        var _move = true;
        $(document).mousemove(function (e) {
            if (_move) {
                var oEvent = e || window.event;
                var offset_l = oEvent.clientX - disx;
                var offset_t = oEvent.clientY - disy;
                if (offset_l <= 0) {
                    offset_l = 0
                } else if (offset_l >= $(window).width() - $(el).width()) {
                    offset_l = $(window).width() - $(el).width();
                }
                if (offset_t <= 0) {
                    offset_t = 0
                } else if (offset_t >= $(window).height() - $(el).height()) {
                    offset_t = $(window).height() - $(el).height();
                }
                $(el).css({ left: offset_l, top: offset_t })
            }
        }).mouseup(function () {
            _move = false;
        })
    })
}
function getLocalizedString(languages, title, text) {
    var resource =  languages[title][text];
    if (resource == undefined) {
        alert("not found this lanaguage resource");
    }
    return resource;
}
function settingAbout() {
    /*选择开关*/
    //持续旋转开关
    $(document).ready(function () {
        $("#rotateswitch").on('click', function () {
            clickSwitchClick()
        });

        var clickSwitchClick = function () {
			var opens = true;
            if ($("#rotateswitch").is(':checked')) {
                M3D.CookieHelper.DeleteCookie('rotate');
                M3D.CookieHelper.AddCookie('rotate', '1', '30');
				opens = true;
            } else {
                M3D.CookieHelper.DeleteCookie('rotate');
                M3D.CookieHelper.AddCookie('rotate', '0', '30');
				opens = false;
            }
			sview.view.SetConRotate(opens);
        };
        
    });
    
    
    //Catia模式开关
    $(document).ready(function () {
        $("#catiaswitch").on('click', function () {
            clickSwitch()
        });

        var clickSwitch = function () {
			var opens = true;
            if ($("#catiaswitch").is(':checked')) {
                M3D.CookieHelper.DeleteCookie('catia');
                M3D.CookieHelper.AddCookie('catia', '1', '30');
				opens = true;
            } else {
                M3D.CookieHelper.DeleteCookie('catia');
                M3D.CookieHelper.AddCookie('catia', '0', '30');
				opens = false;
            }
			sview.view.SetCatia(opens);
        };
    });
    //高性能模式开关
    $(document).ready(function () {
        $("#highLightswitch").on('click', function () {
            clickSwitch()
        });

        var clickSwitch = function () {
			var opens = true;
            if ($("#highLightswitch").is(':checked')) {
                M3D.CookieHelper.DeleteCookie('highPerformance');
                M3D.CookieHelper.AddCookie('highPerformance', '1', '30');
				opens = true;
            } else {
                M3D.CookieHelper.DeleteCookie('highPerformance');
                M3D.CookieHelper.AddCookie('highPerformance', '0', '30');
				opens = false;
            }
			sview.view.SetHighPerformance(opens);
        };
    });
    //LOD使用开关
    $(document).ready(function () {
        $("#lodswitch").on('click', function () {
            clickSwitch()
        });

        var clickSwitch = function () {
			var opens = true;
            if ($("#lodswitch").is(':checked')) {
                M3D.CookieHelper.DeleteCookie('lod');
                M3D.CookieHelper.AddCookie('lod', '1', '30');
				opens = true;
            } else {
                M3D.CookieHelper.DeleteCookie('lod');
                M3D.CookieHelper.AddCookie('lod', '0', '30');
				opens = false;
            }
			sview.view.SetUseLOD(opens);
        };
    });
    //PIM开关
    $(document).ready(function () {
        $("#pimswitch").on('click', function () {
            clickSwitch()
        });

        var clickSwitch = function () {
			var opens = true;
            if ($("#pimswitch").is(':checked')) {
                M3D.CookieHelper.DeleteCookie('pim');
                M3D.CookieHelper.AddCookie('pim', '1', '30');
				opens = true;
            } else {
                M3D.CookieHelper.DeleteCookie('pim');
                M3D.CookieHelper.AddCookie('pim', '0', '30');
				opens = false;
            }
			sview.view.SetUsePMI(opens);
        };
    });
    //自动漫游开关
    $(document).ready(function () {
        $("#autoWalk").on('click', function () {
            roamAutomatic()
        });

        var roamAutomatic = function (obj) {
			var opens = true;
            if ($("#autoWalk").is(':checked') || obj == 1) {
                M3D.CookieHelper.DeleteCookie('roamAutomatic');
                M3D.CookieHelper.AddCookie('roamAutomatic', '1', '30');
				opens = true;
            } else {
                M3D.CookieHelper.DeleteCookie('roamAutomatic');
                M3D.CookieHelper.AddCookie('roamAutomatic', '0', '30');
				opens = false;
            }
			sview.view.SetRoamAutomatic(opens);
        };
    });
    //循环播放开关
    $(document).ready(function () {
        $("#aniLoop").on('click', function () {
            loopPlayback()
        });

        var loopPlayback = function (obj) {
            if ($("#aniLoop").is(':checked') || obj == 1) {
                M3D.CookieHelper.DeleteCookie('loopPlayback');
                M3D.CookieHelper.AddCookie('loopPlayback', '1', '30');
            } else {
                M3D.CookieHelper.DeleteCookie('loopPlayback');
                M3D.CookieHelper.AddCookie('loopPlayback', '0', '30');
            }
        };
    });
    $(document).ready(function () {
        initSetting();
    });
    function initSetting () {
        var rotateValue;
        var mergefaceValue;
        var catiaValue;
        var highPerformanceValue;
        var lodValue;
        var pimValue;
        var roamAutomaticValue;
        var loopPlaybackValue;
        var removeThing;
        var removeSize;
        var measureUnit;
        var language;
        var selectType;
        var selectColor;


        rotateValue = M3D.CookieHelper.GetCookie('rotate');
        mergefaceValue = M3D.CookieHelper.GetCookie('mergeface');
        catiaValue = M3D.CookieHelper.GetCookie('catia');
        highPerformanceValue = M3D.CookieHelper.GetCookie('highPerformance');
        lodValue = M3D.CookieHelper.GetCookie('lod');
        pimValue = M3D.CookieHelper.GetCookie('pim');
        roamAutomaticValue = M3D.CookieHelper.GetCookie('roamAutomatic');
        loopPlaybackValue = M3D.CookieHelper.GetCookie('loopPlayback');
        removeThing = M3D.CookieHelper.GetCookie('removeSmallThing');
        removeSize = M3D.CookieHelper.GetCookie('removeSmallSize');
        measureUnit = M3D.CookieHelper.GetCookie('measureUnit');
        language = M3D.CookieHelper.GetCookie('languageType');
        selectType = M3D.CookieHelper.GetCookie('selectType');
        selectColor = M3D.CookieHelper.GetCookie('selectedColor');


        var rotateCheck = document.getElementById('rotateswitch');
        var mergefaceCheck = document.getElementById('mergefaceswitch');
        var catiaCheck = document.getElementById('catiaswitch');
        var highLightCheck = document.getElementById('highLightswitch');
        var lodCheck = document.getElementById('lodswitch');
        var pimCheck = document.getElementById('pimswitch');
        var roamAutomaticCheck = document.getElementById('autoWalk');
        var loopPlaybackCheck = document.getElementById('aniLoop');
        var roamAutomaticCheck = document.getElementById('autoWalk');
        var loopPlaybackCheck = document.getElementById('aniLoop');
        var removeThingSelect = document.getElementById('removeSmallThing');
        var removeSizeSelect = document.getElementById('removeSmallSize');
        var measureUnitSelect = document.getElementById('measureUnit');
        var languageSelect = document.getElementById('languageSet');
        var selectTypeSelect = document.getElementById('selectType');
        var selectColorButton = document.getElementById('selectedColor');

        if (selectColor) {
            var colors = selectColor.split(' ');
            selectColorButton.style.background = "rgb(" + String(parseFloat(colors[0]) * 255.0) + "," + String(parseFloat(colors[1]) * 255.0) + "," + String(parseFloat(colors[2]) * 255.0) + ")";
        } else {
            selectColorButton.style.background = "rgb(" + String(1.00 * 255.0) + "," + String(0.00 * 255.0) + "," + String(0.00 * 255.0) + ")";
        }

        if (selectType) {
            $("#selectType").val(selectType);
        } else {
            $("#selectType").val("1");
        }

        if (language) {
            $("#languageSet").val(language);
        } else {
            $("#languageSet").val("cn");
        }

        if (removeThing) {
            $("#removeSmallThing").val(removeThing);
        }else{
            $("#removeSmallThing").val("model");
        }
        if (removeSize) {
            $("#removeSmallSize").val(removeSize);
        } else {
            $("#removeSmallSize").val('0');
        }
        if (measureUnit) {
            $("#measureUnit ").val(measureUnit);
        }else{
            $("#measureUnit ").val('0');
        }
        //持续旋转开关
        if (rotateValue == 1 && rotateValue != 'undefined') {
            if (rotateCheck) {
                rotateCheck.checked = true;
            }
        } else {
            if (rotateCheck) {
                rotateCheck.checked = false;
            }
        }
        //合并面开关
        if ((mergefaceValue == 1 && mergefaceValue != 'undefined') || mergefaceValue==undefined) {
            if (mergefaceCheck) {
                mergefaceCheck.checked = true;
            }
        } else {
            if (mergefaceCheck) {
                mergefaceCheck.checked = false;
            }
        }
        //Catia模式开关
        if (catiaValue == 1 && catiaValue != 'undefined') {
            if (catiaCheck) {
                catiaCheck.checked = true;
            }
        } else {
            if (catiaCheck) {
                catiaCheck.checked = false;
            }
        }
        //高性能模式开关
        if (highPerformanceValue == 1 && highPerformanceValue != 'undefined') {
            if (highLightCheck) {
                highLightCheck.checked = true;
            }
        } else {
            if (highLightCheck) {
                highLightCheck.checked = false;
            }
        }
        //LOD使用开关
        if (lodValue == 1 && lodValue != 'undefined') {
            if (lodCheck) {
                lodCheck.checked = true;
            }
        } else {
            if (lodCheck) {
                lodCheck.checked = false;
            }
        }
        //PIM开关
        if (pimValue == 1 && pimValue != 'undefined') {
            if (pimCheck) {
                pimCheck.checked = true;
            }
        } else {
            if (pimCheck) {
                pimCheck.checked = false;
            }
        }
        //自动漫游开关
        if (roamAutomaticValue == 1 || roamAutomaticValue == undefined) {
            roamAutomaticCheck.checked = true;
        } else {
            roamAutomaticCheck.checked = false;
        }
        //持续播放开关
        if (loopPlaybackValue == 1 || loopPlaybackValue == undefined) {
            loopPlaybackCheck.checked = true;
        } else {
            loopPlaybackCheck.checked = false;
        }
    }
    $(document).ready(function () {
        $("input").bind("input", function () {
            if ($(this).attr("type") == "range") {
                $(this).css('background-size', String(Number(this.value) * 100) + '% 100%');
            }
        });
        $("input").bind("change", function () {
            if ($(this).attr("type") == "range") {
                $(this).css('background-size', String(Number(this.value) * 100) + '% 100%');
            }
        });
    });
    //播放速度
    $(document).ready(function () {
        $("#playbackSpeed").on('change', function () {
            playbackSpeed();
        });
        var playbackSpeed = function (obj) {
            var selectedNum = document.getElementById('playbackSpeed').selectedIndex;
            if (selectedNum == 0 || obj == '0.5') {
                //0.5x
                M3D.CookieHelper.DeleteCookie('playbackSpeed');
                M3D.CookieHelper.AddCookie('playbackSpeed', '0.5x', '30');
            } else if (selectedNum == 1 || obj == '1') {
                //1x
                M3D.CookieHelper.DeleteCookie('playbackSpeed');
                M3D.CookieHelper.AddCookie('playbackSpeed', '1x', '30');
            } else if (selectedNum == 2 || obj == '2') {
                //2x
                M3D.CookieHelper.DeleteCookie('playbackSpeed');
                M3D.CookieHelper.AddCookie('playbackSpeed', '2x', '30');
            } else if (selectedNum == 3 || obj == '3') {
                //4x
                M3D.CookieHelper.DeleteCookie('playbackSpeed');
                M3D.CookieHelper.AddCookie('playbackSpeed', '4x', '30');
            } else {
                //8x
                M3D.CookieHelper.DeleteCookie('playbackSpeed');
                M3D.CookieHelper.AddCookie('playbackSpeed', '8x', '30');
            }
        };
    }); 
    //选择颜色
    $(document).ready(function () {
        $("#selectedColor").on('click', function () {
            setColor();
        });
        var setColor = function () {
            $("#settingModal").modal('hide');
            $("#edgeSelectColor").modal('toggle');
            $('#picktwo').colpick({
                flat: true,
                layout: 'hex',
                submit: 1,
                onSubmit: function (hsb, hex, rgb, el) {
                    SetColor(rgb);
                }
            });
        };
    });
    function SetColor(rgb) {
        var newColor = new M3D.Color(rgb.r / 255.0, rgb.g / 255.0, rgb.b / 255.0);
        M3D.CookieHelper.AddCookie(M3D.EDGECOLOR, newColor.Tostring(), 30);
        sview.view.SetEdgeSelector(newColor);
        M3D.Color.selectColor = newColor;
        $("#edgeSelectColor").modal('hide');
        var selectColorButton = document.getElementById('selectedColor');
        selectColorButton.style.background = "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
    }
    //小件剔除
    $(document).ready(function () {
        $("#removeSmallThing").on('change', function () {
            removeSmallThing();
        });
        var removeSmallThing = function () {
            var selectedNum = document.getElementById('removeSmallThing').selectedIndex;
            if (selectedNum == 0) {
                //模型
                M3D.CookieHelper.DeleteCookie('removeSmallThing');
                M3D.CookieHelper.AddCookie('removeSmallThing', 'model', '30');
            } else {
                //屏幕
                M3D.CookieHelper.DeleteCookie('removeSmallThing');
                M3D.CookieHelper.AddCookie('removeSmallThing', 'screen', '30');
            }
			sview.view.SetRemoveSmallThing(selectedNum);
        };
    }); 
    //选择样式
    $(document).ready(function () {
        $("#selectType").on('change', function () {
            setSelectType();
        });
        var setSelectType = function () {
            var selectedNum = document.getElementById('selectType').selectedIndex;
            if (selectedNum == 0) {
                //模型
                M3D.CookieHelper.DeleteCookie('selectType');
                M3D.CookieHelper.AddCookie('selectType', '1', '30');
            } else {
                //屏幕
                M3D.CookieHelper.DeleteCookie('selectType');
                M3D.CookieHelper.AddCookie('selectType', '2', '30');
            }
            sview.setSelectType(selectedNum +　1);
        };
    });
    //小件剔除大小
    $(document).ready(function () {
        $("#removeSmallSize").on('change', function () {
            removeSmallSize();
        });
        var removeSmallSize = function () {
            var selectedNum = document.getElementById('removeSmallSize').selectedIndex;
			var num = 0;
            if (selectedNum == 0) {
                //0
                M3D.CookieHelper.DeleteCookie('removeSmallSize');
                M3D.CookieHelper.AddCookie('removeSmallSize', '0', '30');
				num = 0;
            } else if (selectedNum == 1) {
                //2%
                M3D.CookieHelper.DeleteCookie('removeSmallSize');
                M3D.CookieHelper.AddCookie('removeSmallSize', '2', '30');
				num = 2;
            } else if (selectedNum == 2) {
                //4%
                M3D.CookieHelper.DeleteCookie('removeSmallSize');
                M3D.CookieHelper.AddCookie('removeSmallSize', '4', '30');
				num = 4;
            } else if (selectedNum == 3) {
                //6%
                M3D.CookieHelper.DeleteCookie('removeSmallSize');
                M3D.CookieHelper.AddCookie('removeSmallSize', '6', '30');
				num = 6;
            } else if (selectedNum == 4) {
                //8%
                M3D.CookieHelper.DeleteCookie('removeSmallSize');
                M3D.CookieHelper.AddCookie('removeSmallSize', '8', '30');
				num = 8;
            } else if (selectedNum == 5) {
                //10%
                M3D.CookieHelper.DeleteCookie('removeSmallSize');
                M3D.CookieHelper.AddCookie('removeSmallSize', '10', '30');
				num = 10;
            } else if (selectedNum == 6) {
                //12%
                M3D.CookieHelper.DeleteCookie('removeSmallSize');
                M3D.CookieHelper.AddCookie('removeSmallSize', '12', '30');
				num = 12;
            } else if (selectedNum == 7) {
                //14%
                M3D.CookieHelper.DeleteCookie('removeSmallSize');
                M3D.CookieHelper.AddCookie('removeSmallSize', '14', '30');
				num = 14;
            } else if (selectedNum == 8) {
                //16%
                M3D.CookieHelper.DeleteCookie('removeSmallSize');
                M3D.CookieHelper.AddCookie('removeSmallSize', '16', '30');
				num = 16;
            } else if (selectedNum == 9) {
                //18%
                M3D.CookieHelper.DeleteCookie('removeSmallSize');
                M3D.CookieHelper.AddCookie('removeSmallSize', '18', '30');
				num = 18;
            } else if (selectedNum == 10) {
                //20%
                M3D.CookieHelper.DeleteCookie('removeSmallSize');
                M3D.CookieHelper.AddCookie('removeSmallSize', '20', '30');
				num = 20;
            } else if (selectedNum == 11) {
                //30%
                M3D.CookieHelper.DeleteCookie('removeSmallSize');
                M3D.CookieHelper.AddCookie('removeSmallSize', '30', '30');
				num = 30;
            } else if (selectedNum == 12) {
                //40%
                M3D.CookieHelper.DeleteCookie('removeSmallSize');
                M3D.CookieHelper.AddCookie('removeSmallSize', '40', '30');
				num = 40;
            } else if (selectedNum == 13) {
                //50%
                M3D.CookieHelper.DeleteCookie('removeSmallSize');
                M3D.CookieHelper.AddCookie('removeSmallSize', '50', '30');
				num = 50;
            }
            sview.view.SetRemoveSmallSize(num);
        };
    });
    //测量单位
    $(document).ready(function () {
        $("#measureUnit").on('change', function () {
            measureUnit();
        });
        var measureUnit = function () {
            var selectedNum = document.getElementById('measureUnit').selectedIndex;
            if (selectedNum == 0) {
                //无
                M3D.CookieHelper.DeleteCookie('measureUnit');
                M3D.CookieHelper.AddCookie('measureUnit', '0', '30');
            } else if (selectedNum == 1) {
                //毫米
                M3D.CookieHelper.DeleteCookie('measureUnit');
                M3D.CookieHelper.AddCookie('measureUnit', '1', '30');
            } else if (selectedNum == 2) {
                //厘米
                M3D.CookieHelper.DeleteCookie('measureUnit');
                M3D.CookieHelper.AddCookie('measureUnit', '2', '30');
            } else if (selectedNum == 3) {
                //米
                M3D.CookieHelper.DeleteCookie('measureUnit');
                M3D.CookieHelper.AddCookie('measureUnit', '3', '30');
            } else if (selectedNum == 4) {
                //英寸
                M3D.CookieHelper.DeleteCookie('measureUnit');
                M3D.CookieHelper.AddCookie('measureUnit', '4', '30');
            } else if (selectedNum == 5) {
                //英尺
                M3D.CookieHelper.DeleteCookie('measureUnit');
                M3D.CookieHelper.AddCookie('measureUnit', '5', '30');
            }
			sview.view.SetMeasureUnit(selectedNum);
        };
    });

    $(document).ready(function () {
        var removeSize;
        var removeThing;
        var measureUnity;
        var playSpeed;

        removeThing = M3D.CookieHelper.GetCookie('removeSmallThing');
        removeSize = M3D.CookieHelper.GetCookie('removeSmallSize');
        measureUnity = M3D.CookieHelper.GetCookie('measureUnit');
        playSpeed = M3D.CookieHelper.GetCookie('playbackSpeed');

        var removeThingSelect = document.getElementById('removeSmallThing');
        var removeSizeSelect = document.getElementById('removeSmallSize');
        var meaureUnitySelect = document.getElementById('measureUnit');
        var playbackSpeedSelect = document.getElementById('playbackSpeed');
        //播放速度
        if (playSpeed == '0.5x' && playSpeed != 'undefined') {
            //0.5x
            playbackSpeedSelect[0].selected = true;
        } else if (playSpeed == '1x' && playSpeed != 'undefined') {
            //1x
            playbackSpeedSelect[1].selected = true;
        } else if (playSpeed == '2x' && playSpeed != 'undefined') {
            //2x 
            playbackSpeedSelect[2].selected = true;
        } else if (playSpeed == '4x' && playSpeed != 'undefined') {
            //4x
            playbackSpeedSelect[3].selected = true;
        } else if (playSpeed == '8x' && playSpeed != 'undefined') {
            //8x
            playbackSpeedSelect[4].selected = true;
        }

        //小件剔除
        if (removeThing == 'model') {
            //模型
            removeThingSelect[0].selected = true;
        } else if (removeThing == 'screen' && removeThing != 'undefined') {
            //屏幕
            removeThingSelect[1].selected = true;
        }
        //小件剔除大小（%）
        if (removeSize == '0') {
            removeSizeSelect[0].selected = true;
        } else if (removeSize == '2' && removeSize != 'undefined') {
            removeSizeSelect[1].selected = true;
        } else if (removeSize == '4' && removeSize != 'undefined') {
            removeSizeSelect[2].selected = true;
        } else if (removeSize == '6' && removeSize != 'undefined') {
            removeSizeSelect[3].selected = true;
        } else if (removeSize == '8' && removeSize != 'undefined') {
            removeSizeSelect[4].selected = true;
        } else if (removeSize == '10' && removeSize != 'undefined') {
            removeSizeSelect[5].selected = true;
        } else if (removeSize == '12' && removeSize != 'undefined') {
            removeSizeSelect[6].selected = true;
        } else if (removeSize == '14' && removeSize != 'undefined') {
            removeSizeSelect[7].selected = true;
        } else if (removeSize == '16' && removeSize != 'undefined') {
            removeSizeSelect[8].selected = true;
        } else if (removeSize == '18' && removeSize != 'undefined') {
            removeSizeSelect[9].selected = true;
        } else if (removeSize == '20' && removeSize != 'undefined') {
            removeSizeSelect[10].selected = true;
        } else if (removeSize == '30' && removeSize != 'undefined') {
            removeSizeSelect[11].selected = true;
        } else if (removeSize == '40' && removeSize != 'undefined') {
            removeSizeSelect[12].selected = true;
        } else if (removeSize == '50' && removeSize != 'undefined') {
            removeSizeSelect[13].selected = true;
        }
        //测量单位
        if (measureUnity == '0') {
            //无
            meaureUnitySelect[0].selected = true;
        } else if (measureUnity == '1' && measureUnity != 'undefined') {
            //毫米
            meaureUnitySelect[1].selected = true;
        } else if (measureUnity == '2' && measureUnity != 'undefined') {
            //厘米
            meaureUnitySelect[2].selected = true;
        } else if (measureUnity == '3' && measureUnity != 'undefined') {
            //米
            meaureUnitySelect[3].selected = true;
        } else if (measureUnity == '4' && measureUnity != 'undefined') {
            //英寸
            meaureUnitySelect[4].selected = true;
        } else if (measureUnity == '5' && measureUnity != 'undefined') {
            //英尺
            meaureUnitySelect[5].selected = true;
        }
    });

    //设置背景
    $(document).ready(function () {
        $("#settingBack").on('click', function () {
            settingBackGround();
        });
        var settingBackGround = function () {
            $("#settingModal").modal('hide');
            $("#setColorModal").modal('toggle');
        }
    });
    //清除缓存
    $(document).ready(function () {
        $("#clearCache").on('click', function () {
            clearCache();
            sview.view.setCookie();
        });
        var clearCache = function () {
            M3D.CookieHelper.DeleteCookie('rotate');
            M3D.CookieHelper.DeleteCookie('mergeface');
            //M3D.CookieHelper.AddCookie('mergeface','1','30');
            M3D.CookieHelper.DeleteCookie('catia');
            M3D.CookieHelper.DeleteCookie('highPerformance');
            M3D.CookieHelper.DeleteCookie('lod');
            M3D.CookieHelper.DeleteCookie('pim');

            M3D.CookieHelper.DeleteCookie('removeSmallThing');
            M3D.CookieHelper.DeleteCookie('removeSmallSize');
            M3D.CookieHelper.DeleteCookie('measureUnit');

            M3D.CookieHelper.DeleteCookie('roamAutomatic');
            M3D.CookieHelper.DeleteCookie('loopPlayback');
            M3D.CookieHelper.DeleteCookie('bottomColorKey');
            M3D.CookieHelper.DeleteCookie('topColorKey');
            M3D.CookieHelper.DeleteCookie('languageType');
            M3D.CookieHelper.DeleteCookie('selectType');
            M3D.CookieHelper.DeleteCookie('selectedColor');
            // 重新设置设置页面显示
            initSetting();
            $("#settingModal").modal('hide');
            $("#sucessClear").modal('show');
        }
    });
    //用户反馈
    $(document).ready(function () {
        $("#userFeedback").on('click', function () {
            userFeedback();
        });
        var userFeedback = function () {
            $("#settingModal").modal('hide');
            $("#feedback").modal('show');
        }
    });

}

